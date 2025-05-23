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
import { trackClick } from "../utils/analytics";
import { handleFileConversion } from "../utils/converterTool";
import { useFiles } from "~/context/FilesContext";

// Types for converted files and API responses
export interface ConvertedFile {
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

/**
 * Custom hook to handle file conversion logic, downloads, removals, and email sharing.
 */
export function useFileConversion(
  selectedFormat: string,
  selectedFormatFrom: string
) {
  // Hooks and context
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const location = useLocation();
  const loaderData = useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();
  const { showSnackbar } = useTheme();
  const submit = useSubmit();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { convertedFiles, setConvertedFiles } = useFiles();

  // Local state
  const [status, setStatus] = useState({ state: "idle", type: "" });
  const [pdfType, setPdfType] = useState<"separated" | "merged">("separated");
  const [isPending, setIsPending] = useState(false);

  // Show success snackbar when email is sent
  useEffect(() => {
    if (data?.emailSent) {
      setStatus({ state: "success", type: "emailSent" });
      setTimeout(() => setStatus({ state: "idle", type: "" }), 2000);
    }
  }, [data]);

  // Show snackbar on email sent
  useEffect(() => {
    if (status.type === "emailSent") {
      showSnackbar(t("ui.emailSuccess"), "success");
      setIsPending(false);
    }
  }, [status.type, showSnackbar, t]);

  // Show snackbar on contact error
  useEffect(() => {
    if (data?.contactError) {
      showSnackbar(t("ui.emailError"), "error");
      setIsPending(false);
    }
  }, [data?.contactError, showSnackbar, t]);

  /**
   * Handles file conversion process.
   */
  const handleAllAction = useCallback(
    async (files: File[], form: FormData) => {
      setIsPending(true);

      // Add processing files to state
      const newFiles = files.map((item) => ({
        status: "processing" as const,
        fileName: item.name,
        fileSize: item.size,
      }));
      setConvertedFiles((prevFiles) => [...newFiles, ...prevFiles]);

      // Prepare form data
      form.append("format", selectedFormat.toLowerCase());
      if (selectedFormat === "PDF") {
        form.append("pdfType", pdfType);
      }
      if (loaderData?.csrfToken) {
        form.append("csrf", loaderData.csrfToken);
      }

      try {
        // Call conversion API
        const data = await handleFileConversion(
          files,
          selectedFormat.toLowerCase(),
          form
        );
        if (data.convertedFiles) {
          // Update state with completed files
          const completedFiles = data.convertedFiles.map((item) => ({
            ...item,
            fileUrl: base64ToImage(item.fileUrl),
            status: "completed" as const,
          }));
          setConvertedFiles((prevFiles) => [
            ...completedFiles,
            ...prevFiles.filter((item) => item.status !== "processing"),
          ]);
          setIsPending(false);
          showSnackbar(t("ui.conversionSuccess"), "success");
        }
      } catch (e) {
        // Mark processing files as error
        setConvertedFiles((prevFiles) =>
          prevFiles.map((item) =>
            item.status === "processing" ? { ...item, status: "error" } : item
          )
        );
        setIsPending(false);
        showSnackbar(t("errorBoundary.message"), "error");
      }
    },
    [
      selectedFormat,
      pdfType,
      loaderData?.csrfToken,
      setConvertedFiles,
      showSnackbar,
      t,
      selectedFormatFrom,
    ]
  );

  /**
   * Handles file download and tracks analytics.
   */
  const handleDownload = useCallback(
    (file: ConvertedFile) => {
      if (file.fileUrl) {
        downloadBlob(file.fileUrl, file.fileName);

        trackClick(
          "Files Interaction",
          "Download File",
          `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: ${params?.sourceFormat}`
        );

        showSnackbar(t("ui.downloadSuccess"), "success");
      }
    },
    [showSnackbar, t, i18n.language, params?.sourceFormat, params?.targetFormat]
  );

  /**
   * Removes a single file from the converted files list.
   */
  const handleRemove = useCallback(
    (index: number) => {
      setConvertedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      showSnackbar(t("ui.fileRemoveSuccess"), "info");

      trackClick(
        "Files Interaction",
        "Remove File",
        `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: ${params?.sourceFormat}`
      );
    },
    [
      showSnackbar,
      t,
      i18n.language,
      params?.sourceFormat,
      params?.targetFormat,
      setConvertedFiles,
    ]
  );

  /**
   * Removes all converted files.
   */
  const handleRemoveAll = useCallback(() => {
    showSnackbar(t("ui.filesRemoveSuccess"), "info");
    setConvertedFiles([]);

    trackClick(
      "Files Interaction",
      "Remove all Files",
      `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: ${params?.sourceFormat}`
    );
  }, [
    showSnackbar,
    t,
    i18n.language,
    params?.sourceFormat,
    params?.targetFormat,
    setConvertedFiles,
  ]);

  /**
   * Handles sharing a file via email, including recaptcha and CSRF.
   */
  const handleEmailShare = async (file: Blob, email: string) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("zipFile", file);

    // File size limit: 24MB
    if (file.size > 25_165_824) {
      showSnackbar(`${t("tool.maxLimit")} 24 ${t("tool.bytes")}`, "error");
      setIsPending(false);
      return;
    }
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
