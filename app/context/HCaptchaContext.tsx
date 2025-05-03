import React, { createContext, useState, useContext, ReactNode } from "react";
import HCaptcha from "../ui/Catpcha/Catpcha";

interface HCaptchaContextType {
  captchaRef: any;
  setToken: any;
  token: string | null;
  onSuccess: (token: string, key: string) => void;
  onError: (token: string) => void;
}

const HCaptchaContext = createContext<HCaptchaContextType | undefined>(
  undefined
);

export function HCaptchaProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(null);
  const captchaRef = React.useRef<HCaptcha>(null);

  const onSuccess = (value: string, key: string) => setToken(value);
  const onError = (value: string) => setToken(null);
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
