import React, {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
  useEffect,
  useCallback,
} from "react";
import "./DragDrop.scss";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import Divider from "../Divider/Divider";
import Text from "../Text/Text";
import { Form, useOutletContext, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Heading from "../Heading/Heading";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { useTheme } from "~/context/ThemeContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import classNames from "classnames";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { trackClick } from "~/utils/analytics";
import GridContainer from "../Grid/Grid";
import DropboxUpload from "../DropboxUpload/DropboxUpload";
import GridItem from "../Grid/GridItem";
import { GoogleDrivePicker } from "../GooglePicker/GooglePicker";

interface DragAndDropProps {
  isLoading?: boolean;
  onFilesDrop: (files: File[], formData: FormData) => void;
  acceptedTypes: string[];
  maxSize?: number;
  files: File[];
}

interface OutletContext {
  honeypotInputProps: {
    nameFieldName: string;
    validFromFieldName: string;
  };
}

function bytesToMB(bytes: number, decimalPlaces: number = 0): string {
  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(decimalPlaces);
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFilesDrop,
  isLoading: isExternalLoading,
  acceptedTypes: fileTypes,
  files: existingFiles,
  maxSize = 52_428_800,
}) => {
  const acceptedTypes = fileTypes?.map((item) => {
    if (item.includes("svg")) {
      return "image/svg+xml";
    }
    return item;
  });
  const params = useParams();
  const { showSnackbar } = useTheme();
  const { t, i18n } = useTranslation("common");
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { honeypotInputProps } = useOutletContext<OutletContext>();
  const formRef = useRef<HTMLFormElement>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [isInternalLoading, setInternalLoading] = useState(false);

  const isLoading = isInternalLoading || isExternalLoading;

  const validateFile = useCallback(
    (file: File): void => {
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        throw new Error(`${t("tool.fileType")} ${file.type} ${t("tool.notAccepted")}`);
      }
      if (file.size > maxSize) {
        throw new Error(`${t("tool.maxLimit")} ${bytesToMB(maxSize)} ${t("tool.bytes")}`);
      }
    },
    [acceptedTypes, maxSize, t]
  );
  
  const addFiles = useCallback(
    async (files: File[]) => {
      if (files.length > 15) {
        showSnackbar(t("tool.maxFiles"), "error");
        return;
      }

      const totalSize = files.reduce((sum, file) => sum + file.size, 0) + 0;
      if (totalSize > maxSize) {
        showSnackbar(`${t("tool.maxLimit")} ${bytesToMB(maxSize)} ${t("tool.bytes")}`, "error");
        return;
      }
  
      try {
        // Validate all files
        files.forEach(validateFile);
      } catch (error) {
        if (error instanceof Error) {
          showSnackbar(error.message, "error");
        } else {
          showSnackbar(t("Conversion Error"), "error");
        }
        return;
      }
  
      const formData = new FormData();
      const nameFieldName = honeypotInputProps.nameFieldName;
      const validFromFieldName = honeypotInputProps.validFromFieldName;
      if (formRef.current) {
        const formElements = formRef.current
          .elements as HTMLFormControlsCollection;
        Object.values(formElements).forEach((field: Element) => {
          if (field instanceof HTMLInputElement) {
            if (
              field.id &&
              (nameFieldName === field.id || validFromFieldName === field.id)
            ) {
              formData.append(field.id, field.value);
            }
          }
        });
      }
  
      let currentToken = null;
      if (executeRecaptcha) {
        try {
          setInternalLoading(true);
          const token = await executeRecaptcha();
          if (token) {
            currentToken = token;
            formData.set("g-recaptcha-response", token);
          }
        } catch (error) {
          setInternalLoading(false);
          console.error("reCAPTCHA execution failed:", error);
          showSnackbar(t("tool.captchaError"), "error");
          return;
        } finally {
          setInternalLoading(false);
        }
      }
  
      if (currentToken) {
        onFilesDrop(files, formData);
      }
    },
    [validateFile, showSnackbar, t, honeypotInputProps, onFilesDrop, executeRecaptcha]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) {
        return;
      }

      trackClick(
        "Tool Interaction",
        `Paste File`,
        `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: ${params?.sourceFormat}`
      );

      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault();
        const files = Array.from(e.clipboardData.files);
        addFiles(files);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [
    isLoading,
    i18n.language,
    params?.targetFormat,
    params?.sourceFormat,
    addFiles,
  ]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    if (isLoading) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    if (isLoading) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    if (isLoading) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (isLoading) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      trackClick(
        "Tool Interaction",
        `Drop File`,
        `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: : ${params?.sourceFormat}`
      );
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLoading) {
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      trackClick(
        "Tool Interaction",
        `Button File`,
        `language: ${i18n.language} - format from: ${params?.targetFormat} - format to: : ${params?.sourceFormat}`
      );
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <Form
      ref={formRef}
      className="drag-drop-form"
      method="post"
      encType="multipart/form-data"
    >
      <HoneypotInputs label="" />
      <div
        className={classNames(
          "drag-and-drop-container",
          isDragging && "dragging",
          isLoading && "loading"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        ref={dropRef}
        role="region"
        aria-label={t("tool.fileArea")}
      >
        <input type="hidden" name="actionType" value="uploadFiles" />
        {isDragging && !isLoading ? (
          <div className="drag-zone" aria-live="polite">
            <Icon color="dark" size="large" icon="folder_open" />
            <Heading level={4} appearance={6}>
              {t("tool.drop")}
            </Heading>
          </div>
        ) : (
          <div className="upload-button-container">
            <GridContainer alignItems="center" justifyContent="flex-start">
              <GridItem xs={11}>
                <Button
                  isDisabled={isLoading}
                  ariaLabel={
                    existingFiles.length > 0
                      ? t("tool.uploadMoreImages")
                      : t("tool.uploadButton")
                  }
                  onClick={handleButtonClick}
                  className="upload-button"
                >
                  {isLoading && (
                    <>
                      <LoadingSpinner /> <Divider orientation="vertical" />{" "}
                      <Text align="center" size="large" color="white">
                        {t("fileActions.processing")}
                      </Text>
                    </>
                  )}
                  {!isLoading && (
                    <>
                      <Icon icon="upload" size="large" aria-hidden="true" />{" "}
                      <Divider orientation="vertical" />{" "}
                      <Text align="center" size="large" color="white">
                        {existingFiles.length > 0
                          ? t("tool.uploadMoreImages")
                          : t("tool.uploadButton")}
                      </Text>
                    </>
                  )}
                </Button>
              </GridItem>
              <GridItem xs={1}>
                <GridContainer direction="column">
                  <GridItem className="u-pb1">
                    <GoogleDrivePicker
                      isDisabled={isLoading ?? false}
                      setLoading={setInternalLoading}
                      addFiles={addFiles}
                      sourceFormat={params?.sourceFormat ?? "jpeg"}
                    />
                  </GridItem>
                  <GridItem>
                    <DropboxUpload
                      isDisabled={isLoading ?? false}
                      addFiles={addFiles}
                      sourceFormat={params?.sourceFormat ?? "jpeg"}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
            <Text
              color="contrast"
              align="center"
              className="u-pt2"
              size="small"
            >
              {t("tool.instructions1")} {t("tool.instructions2")}
            </Text>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              style={{ display: "none" }}
              multiple
              id="input-file"
              accept={acceptedTypes.join(",")}
              aria-label={t("t.inputFile")}
            />
          </div>
        )}
      </div>
    </Form>
  );
};

export default DragAndDrop;
