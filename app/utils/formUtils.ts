// src/hooks/useFileConversion.ts
import { useSubmit } from "@remix-run/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHCaptcha } from "~/context/HCaptchaContext";
import { useTheme } from "~/context/ThemeContext";
import { validateEmailFormat } from "~/ui/ShareButton/ShareButton";

export function useForm(data: any) {
  const { t } = useTranslation("common");
  const { showSnackbar } = useTheme();
  const { captchaRef } = useHCaptcha();
  const [isPending, setIsPending] = React.useState(false);
  const [contactFormData, setContactForm] = React.useState({});

  const submit = useSubmit();

  React.useEffect(() => {
    if (data?.contactError) {
      showSnackbar(t("ui.emailError"), "error");
      setIsPending(false);
    }
  }, [data?.contactError]);

  React.useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(t("ui.contactEmailSent"), "success");
      setIsPending(false);
      setContactForm({});
    }
  }, [data?.emailSent]);

  const onFormSubmit = async (p: any) => {
    let currentToken = null;
    const formData = new FormData();

    if (captchaRef.current) {
      const { response } = await captchaRef.current.execute({ async: true });

      if (response) {
        currentToken = response;
        formData.set("h-captcha-response", response);
      }
      else {
        showSnackbar(t('errorBoundary.title'), 'error')
        return;
      }
    }
    formData.append("name", p.name);
    formData.append("phone", p.phone);
    formData.append("email", p.email);
    formData.append("comments", p.comments);
    if (!p.name) {
      showSnackbar(t("ui.missingName"), "error");
      return;
    }
    if (!p.phone) {
      showSnackbar(t("ui.missingPhone"), "error");
      return;
    }
    if (!p.email) {
      showSnackbar(t("ui.missingEmail"), "error");
      return;
    }
    if (!validateEmailFormat(p.email)) {
      showSnackbar(t("ui.formatEmail"), "error");
      return;
    }
    if (!p.comments) {
      showSnackbar(t("ui.missingComments"), "error");
      return;
    }
    formData.append("type", "contact");
    setIsPending(true);
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };
  return {
    onFormSubmit,
    contactFormData,
    setContactForm,
    isPending,
    setIsPending,
  };
}
