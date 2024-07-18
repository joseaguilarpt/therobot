import React, {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
  useEffect,
} from "react";
import "./DragDrop.scss";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import Divider from "../Divider/Divider";
import Text from "../Text/Text";
import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Heading from "../Heading/Heading";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { useOutletContext } from "@remix-run/react";
import { useTheme } from "~/context/ThemeContext";
import { useHCaptcha } from "~/context/HCaptchaContext";
interface DragAndDropProps {
  onFilesDrop: (files: File[], formData: FormData) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  files: File[];
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFilesDrop,
  acceptedTypes = [],
  files: existingFiles,
  maxSize = Infinity,
}) => {
  const { showSnackbar } = useTheme();
  let { t } = useTranslation("common");
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { honeypotInputProps } = useOutletContext<any>();

  const formRef = React.useRef();

  const { captchaRef, token } = useHCaptcha();

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handlePaste = (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const files = Array.from(e.clipboardData.files);
      addFiles(files);
    }
  };

  const validateFile = (file: File): boolean => {
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
  };

  const addFiles = async (files: File[]) => {
    const validFiles = files.filter(validateFile);

    const formData = new FormData();
    const nameFieldName = honeypotInputProps.nameFieldName;
    const validFromFieldName = honeypotInputProps.validFromFieldName;
    formRef.current &&
      Object.values(formRef.current)?.forEach((field: any) => {
        if (field?.id && nameFieldName === field.id) {
          formData.append(field.id, field.value);
        }
        if (field?.id && validFromFieldName === field.id) {
          formData.append(field.id, field.value);
        }
      });
    let currentToken = null;
    if (captchaRef.current) {
      const { response } = await captchaRef.current.execute({ async: true });

      if (response) {
        currentToken = response;
        formData.set('h-captcha-response', response);
      }
    }
    if (currentToken) {
      onFilesDrop(validFiles, formData);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form
      ref={formRef}
      navigate={false}
      method="post"
      encType="multipart/form-data"
    >
      <HoneypotInputs label="" />
      <div
        className={`drag-and-drop-container ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        ref={dropRef}
        role="region"
        aria-label={t("tool.fileArea")}
      >
        <input type="hidden" name="actionType" value="uploadFiles" />
        {isDragging ? (
          <div className="drag-zone" aria-live="polite">
            <Heading level={4} appearance={6}>
              {t("tool.drop")}
            </Heading>
          </div>
        ) : (
          <div className="upload-button-container">
            <Button
              ariaLabel={
                existingFiles.length > 0
                  ? t("tool.uploadMoreImages")
                  : t("tool.uploadButton")
              }
              onClick={handleButtonClick}
              className="upload-button"
            >
              <Icon icon="FaUpload" size="large" aria-hidden="true" />{" "}
              <Divider orientation="vertical" />{" "}
              <Text align="center" size="large" color="contrast">
                {existingFiles.length > 0
                  ? t("tool.uploadMoreImages")
                  : t("tool.uploadButton")}
              </Text>
            </Button>
            <Text
              color="contrast"
              align="center"
              className="u-pt2"
              size="small"
            >
              {t("tool.instructions1")}{" "}
            </Text>
            <Text color="contrast" align="center" size="small">
              {" "}
              {t("tool.instructions2")}
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
