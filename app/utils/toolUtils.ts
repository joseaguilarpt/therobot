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

export async function toolAction(request: any) {
  const formData = await parseFormData(request);
  try {
    const c = honeypot.check(formData);
    console.log(honeypot.getInputProps(), formData, 'fd')
  } catch (error) {
    if (error instanceof SpamError) {
      return json(
        { error: "Suspicious Activity: Cancelling", convertedFiles: null },
        { status: 400 }
      );
    }
  }
  const typeOperation = formData.get("type") as string;

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
    return await onSendEmail(formData);
  } else {
    const files = formData.getAll("file") as File[];
    const format = formData.get("format") as string | null;

    if (files.length === 0 || !format) {
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
