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
import { verify } from "hcaptcha";
import { validateCSRFToken } from "./csrf.server";
import { checkRateLimit } from "./rateLimiter.server";
import i18next from "~/i18next.server";

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
    throw json({ error: "hCaptcha token is missing" }, { status: 400 });
  }

  const captchaSecret =
    process.env.NODE_ENV === "development"
      ? process.env.DUMMY_CAPTCHA_SECRET
      : process.env.CAPTCHA_SECRET;

  const secret = captchaSecret ?? "";
  const { success } = await verify(secret, token);
  if (!success) {
    throw json(
      { error: "Suspicious Activity: Cancelling", convertedFiles: null },
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
  }
  catch(e){ 
    return json(
      { error: "An unexpected error occurred", convertedFiles: null },
      { status: 500 }
    );
  }
}

export async function toolAction(request: Request) {
  try {
    await validateRateLimit(request);

    const formData = await parseFormData(request);
    const token = formData.get("h-captcha-response") as string;
    const lng = await i18next.getLocale(request)

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
        formData.append('language', lng)
        return handleEmailForm(formData);
      default:
        return handleFileConversion(files, format, formData);
    }
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return json(
      { error: "An unexpected error occurred", convertedFiles: null },
      { status: 500 }
    );
  }
}