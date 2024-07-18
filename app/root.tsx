import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
  useRouteLoaderData,
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
import NotFound from "./routes/404";
import ErrorPage from "./routes/Error";
import React from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (params?.sourceFormat?.toLowerCase() === 'pdf') {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  let locale = await i18next.getLocale(request);
  return json({ locale });
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
  let { locale } = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();


  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
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

            <Outlet />
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
