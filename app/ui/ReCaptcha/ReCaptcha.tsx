// app/components/ReCaptcha.tsx
import React, { useCallback, useMemo } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { useReCaptcha } from "~/context/ReCaptchaContext";
import { useTheme } from "~/context/ThemeContext";

interface ReCaptchaProps {
  sitekey: string;
}

export const ReCaptchaComponent = React.memo(function ReCaptchaComponent({
  sitekey,
}: ReCaptchaProps) {
  const { onSuccess, setToken, captchaRef } = useReCaptcha();
  const { showSnackbar } = useTheme();

  const handleVerify = useCallback(
    (token: string | null) => {
      if (token) {
        onSuccess(token);
      }
    },
    [onSuccess]
  );

  const handleExpire = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const handleError = useCallback(() => {
    setToken(null);
  }, [setToken, showSnackbar]);

  const ReCaptchaInner = useMemo(() => {
    // Dynamically import ReCAPTCHA to ensure it's only loaded on the client
    const ReCAPTCHA = React.lazy(() => import("react-google-recaptcha"));

    return (
      <React.Suspense fallback={<div>Loading captcha...</div>}>
        <ReCAPTCHA
          sitekey={sitekey}
          size="invisible"
          onChange={handleVerify}
          onExpired={handleExpire}
          onErrored={handleError}
          ref={captchaRef}
        />
      </React.Suspense>
    );
  }, [sitekey, handleVerify, handleExpire, handleError, captchaRef]);

  return <ClientOnly>{() => ReCaptchaInner}</ClientOnly>;
});

export default ReCaptchaComponent;