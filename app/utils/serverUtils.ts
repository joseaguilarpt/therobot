import { honeypot } from "~/honeypot.server";
import { SpamError } from "remix-utils/honeypot/server";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { onSendCustomerEmail, onSendEmail } from "./mail.server";
import { validateCSRFToken } from "./csrf.server";
import { checkRateLimit } from "./rateLimiter.server";
import i18next from "~/i18next.server";
import axios from "axios";
import type { ActionFunction } from "@remix-run/node";

/**
 * Creates a file upload handler that supports both file system and memory uploads.
 */
export const createUploadHandler = () =>
  unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 52_428_800, // Max file size ~50MB
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

/**
 * Parses multipart form data from the request using the upload handler.
 */
export const parseFormData = async (request: Request) => {
  const uploadHandler = createUploadHandler();
  return await unstable_parseMultipartFormData(request, uploadHandler);
};

/**
 * Checks if the request exceeds the rate limit.
 * Throws a 429 error if the limit is exceeded.
 */
async function validateRateLimit(request: Request) {
  // @ts-ignore
  const identifier = request.headers.get("x-forwarded-for") || request.ip;
  const rateLimitError = await checkRateLimit(identifier);
  if (rateLimitError) {
    throw json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }
}

/**
 * Validates the reCAPTCHA token with Google's API.
 * Throws a 400 error if the token is missing or invalid.
 */
async function validateCaptcha(token: string) {
  if (!token) {
    throw json({ error: "reCAPTCHA token is missing" }, { status: 400 });
  }

  const captchaSecret = process.env.RCAPTCHA_SERVER;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${token}`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      }
    );

    const { success } = response.data;

    if (!success) {
      throw json(
        { error: "Suspicious Activity: Cancelling", convertedFiles: null },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    throw json(
      { error: "reCAPTCHA verification failed", convertedFiles: null },
      { status: 400 }
    );
  }
}

/**
 * Checks the honeypot field to detect spam bots.
 * Throws a 400 error if spam is detected.
 */
function validateHoneypot(formData: FormData) {
  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw json(
        { error: "Suspicious Activity: Cancelling", convertedFiles: null },
        { status: 400 }
      );
    }
  }
}

/**
 * Handles the contact form submission by sending a customer email.
 * Returns a JSON response indicating success or failure.
 */
async function handleContactForm(formData: FormData) {
  try {
    await onSendCustomerEmail(formData);
    return json({ contactEmailSent: true });
  } catch {
    return json(
      { contactError: "Error sending contact email" },
      { status: 400 }
    );
  }
}

/**
 * Handles the email form submission by sending an email.
 */
async function handleEmailForm(formData: FormData) {
  return await onSendEmail(formData);
}

/**
 * Main action function for handling form submissions.
 * Delegates to contactAction and handles errors.
 */
export const action: ActionFunction = async ({ request }) => {
  try {
    return await contactAction(request);
  } catch (error) {
    console.error("Error in action function:", error);
    return handleError(error);
  }
};

/**
 * Handles the logic for contact and email form submissions.
 * Validates rate limit, captcha, honeypot, and CSRF token.
 * Dispatches to the appropriate handler based on form type.
 */
export async function contactAction(request: Request) {
  try {
    await validateRateLimit(request);

    const formData = await parseFormData(request);
    const token = formData.get("g-recaptcha-response") as string;
    const lng = await i18next.getLocale(request);

    await validateCaptcha(token);
    validateHoneypot(formData);
    await validateCSRFToken(request, formData);

    const typeOperation = formData.get("type") as string;

    switch (typeOperation) {
      case "contact":
        return handleContactForm(formData);
      case "email":
        formData.append("language", lng);
        return handleEmailForm(formData);
      default:
        return json({ error: "Error", convertedFiles: null }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in contactAction:", error);
    throw error;
  }
}

/**
 * Handles errors by returning a JSON response with the error message.
 */
export function handleError(error: unknown) {
  console.error("Handling error:", error);

  if (error instanceof Response) {
    return error;
  }

  if (error instanceof Error) {
    return json(
      {
        error: error.message || "An unexpected error occurred",
        convertedFiles: null,
      },
      { status: 500 }
    );
  }

  return json(
    { error: "An unexpected error occurred", convertedFiles: null },
    { status: 500 }
  );
}
