// src/hooks/useFileConversion.ts
import { useState, useEffect } from "react";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useTheme } from "~/context/ThemeContext";
import { base64ToImage, downloadBlob } from "~/utils/convertUtils";
import { useHCaptcha } from "~/context/HCaptchaContext";

export function useFileConversion(
  selectedFormat: string,
) {
  const { t } = useTranslation("common");
  const loaderData = useLoaderData();

  const { showSnackbar } = useTheme();
  const data = useActionData() as any;
  const submit = useSubmit();
  const { captchaRef } = useHCaptcha();

  const [convertedFiles, setConvertedFiles] = useState([]);
  const [pdfType, setPdfType] = useState("separated");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (data?.error) {
      showSnackbar(data.error, "error");
      setIsPending(false);
      if (convertedFiles) {
        const files = convertedFiles.map((item: any) => {
          if (item.status === "processing") {
            return {
              ...item,
              status: "error",
            };
          } else {
            return item;
          }
        });
        setConvertedFiles(files);
      }
    }
  }, [data?.error]);

  useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(t("ui.emailSuccess"), "success");
      setIsPending(false);
    }
  }, [data?.emailSent]);

  useEffect(() => {
    if (data?.convertedFiles) {
      const files = data.convertedFiles.map((item: any) => ({
        ...item,
        fileUrl: base64ToImage(item.fileUrl),
        status: "completed",
      }));
      setTimeout(() => {
        const data = convertedFiles.filter(
          (item) => item.status !== "processing"
        );
        setIsPending(false);
        showSnackbar(t("ui.conversionSuccess"), "success");
        setConvertedFiles([...data, ...files]);
      }, 1500);
    }
  }, [data?.convertedFiles]);

  useEffect(() => {
    if (data?.contactError) {
      showSnackbar(t("ui.emailError"), "error");
      setIsPending(false);
    }
  }, [data?.contactError]);

  useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(t("ui.emailSuccess"), "success");
      setIsPending(false);
    }
  }, [data?.emailSent]);

  const handleAllAction = (files: File[], form: FormData) => {
    setIsPending(true);

    const parsed = files.map((item) => ({
      status: "processing",
      fileName: item.name,
      fileSize: item.size,
    }));
    setConvertedFiles([...convertedFiles, ...parsed]);
    const formData = form;
    formData.append("format", selectedFormat?.toLowerCase());
    files.forEach((file) => formData.append("file", file));
    if (selectedFormat === "PDF") {
      formData.append("pdfType", pdfType);
    }
    if (loaderData?.csrfToken) {
      formData.append("csrf", loaderData?.csrfToken);
    }
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const handleDownload = (v: any) => {
    downloadBlob(v.fileUrl, v.fileName);
    showSnackbar(t("ui.downloadSuccess"), "success");
  };

  const handleRemove = (v: number) => {
    const filtered = convertedFiles.filter((value, i) => i !== v);
    setConvertedFiles(filtered);
    showSnackbar(t("ui.fileRemoveSuccess"), "info");
  };

  const handleRemoveAll = () => {
    showSnackbar(t("ui.filesRemoveSuccess"), "info");
    setConvertedFiles([]);
  };

  const handleEmailShare = async (v: any, email: string) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("zipFile", v);
    let currentToken = null;
    if (loaderData?.csrfToken) {
      formData.append("csrf", loaderData?.csrfToken);
    }
    if (captchaRef.current) {
      const { response } = await captchaRef.current.execute({ async: true });
      if (response) {
        currentToken = response;
        formData.set("h-captcha-response", response);
      }
    }
    if (currentToken) {
      formData.append("type", "email");
      submit(formData, { method: "post", encType: "multipart/form-data" });
    }
    else {
      setIsPending(false);
    }
  };

  return {
    convertedFiles,
    pdfType,
    setPdfType,
    isPending,
    handleAllAction,
    handleDownload,
    handleRemove,
    handleRemoveAll,
    handleEmailShare,
  };
}
