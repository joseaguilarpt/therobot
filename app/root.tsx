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
import styles from "./app.scss?url";
import { ThemeProvider } from "./context/ThemeContext";
import Snackbar from "./ui/Snackbar/Snackbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CookieConsentBanner from "./ui/CookiesConsent/CookiesConsent";
import SkipToContent from "./ui/SkipToContent/SkipToContent";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import {} from "~/entry.client";
import NotFound from "./routes/404";
import ErrorPage from "./routes/Error";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { honeypot } from "~/honeypot.server";
import i18n from "./i18n";

export async function loader({ params, request }: LoaderFunctionArgs) {

  const checkValidLang = (v: string) => i18n.supportedLngs.includes(v)
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
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export const queryClient = new QueryClient();

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/altcha@latest/dist/altcha.min.css",
  },
];

export function ErrorBoundary() {
  const error = useRouteError();
  // Get the locale from the loader
  const { i18n, t } = useTranslation();
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(i18n.language ?? "en");

  let ErrorComponent;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      ErrorComponent = NotFound;
    } else {
      ErrorComponent = ErrorPage;
    }
  } else if (error instanceof Error) {
    ErrorComponent = ErrorPage;
  } else {
    ErrorComponent = ErrorPage;
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
            <SkipToContent />

            <NotFound />
            <Snackbar />
            <ScrollRestoration />
            <Scripts />
            <CookieConsentBanner />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App() {
  // Get the locale from the loader
  let { locale, honeypotInputProps } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
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
              <SkipToContent />

              <Outlet context={{ locale, honeypotInputProps }} />
              <Snackbar />
              <ScrollRestoration />
              <Scripts />
              <CookieConsentBanner />
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </HoneypotProvider>
    </html>
  );
}
