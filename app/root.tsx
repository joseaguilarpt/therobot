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
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
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
import { useAnalytics } from "./utils/analytics";
import { NonceContext, useNonce } from "./context/NonceContext";

// export const headers: HeadersFunction = () => {
//   return {
//     "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
//     "Content-Security-Policy": `
//       default-src 'self';
//       script-src 'self' https://js.hcaptcha.com https://*.hcaptcha.com https://www.googletagmanager.com;
//       style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com;
//       frame-src 'self' https://*.hcaptcha.com;
//       img-src 'self' data: https: blob: https://www.google-analytics.com https://*.google-analytics.com;
//       font-src 'self';
//       connect-src 'self' https://*.hcaptcha.com https://www.google-analytics.com https://*.google-analytics.com https://region1.google-analytics.com;
//       object-src 'none';
//       base-uri 'self';
//       form-action 'self';
//       frame-ancestors 'none';
//       block-all-mixed-content;
//       upgrade-insecure-requests;
//     `.replace(/\s{2,}/g, ' ').trim()
//   };
// };

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/manifest.json" },
];

export async function loader({ params, request, context }: LoaderFunctionArgs) {
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

  const isDev = process.env.NODE_ENV === "development";

  return json({
    honeypotInputProps: honeypot?.getInputProps(),
    locale,
    ENV: {
      GOOGLE_ID_ANALYTICS: process.env.GOOGLE_ID_ANALYTICS,
      CAPTCHA_KEY: isDev
        ? process.env.DUMMY_CAPTCHA_KEY
        : process.env.CAPTCHA_KEY,
    },
  });
}

export let handle = {
  i18n: "common",
};

const queryClient = new QueryClient();

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
            <SkipToContent />
            <ErrorComponent />
            <Snackbar />
            <ScrollRestoration nonce={nonce} />
            <Scripts nonce={nonce} />
            <CookieConsentBanner />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

const App = React.memo(function App() {
  let { locale, honeypotInputProps, ENV } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();
  const nonce = useNonce();

  useChangeLanguage(locale);
  useAnalytics();

  return (
    <html lang={locale} dir={i18n.dir()}>
      <HoneypotProvider {...honeypotInputProps}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <HCaptchaProvider>
                <SkipToContent />
                <Outlet context={{ locale, honeypotInputProps }} />
                <Snackbar />
                <CookieConsentBanner />
                <Scripts nonce={nonce} />
                <HCaptchaComponent sitekey={ENV.CAPTCHA_KEY ?? ""} />
                <ScrollRestoration nonce={nonce} />
                <script
                nonce={nonce}
                  dangerouslySetInnerHTML={{
                    __html: `window.ENV = ${JSON.stringify(ENV)}`,
                  }}
                />
              </HCaptchaProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </HoneypotProvider>
    </html>
  );
});

export default App;
