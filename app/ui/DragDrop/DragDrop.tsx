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
import GoogleUpload from "../GoogleUpload/GoogleUpload";
import DropboxUpload from "../DropboxUpload/DropboxUpload";
import GridItem from "../Grid/GridItem";

interface DragAndDropProps {
  isLoading?: boolean;
  onFilesDrop: (files: File[], formData: FormData) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  files: File[];
}

interface OutletContext {
  honeypotInputProps: {
    nameFieldName: string;
    validFromFieldName: string;
  };
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFilesDrop,
  isLoading: isExternalLoading,
  acceptedTypes: fileTypes,
  files: existingFiles,
  maxSize = Infinity,
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
    (file: File): boolean => {
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        showSnackbar(
          `${t("tool.fileType")} ${file.type} ${t("tool.notAccepted")}`,
          "error"
        );
        return false;
      }
      if (file.size > maxSize) {
        showSnackbar(
          `${t("tool.maxLimit")} ${maxSize} ${t("tool.bytes")}.`,
          "error"
        );
        return false;
      }
      return true;
    },
    [acceptedTypes, maxSize, showSnackbar, t]
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter(validateFile);

      if (files.length > 15) {
        showSnackbar(t("tool.maxFiles"), "error");
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
        onFilesDrop(validFiles, formData);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [validateFile, showSnackbar, t, honeypotInputProps, onFilesDrop]
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
                    <GoogleUpload
                      isDisabled={true}
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
