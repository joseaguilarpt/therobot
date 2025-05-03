import styles from "./app.scss?inline";
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
import { useAnalytics } from "./utils/analytics";
import { useNonce } from "./context/NonceContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { isValidFormat } from "./constants/formats";
import { GoogleApiInitializer } from "./ui/GoogleInitializer/GoogleInitializer";

// Critical CSS for fonts
const criticalFontCSS = `
@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Questrial';
  src: url('/fonts/Questrial-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
  
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Material Icons';
  src: url('/fonts/MaterialIcons-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/manifest.json" },
  { 
    rel: "preload", 
    href: "/fonts/Inter-Bold.woff2", 
    as: "font", 
    type: "font/woff2", 
    crossOrigin: "anonymous" 
  },
  { 
    rel: "preload", 
    href: "/fonts/Poppins-Regular.woff2", 
    as: "font", 
    type: "font/woff2", 
    crossOrigin: "anonymous" 
  },
  { 
    rel: "preload", 
    href: "/fonts/Questrial-Regular.woff2", 
    as: "font", 
    type: "font/woff2", 
    crossOrigin: "anonymous" 
  },
  { 
    rel: "preload", 
    href: "/fonts/MaterialIcons-Regular.woff2", 
    as: "font", 
    type: "font/woff2", 
    crossOrigin: "anonymous" 
  },
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const checkValidLang = (v: string) => i18n.supportedLngs.includes(v);

  if (params?.sourceFormat?.toLowerCase() === "pdf") {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (params?.sourceFormat && !isValidFormat(params?.sourceFormat)) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (params?.targetFormat && !isValidFormat(params?.targetFormat)) {
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

  return json({
    honeypotInputProps: honeypot?.getInputProps(),
    locale,
    ENV: {
      G_DRIVE_API: process.env.G_DRIVE_API,
      DROPBOX_USER: process.env.DROPBOX_USER,
      G_DRIVE_APP_ID: process.env.G_DRIVE_APP_ID,
      G_DRIVE_USER: process.env.G_DRIVE_USER,
      GOOGLE_ID_ANALYTICS: process.env.GOOGLE_ID_ANALYTICS,
      RCAPTCHA_CLIENT: process.env.RCAPTCHA_CLIENT,
    },
  });
}

export const shouldRevalidate = () => false;

export const handle = {
  i18n: "common",
};

function Document({
  children,
  locale,
  nonce,
  i18n,
  ENV
}: {
  children: React.ReactNode;
  locale: string;
  nonce: string;
  i18n: any;
  ENV: any;
}) {
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: criticalFontCSS }} />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        {ENV.GOOGLE_ID_ANALYTICS && (
          <>
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
          </>
        )}
      </head>
      <body>
        {children}
        <Scripts nonce={nonce} />
        <ScrollRestoration nonce={nonce} />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        {ENV.DROPBOX_USER && (
          <script   
            nonce={nonce}
            type="text/javascript"
            src="https://www.dropbox.com/static/api/2/dropins.js"
            id="dropboxjs"
            data-app-key={ENV.DROPBOX_USER}
          ></script>
        )}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { i18n } = useTranslation();
  useChangeLanguage(i18n.language ?? "en");
  useAnalytics();
  const nonce = useNonce();

  let ErrorComponent = ErrorPage;

  if (isRouteErrorResponse(error) && error.status === 404) {
    ErrorComponent = NotFound;
  }

  const minimalENV = {
    GOOGLE_ID_ANALYTICS: "", // You might want to hardcode this if it's critical
    DROPBOX_USER: "",
  };

  return (
    <Document locale={i18n.language} nonce={nonce} i18n={i18n} ENV={minimalENV}>
      <ThemeProvider>
        <SkipToContent />
        <ErrorComponent />
        <Snackbar />
        <CookieConsentBanner />
      </ThemeProvider>
    </Document>
  );
}

const App = React.memo(function App() {
  const { locale, honeypotInputProps, ENV } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const nonce = useNonce();
  useChangeLanguage(locale);
  useAnalytics();

  return (
    <Document locale={locale} nonce={nonce} i18n={i18n} ENV={ENV}>
      <ThemeProvider>
        <HoneypotProvider {...honeypotInputProps}>
          <GoogleApiInitializer nonce={nonce} apiKey={ENV.G_DRIVE_API ?? ''} clientId={ENV.G_DRIVE_USER ?? ''} />
          <GoogleReCaptchaProvider reCaptchaKey={ENV.RCAPTCHA_CLIENT ?? ""}>
            <SkipToContent />
            <Outlet context={{ locale, honeypotInputProps }} />
            <Snackbar />
            <CookieConsentBanner />
          </GoogleReCaptchaProvider>
        </HoneypotProvider>
      </ThemeProvider>
    </Document>
  );
});

export default App;