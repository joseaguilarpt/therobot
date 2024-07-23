import styles from "./app.scss?url";

import React, { useEffect, useLayoutEffect } from "react";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { ThemeProvider } from "./context/ThemeContext";
import Snackbar from "./ui/Snackbar/Snackbar";
import CookieConsentBanner from "./ui/CookiesConsent/CookiesConsent";
import SkipToContent from "./ui/SkipToContent/SkipToContent";
import i18next from "~/i18next.server";
import NotFound from "./routes/404";
import ErrorPage from "./routes/Error";
import { honeypot } from "~/honeypot.server";
import i18n from "./i18n";
import { ReCaptchaProvider } from "./context/ReCaptchaContext";
import ReCaptchaComponent from "~/ui/ReCaptcha/ReCaptcha";
import { useAnalytics } from "./utils/analytics";
import { useNonce } from "./context/NonceContext";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/manifest.json" },
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const checkValidLang = (v: string) => i18n.supportedLngs.includes(v);

  const cookieHeader = request.headers.get("Cookie");
  if (params?.sourceFormat?.toLowerCase() === "pdf") {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const urlParam = params.lang;
  const locale = await i18next.getLocale(request);
  let isValidLang = checkValidLang(locale);

  if (urlParam) {
    isValidLang = checkValidLang(urlParam);
  }
  if (!isValidLang) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const isDev = process.env.NODE_ENV === "development";

  return json({
    honeypotInputProps: honeypot?.getInputProps(),
    locale,
    ENV: {
      GOOGLE_ID_ANALYTICS: process.env.GOOGLE_ID_ANALYTICS,
      RCAPTCHA_CLIENT: process.env.RCAPTCHA_CLIENT,
    },
  });
}

export const handle = {
  i18n: "common",
};

export function ErrorBoundary() {
  const error = useRouteError();
  const { i18n } = useTranslation();
  useChangeLanguage(i18n.language ?? "en");
  useAnalytics();

  let ErrorComponent = ErrorPage;

  if (isRouteErrorResponse(error) && error.status === 404) {
    ErrorComponent = NotFound;
  }

  const nonce = useNonce();

  return (
    <ThemeProvider>
      <html lang={i18n.language} dir={i18n.dir()}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <SkipToContent />
          <ErrorComponent />
          <Snackbar />
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
          <CookieConsentBanner />
        </body>
      </html>
    </ThemeProvider>
  );
}

const App = React.memo(function App() {
  const { locale, honeypotInputProps, ENV } =
    useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const nonce = useNonce();
  useChangeLanguage(locale);
  useAnalytics();

  return (
    <ThemeProvider>
      <html lang={locale} dir={i18n.dir()}>
        <HoneypotProvider {...honeypotInputProps}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <Meta />
            <Links />
            <script
              async
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${ENV.GOOGLE_ID_ANALYTICS}`}
            ></script>
            <script
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ENV.GOOGLE_ID_ANALYTICS}', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
          </head>
          <body>
            <ReCaptchaProvider>
              <SkipToContent />
              <Outlet context={{ locale, honeypotInputProps }} />
              <Snackbar />
              <CookieConsentBanner />
              <Scripts nonce={nonce} />
              <ReCaptchaComponent sitekey={ENV.RCAPTCHA_CLIENT ?? ""} />

              <ScrollRestoration nonce={nonce} />
              <script
                nonce={nonce}
                dangerouslySetInnerHTML={{
                  __html: `window.ENV = ${JSON.stringify(ENV)}`,
                }}
              />
            </ReCaptchaProvider>
          </body>
        </HoneypotProvider>
      </html>
    </ThemeProvider>
  );
});

export default App;
