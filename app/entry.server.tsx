import { PassThrough } from "stream";
import { cors } from "remix-utils/cors";
import {
  createReadableStreamFromReadable,
  HandleDataRequestFunction,
  type EntryContext,
} from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createInstance } from "i18next";
import i18next from "./i18next.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import Backend from "i18next-fs-backend";
import i18n from "./i18n";
import { resolve } from "node:path";
import { config } from "dotenv";
import crypto from "crypto";
import { headers as getHeaders } from "./utils/headers";
import { NonceContext } from "./context/NonceContext";

config();

const ABORT_DELAY = 5000;

declare module "@remix-run/node" {
  interface EntryContext {
    nonce?: string;
  }
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  const instance = createInstance();
  const lng = await i18next.getLocale(request);
  const ns = i18next.getRouteNamespaces(remixContext);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: { loadPath: resolve("./locales/{{lng}}/{{ns}}.json") },
      fallbackLng: 'en',
      debug: true,
    });

  const nonce = crypto.randomBytes(16).toString("base64");

  const securityHeaders = getHeaders({ nonce });

  (remixContext as EntryContext).customNonce = nonce;

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <NonceContext.Provider value={nonce}>
        <I18nextProvider i18n={instance}>
          <RemixServer context={remixContext} url={request.url} nonce={nonce} />
        </I18nextProvider>
      </NonceContext.Provider>,
      {
        nonce,
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");

          // Apply security headers
          Object.entries(securityHeaders).forEach(([key, value]) => {
            responseHeaders.set(key, value);
          });

          const isDevelopment = process.env.NODE_ENV === "development";
          const SITE_URL = isDevelopment
            ? "http://localhost:5173"
            : process.env.SITE_URL ?? "";
          const allowedOrigins = isDevelopment
            ? [SITE_URL, "http://127.0.0.1:5173"]
            : [SITE_URL];

          cors(
            request,
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
            {
              origin: (origin) => allowedOrigins.includes(origin),
              methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
              allowedHeaders: ["Content-Type", "Authorization"],
              credentials: true,
              maxAge: 3600,
            }
          ).then((response) => {
            resolve(response);
          });

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { request }
) => {
  return await cors(request, response);
};
