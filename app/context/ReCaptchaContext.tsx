import ReCAPTCHA from "react-google-recaptcha";
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from "react";

interface ReCaptchaContextType {
  captchaRef: React.RefObject<ReCAPTCHA>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  onSuccess: (token: string) => void;
  onError: () => void;
}

const ReCaptchaContext = createContext<ReCaptchaContextType | undefined>(
  undefined
);

export function ReCaptchaProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const currentCaptchaRef = captchaRef.current;
    return () => {
      if (currentCaptchaRef) {
        currentCaptchaRef.reset();
      }
    };
  }, []);

  const onSuccess = (token: string) => setToken(token);
  const onError = () => setToken(null);

  return (
    <ReCaptchaContext.Provider
      value={{
        captchaRef,
        setToken,
        token,
        onSuccess,
        onError,
      }}
    >
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function useReCaptcha() {
  const context = useContext(ReCaptchaContext);
  if (context === undefined) {
    throw new Error("useReCaptcha must be used within a ReCaptchaProvider");
  }
  return context;
}