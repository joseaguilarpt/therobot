import HCaptcha from "@hcaptcha/react-hcaptcha";
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from "react";

interface HCaptchaContextType {
  captchaRef: React.RefObject<HCaptcha>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  onSuccess: (token: string) => void;
  onError: () => void;
}

const HCaptchaContext = createContext<HCaptchaContextType | undefined>(
  undefined
);

export function HCaptchaProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    const currentCaptchaRef = captchaRef.current;
    return () => {
      if (currentCaptchaRef) {
        currentCaptchaRef.resetCaptcha();
      }
    };
  }, []);

  const onSuccess = (token: string) => setToken(token);
  const onError = () => setToken(null);

  return (
    <HCaptchaContext.Provider
      value={{
        captchaRef,
        setToken,
        token,
        onSuccess,
        onError,
      }}
    >
      {children}
    </HCaptchaContext.Provider>
  );
}

export function useHCaptcha() {
  const context = useContext(HCaptchaContext);
  if (context === undefined) {
    throw new Error("useHCaptcha must be used within a HCaptchaProvider");
  }
  return context;
}