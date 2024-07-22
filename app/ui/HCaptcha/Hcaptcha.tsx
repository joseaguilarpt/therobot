// app/components/HCaptcha.tsx
import React, { useCallback, useMemo } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useHCaptcha } from "~/context/HCaptchaContext";
import { useTheme } from "~/context/ThemeContext";

interface HCaptchaProps {
  sitekey: string;
}

export const HCaptchaComponent = React.memo(function HCaptchaComponent({
  // eslint-disable-next-line
  sitekey,
}: HCaptchaProps) {
  const { onSuccess, setToken, captchaRef } = useHCaptcha();
  const { showSnackbar } = useTheme();

  const handleVerify = useCallback(
    (token: string, ekey: string) => {
      onSuccess(token, ekey);
    },
    [onSuccess]
  );

  const handleExpire = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const handleError = useCallback(
    (err: string) => {
      setToken(null);
      showSnackbar(`Captcha error: ${err}`, "error");
    },
    [setToken, showSnackbar]
  );

  const memoizedHCaptcha = useMemo(
    () => (
      <HCaptcha
        sitekey={sitekey}
        size="invisible"
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
        ref={captchaRef}
      />
    ),
    [sitekey, handleVerify, handleExpire, handleError, captchaRef]
  );

  return memoizedHCaptcha;
});
