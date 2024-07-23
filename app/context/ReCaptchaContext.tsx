import ReCAPTCHA from "react-google-recaptcha";
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from "react";

interface ReCaptchaContextType {
  captchaRef: React.RefObject<ReCAPTCHA>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  onSuccess: (token: string) => void;
  onError: () => void;
  resetCaptcha: () => void;
  executeCaptcha: () => Promise<string | undefined>;
  isLoading: boolean;
}

const ReCaptchaContext = createContext<ReCaptchaContextType | undefined>(
  undefined
);

export function ReCaptchaProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const captchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const currentCaptchaRef = captchaRef.current;
    return () => {
      if (currentCaptchaRef) {
        currentCaptchaRef.reset();
      }
    };
  }, []);

  const onSuccess = (token: string) => {
    setToken(token);
    captchaRef.current?.reset();
  };

  const onError = () => {
    setToken(null);
    captchaRef.current?.reset();
  };

  const resetCaptcha = () => {
    captchaRef.current?.reset();
    setToken(null);
  };

  const executeCaptcha = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newToken = await captchaRef.current?.executeAsync();
      if (newToken) {
        onSuccess(newToken);
        return newToken;
      }
    } catch (error) {
      onError();
      console.log(error, "error")
      throw new Error('Recaptcha Error')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReCaptchaContext.Provider
      value={{
        captchaRef,
        setToken,
        token,
        onSuccess,
        onError,
        resetCaptcha,
        executeCaptcha,
        isLoading,
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