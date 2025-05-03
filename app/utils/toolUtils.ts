import { honeypot } from "~/honeypot.server";
import {
  convertImagesToPdf,
  convertToOtherFormat,
  convertToSvg,
  parseFormData,
} from "./converter.server";
import { SpamError } from "remix-utils/honeypot/server";
import { json } from "@remix-run/node";
import { onSendCustomerEmail, onSendEmail } from "./mail.server";
import { validateCSRFToken } from "./csrf.server";
import { checkRateLimit } from "./rateLimiter.server";
import i18next from "~/i18next.server";
import axios from "axios";
import type { ActionFunction } from '@remix-run/node';

async function validateRateLimit(request: Request) {
  const identifier = request.headers.get("x-forwarded-for") || request.ip;
  const rateLimitError = await checkRateLimit(identifier);
  if (rateLimitError) {
    throw json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }
}

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

async function handleEmailForm(formData: FormData) {
  return await onSendEmail(formData);
}

async function handleFileConversion(
  files: File[],
  format: string,
  formData: FormData
) {
  if (files.length === 0 || !format) {
    throw json(
      { error: "Files and format are required", convertedFiles: null },
      { status: 400 }
    );
  }

  let convertedFiles: Array<{ fileUrl: string; fileName: string }>;

  try {
    if (format === "svg") {
      convertedFiles = await convertToSvg(files, format);
    } else if (format === "pdf") {
      const pdfType = formData.get("pdfType");
      const imageFiles = Array.from(files);
      convertedFiles = await convertImagesToPdf(
        imageFiles,
        pdfType === "separated"
      );
    } else {
      convertedFiles = await convertToOtherFormat(files, format);
    }

    return json({ convertedFiles });
  } catch (e) {
    return json(
      { error: "An unexpected error occurred", convertedFiles: null },
      { status: 500 }
    );
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await toolAction(request);
  } catch (error) {
    console.error('Error in action function:', error);
    return handleError(error);
  }
};

export async function toolAction(request: Request) {
  try {
    await validateRateLimit(request);

    const formData = await parseFormData(request);
    const token = formData.get("g-recaptcha-response") as string;
    const lng = await i18next.getLocale(request);

    await validateCaptcha(token);
    validateHoneypot(formData);
    await validateCSRFToken(request, formData);

    const typeOperation = formData.get("type") as string;
    const files = formData.getAll("file") as File[];
    const format = formData.get("format") as string;

    switch (typeOperation) {
      case "contact":
        return handleContactForm(formData);
      case "email":
        formData.append("language", lng);
        return handleEmailForm(formData);
      default:
        return handleFileConversion(files, format, formData);
    }
  } catch (error) {
    console.error('Error in toolAction:', error);
    throw error; // Re-throw the error to be caught by the action function
  }
}

export function handleError(error: unknown) {
  console.error('Handling error:', error);

  if (error instanceof Response) {
    return error;
  }

  if (error instanceof Error) {
    return json(
      { error: error.message || "An unexpected error occurred", convertedFiles: null },
      { status: 500 }
    );
  }

  return json(
    { error: "An unexpected error occurred", convertedFiles: null },
    { status: 500 }
  );
}