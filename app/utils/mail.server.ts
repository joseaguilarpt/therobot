import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { json } from "@remix-run/node";
import { createCustomerEmail } from "~/templates/customerEmail";

interface SendEmail {
  file: any;
  email: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureUploadsDirectoryExists = () => {
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
};

export async function sendEmail({ file, email }: SendEmail) {
  try {
    if (!file || typeof email !== "string") {
      throw new Error("Missing File or Email");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    // Ensure the uploads directory exists
    ensureUploadsDirectoryExists();

    // Save the file to a temporary location
    const filePath = path.join(__dirname, "../uploads", fileName);
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    const emailTemplatePath = path.join(
      __dirname,
      "../templates/send-email.html"
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: process.env.NODEMAILER_ACCOUNT,
        pass: process.env.NODEMAILER_SECRET,
      },
    });

    // Send email with attachment
    await transporter.sendMail({
      from: process.env.NODEMAILER_ACCOUNT,
      to: email,
      subject: "Here are your converted Images - EasyConvertImage",
      html: emailTemplate, // Use the email template
      attachments: [
        {
          filename: "images.zip",
          path: filePath,
          contentType: "application/zip", // Ensure the correct MIME type
        },
      ],
    });

    // Clean up the file
    fs.unlinkSync(filePath);
    return {
      success: true,
      convertedFiles: [],
    };
  } catch (e) {
    throw new Error("Error sending email");
  }
}

export async function onSendEmail(formData: FormData) {
  const zipFile = formData.get("zipFile");
  const email = formData.get("email");
  if (!zipFile) {
    return json(
      { error: "Zip File required", convertedFiles: null },
      { status: 400 }
    );
  }
  if (!email) {
    return json(
      { error: "Email required", convertedFiles: null },
      { status: 400 }
    );
  }
  try {
    const data = await sendEmail({
      file: zipFile,
      email: email,
    });
    return json({ emailSent: true });
  } catch (e) {
    return json(
      { error: "Failed sending email", convertedFiles: null },
      { status: 500 }
    );
  }
}

export async function sendCustomerEmail({ email, comments, phone, name }: any) {
  try {
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: process.env.NODEMAILER_ACCOUNT,
        pass: process.env.NODEMAILER_SECRET,
      },
    });

    const data = `<div><p>Name: ${name}</p><p>Phone Number: ${phone}</p><p>Email: ${email}</p><p>Comments: ${comments}</p></div>`;

    // Send email with attachment
    await transporter.sendMail({
      from: process.env.NODEMAILER_ACCOUNT,
      to: process.env.NODEMAILER_ACCOUNT,
      subject: `Message Receiver from ${email} in Easy Convert Image`,
      html: createCustomerEmail(data), // Use the email template
    });

    return {
      success: true,
    };
  } catch (e) {
    throw new Error("Error sending email");
  }
}

export async function onSendCustomerEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const comments = formData.get("comments") as string;
  if (!name) {
    return json(
      { error: "Name is required", convertedFiles: null },
      { status: 400 }
    );
  }
  if (!phone) {
    return json(
      { error: "Phone Number is required", convertedFiles: null },
      { status: 400 }
    );
  }
  if (!comments) {
    return json(
      { error: "Comments is required", convertedFiles: null },
      { status: 400 }
    );
  }
  if (!email) {
    return json(
      { error: "Email required", convertedFiles: null },
      { status: 400 }
    );
  }
  try {
    const data = await sendCustomerEmail({
      name,
      phone,
      comments,
      email,
    });
    return json({ emailSent: true });
  } catch (e) {
    return json(
      { error: "Failed sending email", convertedFiles: null },
      { status: 500 }
    );
  }
}
