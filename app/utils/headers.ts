import { HeadersFunction } from "@remix-run/node";

export const headers: HeadersFunction = ({ nonce }) => {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": `
      default-src 'self';
      script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' https: http:;
      style-src 'self' 'unsafe-inline' https://www.gstatic.com;
      frame-src 'self' https://www.google.com https://recaptcha.google.com;
      img-src 'self' data: https: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.gstatic.com;
      font-src 'self';
      connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://region1.google-analytics.com https://www.google.com https://recaptcha.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  };
};