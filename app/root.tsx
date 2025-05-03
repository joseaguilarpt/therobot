import styles from "./app.scss?url";

import React from "react";

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
import { HeadersFunction, LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { HCaptchaProvider } from "./context/HCaptchaContext";
import { HCaptchaComponent } from "~/ui/HCaptcha/Hcaptcha";

export const headers: HeadersFunction = () => {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://js.hcaptcha.com https://*.hcaptcha.com;
      style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com;
      frame-src 'self' https://*.hcaptcha.com;
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://*.hcaptcha.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  };
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/manifest.json" },
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const checkValidLang = (v: string) => i18n.supportedLngs.includes(v);

  if (params?.sourceFormat?.toLowerCase() === "pdf") {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  let urlParam = params.lang;
  let locale = await i18next.getLocale(request);
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

  return json({ honeypotInputProps: honeypot?.getInputProps(), locale });
}

export let handle = {
  i18n: "common",
};

const queryClient = new QueryClient();

export function ErrorBoundary() {
  const error = useRouteError();
  const { i18n } = useTranslation();
  useChangeLanguage(i18n.language ?? "en");

  let ErrorComponent = ErrorPage;

  if (isRouteErrorResponse(error) && error.status === 404) {
    ErrorComponent = NotFound;
  }

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <HCaptchaProvider>
              <SkipToContent />
              <ErrorComponent />
              <Snackbar />
              <ScrollRestoration />
              <Scripts />
              <CookieConsentBanner />
            </HCaptchaProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

const App = React.memo(function App() {
  let { locale, honeypotInputProps } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <HoneypotProvider {...honeypotInputProps}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <HCaptchaProvider>
                <SkipToContent />
                <Outlet context={{ locale, honeypotInputProps }} />
                <Snackbar />
                <ScrollRestoration />
                <Scripts />
                <CookieConsentBanner />
                <HCaptchaComponent sitekey="10000000-ffff-ffff-ffff-000000000001" />
              </HCaptchaProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </HoneypotProvider>
    </html>
  );
});

export default App;