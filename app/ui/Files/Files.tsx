import "./Files.scss";
import React from "react";
import Button from "../Button/Button";
import Text from "../Text/Text";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Heading from "../Heading/Heading";
import StatusBar from "../StatusBar/StatusBar";
import JSZip from "jszip";
import pkg from "file-saver";
import { useTheme } from "~/context/ThemeContext";
import ShareButton from "../ShareButton/ShareButton";
import { useTranslation } from "react-i18next";

const { saveAs } = pkg;

interface FilesProps {
  files?: File[];
  onDownload: (file: File) => void;
  onRemove: (v: number) => void;
  onRemoveAll: () => void;
  onEmailShare: (zip: any, email: string) => void;
}

const Files: React.FC<FilesProps> = ({
  files,
  onDownload,
  onRemove,
  onRemoveAll,
  onEmailShare,
}) => {
  const { t } = useTranslation();
  const { showSnackbar } = useTheme();
  if (files?.length === 0) {
    return null;
  }

  const generateZip = async () => {
    if (!files) return;

    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileContent = await file.fileUrl.arrayBuffer();
      zip.file(file.fileName, fileContent);
    }

    const zipContent = await zip.generateAsync({ type: "blob" });
    return zipContent;
  };

  const onDownloadAll = async () => {
    if (!files) return;

    const zipContent = await generateZip();
    saveAs(zipContent, "files.zip");
    showSnackbar(t("fileActions.zipSuccess"), "success");
  };

  function bytesToKilobytes(bytes: number): number {
    const kilobytes = bytes / 1024;
    return Math.round(kilobytes * 10) / 10;
  }

  const handleEmailShare = async (v: string) => {
    const zipContent = await generateZip();
    if (onEmailShare) {
      onEmailShare(zipContent, v);
    }
  };

  const notDownloadable = files?.filter((item) => item.status === "processing");

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
      >
        <GridItem>
          <Heading level={2} appearance={5}>
            {files?.length} {t("fileActions.files")}{' '}
            {t("fileActions.selected")}:
          </Heading>
        </GridItem>
        <GridItem>
          <GridContainer>
            {notDownloadable?.length === 0 && (
              <GridItem>
                <Button
                  onClick={onDownloadAll}
                  ariaLabel={`${t("fileActions.downloadAll")} ${
                    files?.length
                  } ${t("fileActions.files")}`}
                >
                  {t("fileActions.downloadAll")} ({files?.length})
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
            {notDownloadable?.length === 0 && (
              <GridItem className="u-pl1">
                <ShareButton
                  onEmailShare={handleEmailShare}
                  onDownload={onDownloadAll}
                  files={files ?? []}
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
          <GridItem xs={5} role="columnheader">
            <Text size="large" textWeight="bold">
              {t("fileActions.fileName")}
            </Text>
          </GridItem>
          <GridItem xs={3} md={1} role="columnheader">
            <Text size="large" textWeight="bold">
              {t('fileActions.fileSize')}
            </Text>
          </GridItem>
          <GridItem className="table-item" xs={1} md={3} role="columnheader">
            <GridContainer justifyContent="center">
              <Text size="large" textWeight="bold">
                {t("fileActions.fileStatus")}
              </Text>
            </GridContainer>
          </GridItem>
          <GridItem xs={3} md={3} role="columnheader">
            <GridContainer justifyContent="center">
              <Text size="large" textWeight="bold">
                {t("fileActions.fileActions")}
              </Text>
            </GridContainer>
          </GridItem>
        </GridContainer>
        {files?.map((file, index) => (
          <GridContainer
            className="files-table__item"
            alignItems="center"
            key={index}
            role="row"
          >
            <GridItem xs={5} role="cell">
              <Text>{file.fileName}</Text>
            </GridItem>
            <GridItem xs={4} md={1} role="cell">
              <Text>{bytesToKilobytes(file.fileSize)} kb</Text>
            </GridItem>
            <GridItem className="table-item" xs={1} md={3} role="cell">
              <GridContainer justifyContent="center">
                <StatusBar status={file.status} />
              </GridContainer>
            </GridItem>
            <GridItem xs={3} md={3} role="cell">
              <GridContainer justifyContent="flex-end">
                {file.fileUrl && (
                  <GridItem className="u-pr1">
                    <Button
                      onClick={() => onDownload(file)}
                      ariaLabel={`${t("fileActions.download")} ${
                        file.fileName
                      }`}
                    >
                      {t('fileActions.download')}
                    </Button>
                  </GridItem>
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
    </div>
  );
};

export default Files;
