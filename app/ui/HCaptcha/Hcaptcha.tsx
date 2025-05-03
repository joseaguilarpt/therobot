// app/components/HCaptcha.tsx
import React, { useEffect, useRef, useCallback } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useHCaptcha } from "~/context/HCaptchaContext";
import { useTheme } from "~/context/ThemeContext";

interface HCaptchaProps {
  sitekey: string;
}

export const HCaptchaComponent = React.memo(function HCaptchaComponent({ sitekey }: HCaptchaProps) {
  const { onSuccess, setToken, captchaRef } = useHCaptcha();
  const { showSnackbar } = useTheme();
  const hcaptchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (hcaptchaRef.current && captchaRef) {
      captchaRef.current = hcaptchaRef.current;
    }
  }, [captchaRef]);

  const handleVerify = useCallback((token: string, ekey: string) => {
    onSuccess(token, ekey);
  }, [onSuccess]);

  const handleExpire = useCallback(() => {
    setToken(null);
    showSnackbar("Captcha expired. Please try again.", "warning");
  }, [setToken, showSnackbar]);

  const handleError = useCallback((err: string) => {
    setToken(null);
    showSnackbar(`Captcha error: ${err}`, "error");
  }, [setToken, showSnackbar]);

  return (
    <HCaptcha
      sitekey={sitekey}
      size="invisible"
      onVerify={handleVerify}
      onExpire={handleExpire}
      onError={handleError}
      ref={hcaptchaRef}
    />
  );
});