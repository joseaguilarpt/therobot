// app/utils/csrf.server.ts
import { createCookieSessionStorage } from "@remix-run/node";
import crypto from "crypto";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "csrf",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

function createCSRFToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function getCSRFToken(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  let token = session.get("csrf");
  if (!token) {
    token = createCSRFToken();
    session.set("csrf", token);
  }
  return {
    token,
    cookieHeader: await storage.commitSession(session),
  };
}

export async function validateCSRFToken(request: Request, formData: FormData) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const sessionToken = session.get("csrf");
  const formToken = formData.get("csrf");

  if (!sessionToken || !formToken || sessionToken !== formToken) {
    throw new Error("Invalid CSRF token");
  }
}