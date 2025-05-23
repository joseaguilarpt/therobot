import "./Files.scss";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "@remix-run/react";
import JSZip from "jszip";
import pkg from "file-saver";
import Button from "../Button/Button";
import Text from "../Text/Text";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Heading from "../Heading/Heading";
import StatusBar from "../StatusBar/StatusBar";
import ShareButton from "../ShareButton/ShareButton";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import { FormatImage } from "../FormatImage/FormatImage";

import { useTheme } from "~/context/ThemeContext";
import { trackClick } from "~/utils/analytics";
import { ConvertedFile } from "~/hooks/useTool";

const { saveAs } = pkg;

interface File {
  fileName: string;
  fileSize: number;
  fileUrl: Blob;
  status: string;
}

interface FilesProps {
  files?: File[];
  onDownload: (file: File) => void;
  onRemove: (index: number) => void;
  onRemoveAll: () => void;
  onEmailShare: (zip: File | Blob | undefined, email: string) => void;
}

interface PreviewModalState {
  file: string;
  fileName: string;
}

const Files: React.FC<FilesProps> = ({
  files = [],
  onDownload,
  onRemove,
  onRemoveAll,
  onEmailShare,
}) => {
  const [previewModal, setPreviewModal] = useState<PreviewModalState | null>(
    null
  );
  const { t, i18n } = useTranslation();
  const params = useParams();
  const { showSnackbar } = useTheme();

  if (files.length === 0) {
    return null;
  }

  const generateZip = async (): Promise<Blob | undefined> => {
    const zip = new JSZip();

    for (const file of files) {
      const fileContent = await file.fileUrl.arrayBuffer();
      zip.file(file.fileName, fileContent);
    }

    return await zip.generateAsync({ type: "blob" });
  };

  const onDownloadAll = async () => {
    trackClick(
      "Files Interaction",
      `Button - format: ${params?.sourceFormat}`,
      `Download All - language: ${i18n.language} - format: ${params?.targetFormat}`
    );

    const zipContent = await generateZip();
    if (zipContent) {
      saveAs(zipContent, "files.zip");
      showSnackbar(t("fileActions.zipSuccess"), "success");
    }
  };

  const bytesToKilobytes = (bytes: number): number => {
    return Math.round((bytes / 1024) * 10) / 10;
  };

  const handleEmailShare = async (email: string) => {
    const zipContent = await generateZip();
    if (zipContent) {
      trackClick(
        "Files Interaction",
        `Button - format: ${params?.sourceFormat}`,
        `Email Share - language: ${i18n.language} - format: ${params?.targetFormat}`
      );
      onEmailShare(zipContent, email);
    }
  };

  const handlePreview = (data: { name: string; file: Blob }) => {
    const blobUrl = URL.createObjectURL(data.file);
    trackClick(
      "Files Interaction",
      `Button - format: ${params?.sourceFormat}`,
      `Preview - language: ${i18n.language} - format: ${params?.targetFormat}`
    );
    setPreviewModal({
      file: blobUrl,
      fileName: data.name,
    });
  };

  const closePreview = () => {
    if (previewModal) {
      URL.revokeObjectURL(previewModal.file);
    }
    setPreviewModal(null);
  };

  const notDownloadable = files.filter((item) => item.status === "processing");
  const hidePreview = ["pdf", "tiff"].includes(
    params?.targetFormat?.toLowerCase() ?? ""
  );

  const getFileType = (file: ConvertedFile) => {
    const extension =
      file.fileName.split(".")?.pop()?.toLowerCase() ??
      file.fileUrl?.type ??
      params?.sourceFormat ??
      "jpeg";
    return extension;
  };

  return (
    <div
      className="files-container"
      role="region"
      aria-label={t("fileActions.fileSelected")}
    >
      <GridContainer
        alignItems="center"
        justifyContent="space-between"
        className="u-pb2"
        spacing={2}
      >
        <GridItem>
          <Heading level={2} appearance={5}>
            {files.length} {t("fileActions.files")} {t("fileActions.selected")}:
          </Heading>
        </GridItem>
        <GridItem>
          <GridContainer>
            {notDownloadable.length === 0 && (
              <GridItem>
                <Button
                  onClick={onDownloadAll}
                  ariaLabel={`${t("fileActions.downloadAll")} ${
                    files.length
                  } ${t("fileActions.files")}`}
                >
                  {t("fileActions.downloadAll")} ({files.length})
                </Button>
              </GridItem>
            )}
            <GridItem className="u-pl1">
              <Button
                onClick={onRemoveAll}
                className="files-table__remove-button"
                ariaLabel={`${t("fileActions.removeAll")} ${t(
                  "fileActions.files"
                )}`}
              >
                {t("fileActions.removeAll")}
              </Button>
            </GridItem>
            {notDownloadable.length === 0 && (
              <GridItem className="u-pl1">
                <ShareButton
                  onEmailShare={handleEmailShare}
                  onDownload={onDownloadAll}
                  files={files}
                />
              </GridItem>
            )}
          </GridContainer>
        </GridItem>
      </GridContainer>

      <div
        className="files-table__container u-mb3"
        role="table"
        aria-label={t("fileActions.selectedList")}
      >
        <GridContainer className="files-table__heading" role="row">
          <GridItem xs={9} md={5} role="columnheader">
            <Text size="large" textWeight="bold">
              {t("fileActions.fileName")}
            </Text>
          </GridItem>
          <GridItem className="table-item" xs={3} md={1} role="columnheader">
            <Text size="large" textWeight="bold">
              {t("fileActions.fileSize")}
            </Text>
          </GridItem>
          <GridItem className="table-item" xs={1} md={2} role="columnheader">
            <GridContainer justifyContent="center">
              <Text size="large" textWeight="bold">
                {t("fileActions.fileStatus")}
              </Text>
            </GridContainer>
          </GridItem>
          <GridItem xs={3} md={4} role="columnheader">
            <GridContainer justifyContent="center">
              <Text size="large" textWeight="bold">
                {t("fileActions.fileActions")}
              </Text>
            </GridContainer>
          </GridItem>
        </GridContainer>
        {files.map((file, index) => (
          <GridContainer
            className="files-table__item"
            alignItems="center"
            key={index}
            role="row"
          >
            <GridItem xs={9} md={5} role="cell">
              <GridContainer alignItems="center">
                <div className="table-item u-pr1">
                  <FormatImage format={getFileType(file)} />
                </div>
                <Text>{file.fileName}</Text>
              </GridContainer>
              <GridContainer className="table-item__mobile" alignItems="center">
                <Text size="small">{bytesToKilobytes(file.fileSize)} kb</Text>
                <StatusBar status={file.status} />
              </GridContainer>
            </GridItem>
            <GridItem className="table-item" xs={4} md={1} role="cell">
              <Text>{bytesToKilobytes(file.fileSize)} kb</Text>
            </GridItem>
            <GridItem className="table-item" xs={1} md={2} role="cell">
              <GridContainer justifyContent="center">
                <StatusBar status={file.status} />
              </GridContainer>
            </GridItem>
            <GridItem xs={3} md={4} role="cell">
              <GridContainer justifyContent="flex-end">
                {file.fileUrl && (
                  <>
                    {!hidePreview && (
                      <GridItem className="u-pr1 preview-button table-item">
                        <Button
                          appareance="link"
                          ariaLabel={t("fileActions.preview")}
                          tooltipContent={t("fileActions.preview")}
                          onClick={() =>
                            handlePreview({
                              name: file.fileName,
                              file: file.fileUrl,
                            })
                          }
                        >
                          <Icon color="secondary" size="small" icon="image" />
                        </Button>
                      </GridItem>
                    )}
                    <GridItem className="u-pr1">
                      <Button
                        onClick={() => onDownload(file)}
                        ariaLabel={`${t("fileActions.download")} ${
                          file.fileName
                        }`}
                      >
                        {t("fileActions.download")}
                      </Button>
                    </GridItem>
                  </>
                )}
                <GridItem className="table-item">
                  <Button
                    className="files-table__remove-button"
                    onClick={() => onRemove(index)}
                    ariaLabel={`${t("fileActions.remove")} ${file.fileName}`}
                  >
                    {t("fileActions.remove")}
                  </Button>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        ))}
      </div>
      <Modal
        title={t("fileActions.preview")}
        className="preview-modal"
        onClose={closePreview}
        isOpen={Boolean(previewModal)}
      >
        <GridContainer
          direction="column"
          className="max-height"
          alignItems="center"
          justifyContent="center"
        >
          <Heading align="center" className="u-pt2" appearance={6} level={2}>
            {previewModal?.fileName}
          </Heading>
          <img
            style={{ maxWidth: "700px", width: "auto", maxHeight: "80vh" }}
            src={previewModal?.file}
            alt={t("fileActions.preview")}
          />
        </GridContainer>
      </Modal>
    </div>
  );
};

export default Files;
