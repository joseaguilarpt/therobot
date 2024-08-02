import { HeadersFunction } from "@remix-run/node";

export const headers: HeadersFunction = ({ nonce }) => {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": `
      default-src 'self';
      script-src 'strict-dynamic' 'nonce-${nonce}' https: https://*.google.com https://docs.google.com https://*.googleapis.com https://*.gstatic.com https://*.dropboxapi.com https://www.dropbox.com https://www.dropboxusercontent.com;
      style-src 'self' 'unsafe-inline' https://*.google.com https://docs.google.com https://*.googleapis.com https://*.gstatic.com https://*.dropboxusercontent.com;
      frame-src 'self' https://*.google.com https://docs.google.com https://accounts.google.com https://drive.google.com https://recaptcha.google.com https://www.dropbox.com https://content.googleapis.com;
      img-src 'self' data: blob: https: https://*.google.com https://docs.google.com https://*.googleapis.com https://*.gstatic.com https://*.google-analytics.com https://*.dropboxusercontent.com;
      font-src 'self' https://*.gstatic.com https://docs.google.com;
      connect-src 'self' https://*.google.com https://docs.google.com https://*.googleapis.com https://accounts.google.com https://*.google-analytics.com https://*.dropboxapi.com https://www.dropbox.com https://*.dropboxusercontent.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://docs.google.com;
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim(),
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  };
};