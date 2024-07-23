// src/hooks/useFileConversion.ts
import { useLoaderData, useSubmit } from "@remix-run/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTheme } from "~/context/ThemeContext";
import { validateEmailFormat } from "~/ui/ShareButton/ShareButton";
import { trackClick } from "./analytics";

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  comments: string;
}

export function useForm(data: { contactError: boolean; contactEmailSent: boolean; }) {
  const { t, i18n } = useTranslation("common");
  const { showSnackbar } = useTheme();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loaderData = useLoaderData();
  const [isPending, setIsPending] = React.useState(false);
  const [contactFormData, setContactForm] = React.useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    comments: ""
  });

  const submit = useSubmit();

  React.useEffect(() => {
    if (data?.contactError) {
      showSnackbar(t("ui.emailError"), "error");
      setIsPending(false);
    }
  }, [data?.contactError, showSnackbar, t]);

  React.useEffect(() => {
    if (data?.contactEmailSent) {
      showSnackbar(t("ui.contactEmailSent"), "success");
      setIsPending(false);
      setContactForm({
        name: "",
        phone: "",
        email: "",
        comments: ""
      });
    }
  }, [data?.contactEmailSent, showSnackbar, t]);

  const onFormSubmit = async (p: ContactFormData) => {
    const formData = new FormData();
    if (executeRecaptcha) {
      try {
        const token = await executeRecaptcha();
        if (token) {
          formData.set("g-recaptcha-response", token);
        }
      } catch (error) {
        showSnackbar(t("errorBoundary.title"), "error");
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
    if (loaderData?.csrfToken) {
      formData.append("csrf", loaderData?.csrfToken);
    }
    formData.append("type", "contact");
    setIsPending(true);

    trackClick(
      "Contact Form Interaction",
      `Contact Us`,
      `language: ${i18n.language}`
    );

    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    });
    setTimeout(() => {
      setIsPending(false)
    }, 5000)
  };
  return {
    onFormSubmit,
    contactFormData,
    setContactForm,
    isPending,
    setIsPending,
  };
}