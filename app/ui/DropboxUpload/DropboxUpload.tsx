import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import dropboxLogo from "../../img/dropbox.svg";
import "./DropboxUpload.scss";
import { useTheme } from "~/context/ThemeContext";

function parseDropboxExtension(sourceFormat: string): string[] {
  switch (sourceFormat.toLowerCase()) {
    case "jpeg" || "jpg":
      return [".jpg", ".jpeg"];
    case "png":
      return [".png"];
    case "gif":
      return [".gif"];
    case "webp":
      return [".webp"];
    case "avif":
      return [".avif"];
    case "tiff":
      return [".tiff", ".tif"];
    case "svg":
      return [".svg"];
    case "bmp":
      return [".bmp"];
    default:
      console.warn(`Unsupported format: ${sourceFormat}`);
      return [];
  }
}

interface DropboxUploadProps {
  sourceFormat: string;
  isDisabled: boolean;
  addFiles: (files: File[]) => void;
}

interface DropboxFile {
  name: string;
  link: string;
  bytes: number;
  icon: string;
  thumbnailLink: string;
  isDir: boolean;
}

declare global {
  interface Window {
    Dropbox: {
      choose: (options: {
        success: (filesData: DropboxFile[]) => Promise<void>;
        cancel: () => void;
        error: () => void;
        linkType: string;
        multiselect: boolean;
        folderselect: boolean;
        extensions: string[];
      }) => void;
    };
  }
}

export default function DropboxUpload({
  sourceFormat,
  isDisabled,
  addFiles,
}: DropboxUploadProps): JSX.Element {
  const { t } = useTranslation();
  const { showSnackbar } = useTheme();

  async function convertDropboxFileToFile(
    dropboxFile: DropboxFile,
    sourceFormat: string
  ): Promise<File> {
    const response = await fetch(dropboxFile.link);
    const blob = await response.blob();

    // Determine the correct MIME type
    let mimeType: string;
    switch (sourceFormat.toLowerCase()) {
      case "jpeg":
        mimeType = "image/jpeg";
        break;
      case "svg":
        mimeType = "image/svg+xml";
        break;
      default:
        mimeType = `image/${sourceFormat.toLowerCase()}`;
    }

    return new File([blob], dropboxFile.name, { type: mimeType });
  }

  const handleUploadFiles = async (filesData: DropboxFile[]) => {
    try {
      const convertedFiles = await Promise.all(
        filesData.map((file) => convertDropboxFileToFile(file, sourceFormat))
      );
      addFiles(convertedFiles);
    } catch (error) {
      showSnackbar(t("dropboxModal.errors.downloadError"), "error");
    }
  };

  const options = {
    success: handleUploadFiles,
    cancel: () =>
      showSnackbar(t("dropboxModal.messages.operationCancelled"), "info"),
    error: () => showSnackbar(t("dropboxModal.errors.downloadError"), "error"),
    linkType: "direct",
    multiselect: true,
    folderselect: false,
    lang: "es_ES",
    sizeLimit: 10_000_000,
    extensions: parseDropboxExtension(sourceFormat),
  };

  const handleUpload = () => {
    window.Dropbox.choose(options);
  };

  return (
    <Button
      isDisabled={isDisabled}
      onClick={handleUpload}
      ariaLabel={t("dropboxModal.button.uploadFromDropbox")}
      tooltipContent={t("dropboxModal.button.uploadFromDropbox")}
      appareance="secondary"
      size="small"
    >
      <img
        width={20}
        src={dropboxLogo}
        alt={t("dropboxModal.accessibility.dropboxLogo")}
      />
    </Button>
  );
}
