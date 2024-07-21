// src/hooks/useFileConversion.ts
import { useState, useEffect, useCallback } from "react";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useTheme } from "~/context/ThemeContext";
import { base64ToImage, downloadBlob } from "~/utils/convertUtils";
import { useHCaptcha } from "~/context/HCaptchaContext";

interface ConvertedFile {
  status: 'processing' | 'completed' | 'error';
  fileName: string;
  fileSize: number;
  fileUrl?: string;
}

interface ActionData {
  error?: string;
  emailSent?: boolean;
  convertedFiles?: Array<{
    fileUrl: string;
    fileName: string;
  }>;
  contactError?: string;
}

interface LoaderData {
  csrfToken?: string;
}

export function useFileConversion(selectedFormat: string) {
  const { t } = useTranslation("common");
  const loaderData = useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();

  const { showSnackbar } = useTheme();
  const submit = useSubmit();
  const { captchaRef } = useHCaptcha();

  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [pdfType, setPdfType] = useState<'separated' | 'merged'>('separated');
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (data?.error) {
      showSnackbar(data.error, "error");
      setIsPending(false);
      setConvertedFiles(prevFiles => 
        prevFiles.map(item => 
          item.status === "processing" ? { ...item, status: "error" } : item
        )
      );
    }
  }, [data?.error, showSnackbar]);

  useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(t("ui.emailSuccess"), "success");
      setIsPending(false);
    }
  }, [data?.emailSent, showSnackbar, t]);

  useEffect(() => {
    if (data?.convertedFiles) {
      const newFiles = data.convertedFiles.map(item => ({
        ...item,
        fileUrl: base64ToImage(item.fileUrl),
        status: 'completed' as const,
      }));
      
      setTimeout(() => {
        // ts-expect-error
        setConvertedFiles(prevFiles => [
          ...prevFiles.filter(item => item.status !== "processing"),
          ...newFiles
        ]);
        setIsPending(false);
        showSnackbar(t("ui.conversionSuccess"), "success");
      }, 1500);
    }
  }, [data?.convertedFiles, showSnackbar, t]);

  useEffect(() => {
    if (data?.contactError) {
      showSnackbar(t("ui.emailError"), "error");
      setIsPending(false);
    }
  }, [data?.contactError, showSnackbar, t]);

  const handleAllAction = useCallback((files: File[], form: FormData) => {
    setIsPending(true);

    const newFiles = files.map(item => ({
      status: 'processing' as const,
      fileName: item.name,
      fileSize: item.size,
    }));
    setConvertedFiles(prevFiles => [...prevFiles, ...newFiles]);

    form.append("format", selectedFormat.toLowerCase());
    files.forEach(file => form.append("file", file));
    if (selectedFormat === "PDF") {
      form.append("pdfType", pdfType);
    }
    if (loaderData?.csrfToken) {
      form.append("csrf", loaderData.csrfToken);
    }
    submit(form, {
      method: "post",
      encType: "multipart/form-data",
      preventScrollReset: true,
    });
  }, [selectedFormat, pdfType, loaderData?.csrfToken, submit]);

  const handleDownload = useCallback((file: ConvertedFile) => {
    if (file.fileUrl) {
      downloadBlob(file.fileUrl, file.fileName);
      showSnackbar(t("ui.downloadSuccess"), "success");
    }
  }, [showSnackbar, t]);

  const handleRemove = useCallback((index: number) => {
    setConvertedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    showSnackbar(t("ui.fileRemoveSuccess"), "info");
  }, [showSnackbar, t]);

  const handleRemoveAll = useCallback(() => {
    showSnackbar(t("ui.filesRemoveSuccess"), "info");
    setConvertedFiles([]);
  }, [showSnackbar, t]);

  const handleEmailShare = useCallback(async (file: Blob, email: string) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("zipFile", file);
    
    if (loaderData?.csrfToken) {
      formData.append("csrf", loaderData.csrfToken);
    }
    
    if (captchaRef.current) {
      const { response } = await captchaRef.current.execute({ async: true });
      if (response) {
        formData.set("h-captcha-response", response);
        formData.append("type", "email");
        submit(formData, {
          method: "post",
          encType: "multipart/form-data",
          preventScrollReset: true,
        });
      } else {
        setIsPending(false);
      }
    } else {
      setIsPending(false);
    }
  }, [captchaRef, loaderData?.csrfToken, submit]);

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