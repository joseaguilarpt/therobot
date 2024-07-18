import React, { useRef, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface HCaptchaProps {
  sitekey: string;
  onVerify: (token: string) => void;
}

export function HCaptchaComponent({ sitekey, onVerify }: HCaptchaProps) {
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (captchaRef.current) {
      captchaRef.current.execute();
    }
  }, []);

  return (
    <HCaptcha
      sitekey={sitekey}
      onVerify={onVerify}
      ref={captchaRef}
      size="invisible"
    />
  );
}