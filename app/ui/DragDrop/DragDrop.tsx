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

interface DragAndDropProps {
  onFilesDrop: (files: File[]) => void;
  onError: (error: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  files: File[];
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFilesDrop,
  onError,
  acceptedTypes = [],
  files: filesLength,
  maxSize = Infinity,
}) => {
  let { t } = useTranslation("common");

  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    console.log(file.type ,'file.type')
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      onError(`${t("tool.fileType")} ${file.type} ${t("tool.notAccepted")}`);
      return false;
    }
    if (file.size > maxSize) {
      onError(`${t("tool.maxLimit")} ${maxSize} ${t("tool.bytes")}.`);
      return false;
    }
    return true;
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(validateFile);
    onFilesDrop(validFiles);
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
    <Form method="post" encType="multipart/form-data">
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
                filesLength.length > 0
                  ? t("tool.uploadButton")
                  : t("tool.uploadMoreImages")
              }
              onClick={handleButtonClick}
              className="upload-button"
            >
              <Icon icon="FaUpload" size="large" aria-hidden="true" />{" "}
              <Divider orientation="vertical" />{" "}
              <Text align="center" size="large" color="contrast">
                {filesLength.length > 0
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
