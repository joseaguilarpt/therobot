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

export async function toolAction(request: any) {

  const identifier = request.headers.get('x-forwarded-for') || request.ip;

  // Check rate limit
  const rateLimitError = await checkRateLimit(identifier);
  if (rateLimitError) {
    return json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  const formData = await parseFormData(request);
  const token = formData.get("h-captcha-response") as string;

  if (!token) {
    return json({ error: "hCaptcha token is missing" }, { status: 400 });
  }

  try {
    const secret = process.env.DUMMY_CAPTCHA_SECRET ?? "";
    const { success } = await verify(secret, token);
    if (!success) {
      return json(
        { error: "Suspicious Activity: Cancelling", convertedFiles: null },
        { status: 400 }
      );
    }
  } catch {
    return json(
      { error: "Suspicious Activity: Cancelling", convertedFiles: null },
      { status: 400 }
    );
  }

  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      return json(
        { error: "Suspicious Activity: Cancelling", convertedFiles: null },
        { status: 400 }
      );
    }
  }

  try {
    await validateCSRFToken(request, formData);
  } catch (error) {
    return json(
      { error: 'Invalid CSRF token', convertedFiles: null },
      { status: 400 }
    );
  }

  const typeOperation = formData.get("type") as string;

  console.log(typeOperation, )
  if (typeOperation === "contact") {
    try {
      await onSendCustomerEmail(formData);
      return json({ emailSent: true });
    } catch {
      return json(
        { contactError: "Error sending contact email" },
        { status: 400 }
      );
    }
  } else if (typeOperation === "email") {
    console.log('email')

    return await onSendEmail(formData);
  } else {
    const files = formData.getAll("file") as File[];
    const format = formData.get("format") as string | null;

    if (files.length === 0 || !format) {
      console.log('file length')
      return json(
        { error: "Files and format are required", convertedFiles: null },
        { status: 400 }
      );
    }

    try {
      let convertedFiles: any[] = [];

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
    } catch (error) {
      return json(
        { error: "Conversion failed", convertedFiles: null },
        { status: 500 }
      );
    }
  }
}
