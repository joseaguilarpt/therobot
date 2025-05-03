import { HeadersFunction } from "@remix-run/node";

export const headers: HeadersFunction = ({ nonce }) => {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": `
      default-src 'self';
      script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' https: http: https://*.dropboxapi.com https://www.dropbox.com;
      style-src 'self' 'unsafe-inline' https://www.gstatic.com https://accounts.google.com https://*.dropboxusercontent.com;
      frame-src 'self' https://accounts.google.com https://www.google.com https://recaptcha.google.com https://www.dropbox.com https://content.googleapis.com;
      img-src 'self' data: https: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.gstatic.com https://*.dropboxusercontent.com;
      font-src 'self';
      connect-src 'self' https://www.googleapis.com https://oauth2.googleapis.com https://www.google-analytics.com https://*.google-analytics.com https://region1.google-analytics.com https://www.google.com https://recaptcha.google.com https://accounts.google.com https://*.dropboxapi.com https://www.dropbox.com https://*.dropboxusercontent.com https://content.googleapis.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim(),
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Embedder-Policy": "credentialless"
  };
};