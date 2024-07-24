// src/hooks/useFileConversion.ts
import { useState, useEffect, useCallback } from "react";
import {
  useActionData,
  useLoaderData,
  useLocation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useTheme } from "~/context/ThemeContext";
import { base64ToImage, downloadBlob } from "~/utils/convertUtils";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { trackClick } from "./analytics";

interface ConvertedFile {
  status: "processing" | "completed" | "error";
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
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const [status, setStatus] = useState({
    state: "idle",
    type: "",
  });
  const location = useLocation();
  const loaderData = useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();

  useEffect(() => {
    if (data?.emailSent) {
      setStatus({
        state: "success",
        type: "emailSent",
      });
      setTimeout(() => {
        setStatus({
          state: "idle",
          type: "",
        });
      }, 2000);
    }
  }, [data]);

  const { showSnackbar } = useTheme();
  const submit = useSubmit();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [pdfType, setPdfType] = useState<"separated" | "merged">("separated");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (data?.error) {
      showSnackbar(data.error, "error");
      setIsPending(false);
      setConvertedFiles((prevFiles) =>
        prevFiles.map((item) =>
          item.status === "processing" ? { ...item, status: "error" } : item
        )
      );
    }
  }, [data?.error, showSnackbar]);

  useEffect(() => {
    if (status.type === "emailSent") {
      showSnackbar(t("ui.emailSuccess"), "success");
      setIsPending(false);
    }
  }, [status?.type, showSnackbar, t]);

  useEffect(() => {
    if (data?.convertedFiles) {
      const newFiles = data.convertedFiles.map((item) => ({
        ...item,
        fileUrl: base64ToImage(item.fileUrl),
        status: "completed" as const,
      }));

      setTimeout(() => {
        // ts-expect-error
        setConvertedFiles((prevFiles) => [
          ...prevFiles.filter((item) => item.status !== "processing"),
          ...newFiles,
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

  const handleAllAction = useCallback(
    (files: File[], form: FormData) => {
      setIsPending(true);

      const newFiles = files.map((item) => ({
        status: "processing" as const,
        fileName: item.name,
        fileSize: item.size,
      }));
      setConvertedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      form.append("format", selectedFormat.toLowerCase());
      files.forEach((file) => form.append("file", file));
      if (selectedFormat === "PDF") {
        form.append("pdfType", pdfType);
      }
      if (loaderData?.csrfToken) {
        form.append("csrf", loaderData.csrfToken);
      }
      submit(form, {
        method: "post",
        action: location.pathname,
        encType: "multipart/form-data",
        preventScrollReset: true,
      });
    },
    [selectedFormat, pdfType, loaderData?.csrfToken, submit, executeRecaptcha]
  );

  const handleDownload = useCallback(
    (file: ConvertedFile) => {
      if (file.fileUrl) {
        downloadBlob(file.fileUrl, file.fileName);

        trackClick(
          "Files Interaction",
          `Download File`,
          `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: : ${params?.sourceFormat}`
        );

        showSnackbar(t("ui.downloadSuccess"), "success");
      }
    },
    [showSnackbar, t, i18n.language, params?.sourceFormat, params?.targetFormat]
  );

  const handleRemove = useCallback(
    (index: number) => {
      setConvertedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      showSnackbar(t("ui.fileRemoveSuccess"), "info");

      trackClick(
        "Files Interaction",
        `Remove File`,
        `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: : ${params?.sourceFormat}`
      );
    },
    [showSnackbar, t, i18n.language, params?.sourceFormat, params?.targetFormat]
  );

  const handleRemoveAll = useCallback(() => {
    showSnackbar(t("ui.filesRemoveSuccess"), "info");
    setConvertedFiles([]);

    trackClick(
      "Files Interaction",
      `Remove all Files`,
      `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: : ${params?.sourceFormat}`
    );
  }, [
    showSnackbar,
    t,
    i18n.language,
    params?.sourceFormat,
    params?.targetFormat,
  ]);

  const handleEmailShare = async (file: Blob, email: string) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("zipFile", file);

    if (loaderData?.csrfToken) {
      formData.append("csrf", loaderData.csrfToken);
    }

    if (executeRecaptcha) {
      try {
        const token = await executeRecaptcha();
        if (token) {
          formData.append("type", "email");
          formData.set("g-recaptcha-response", token);
          submit(formData, {
            method: "post",
            action: location.pathname,
            encType: "multipart/form-data",
            preventScrollReset: true,
          });
        } else {
          setIsPending(false);
        }
      } catch (error) {
        showSnackbar(t("errorBoundary.title"), "error");
      }
    } else {
      setIsPending(false);
    }
  };

  return {
    convertedFiles,
    pdfType,
    setPdfType,
    isPending,
    setIsPending,
    handleAllAction,
    handleDownload,
    handleRemove,
    handleRemoveAll,
    handleEmailShare,
  };
}
