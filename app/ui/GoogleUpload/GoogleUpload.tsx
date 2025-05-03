import "./GoogleUpload.scss";
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Checkbox from "../Checkbox/Checkbox";
import InputText from "../InputText/InputText";
import InputSelect from "../InputSelect/InputSelect";
import { FormatImage } from "../FormatImage/FormatImage";

import googleDriveLogo from "../../img/google-drive.svg";
import {
  GoogleFile,
  GoogleUploadProps,
  User,
  bytesToKilobytes,
  formatDate,
  sortFiles,
} from "~/utils/googleUploadUtils";
import { useTheme } from "~/context/ThemeContext";

export default function GoogleUpload({
  sourceFormat,
  isDisabled,
  addFiles,
}: GoogleUploadProps): JSX.Element {
  const { t } = useTranslation();
  const { showSnackbar } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [attempt, setAttempt] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [listOfImages, setListOfImages] = useState<GoogleFile[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<GoogleFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseModal = () => {
    setSelectedFiles([]);
    setQuery("");
    setSortBy("");
    setIsOpenModal(false);
  };

  const handleUploadFiles = async () => {
    setIsLoading(true);
    const fileIds = selectedFiles.map((item) => item.id);
    try {
      const downloadPromises = fileIds.map(async (fileId) => {
        const file = selectedFiles.find((f) => f.id === fileId);
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();

        const fileName = file?.name || "unknown";
        const fileType = file?.mimeType || "application/octet-stream";
        const downloadedFile = new File([blob], fileName, { type: fileType });

        return { id: fileId, file: downloadedFile };
      });

      const downloadedFiles = await Promise.all(downloadPromises);
      const filesData = downloadedFiles.map((item) => item.file);
      handleCloseModal();
      addFiles(filesData);
    } catch (error) {
      showSnackbar(t("googleModal.errors.uploadError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleDriveUpload = async () => {
    if (!user) return;

    try {
      const query = `mimeType='image/${sourceFormat?.toLowerCase()}'`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}&fields=files(id,name,mimeType,size,createdTime)`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      const data = await response.json();
      setListOfImages(data?.files ?? []);
      setIsOpenModal(true);
    } catch (error) {
      showSnackbar(t("googleModal.errors.fetchError"), "error");
    }
  };

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.readonly",
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse as User);
    },
    onError: () => {
      showSnackbar(t("googleModal.errors.loginFailed"), "error");
    },
  });

  useEffect(() => {
    if (user && attempt) {
      handleGoogleDriveUpload();
      setAttempt(false);
    }
  }, [user, attempt]);

  const handleUpload = () => {
    setAttempt(true);
    if (user) {
      handleGoogleDriveUpload();
    } else {
      login();
    }
  };

  const filteredAndSortedList = query
    ? sortFiles(listOfImages, sortBy).filter((v) =>
        v.name?.toLowerCase().includes(query.toLowerCase())
      )
    : sortFiles(listOfImages, sortBy);

  const handleAddFile = (item: GoogleFile) => {
    setSelectedFiles((prev) => {
      const existingIndex = prev.findIndex((v) => item.id === v.id);
      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      return [...prev, item];
    });
  };

  return (
    <>
      <Button
        isDisabled={isDisabled}
        onClick={handleUpload}
        tooltipContent={t("googleModal.button.uploadFromGoogleDrive")}
        ariaLabel={t("googleModal.button.uploadFromGoogleDrive")}
        appareance="secondary"
        size="small"
      >
        <img
          width={20}
          src={googleDriveLogo}
          alt={t("googleModal.accessibility.googleDriveLogo")}
        />
      </Button>
      <Modal
        className="google-modal-container"
        title={t("googleModal.modal.title")}
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        aria-label={t("googleModal.accessibility.modalLabel")}
      >
        <div className="google-modal-content u-pb2 u-pl2 u-pr2">
          <Heading appearance={4} underline level={1}>
            {t("googleModal.modal.heading")}
          </Heading>
          <div>
            <GridContainer className="google-upload-actions">
              <div className="u-pr2">
                <InputText
                  clearButton={true}
                  label={t("googleModal.modal.filterFiles.label")}
                  onChange={setQuery}
                  isLabelVisible={false}
                  placeholder={t("googleModal.modal.filterFiles.placeholder")}
                  aria-label={t("googleModal.accessibility.filterFilesLabel")}
                />
              </div>
              <div>
                <InputSelect
                  onSelect={setSortBy}
                  options={[
                    {
                      id: 0,
                      value: "name",
                      label: t("googleModal.modal.sortBy.options.fileName"),
                    },
                    {
                      id: 2,
                      value: "file_size",
                      label: t("googleModal.modal.sortBy.options.fileSize"),
                    },
                    {
                      id: 3,
                      value: "creation_date",
                      label: t("googleModal.modal.sortBy.options.creationDate"),
                    },
                  ]}
                  label={t("googleModal.modal.sortBy.label")}
                  placeholder={t("googleModal.modal.sortBy.placeholder")}
                  aria-label={t("googleModal.accessibility.sortFilesLabel")}
                />
              </div>
            </GridContainer>
            <div
              role="table"
              aria-label={t("googleModal.accessibility.fileTable")}
            >
              <div role="rowgroup">
                <GridContainer className="google-upload-header" role="row">
                  <GridItem role="columnheader" xs={2}>
                    <Text textWeight="bold" color="contrast">
                      {t("googleModal.modal.tableHeader.select")}
                    </Text>
                  </GridItem>
                  <GridItem role="columnheader" xs={6}>
                    <Text textWeight="bold" color="contrast">
                      {t("googleModal.modal.tableHeader.fileName")}
                    </Text>
                  </GridItem>
                  <GridItem role="columnheader" className="table-item" xs={2}>
                    <Text textWeight="bold" color="contrast">
                      {t("googleModal.modal.tableHeader.fileSize")}
                    </Text>
                  </GridItem>
                  <GridItem role="columnheader" className="table-item" xs={2}>
                    <Text textWeight="bold" color="contrast">
                      {t("googleModal.modal.tableHeader.creationDate")}
                    </Text>
                  </GridItem>
                </GridContainer>
              </div>
              <div role="rowgroup">
                <GridContainer
                  justifyContent="space-between"
                  className="google-upload-wrapper"
                >
                  {filteredAndSortedList.map((item, index) => {
                    const isSelected = selectedFiles.some(
                      (v) => v.id === item.id
                    );
                    return (
                      <GridItem
                        onClick={() => handleAddFile(item)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddFile(item)
                        }
                        className={classNames(
                          "google-upload-item",
                          !item.mimeType.includes(sourceFormat) && "--disabled",
                          isLoading && "--disabled",
                          isSelected && "--selected"
                        )}
                        key={index}
                        xs={12}
                        role="row"
                        tabIndex={0}
                        aria-selected={isSelected}
                      >
                        <GridContainer alignItems="center">
                          <GridItem className="u-pl2" xs={2} role="cell">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleAddFile(item)}
                              id={item.name}
                              name={item.name}
                              label={item.name}
                              hideLabel
                              ariaLabel={item.name}
                            />
                          </GridItem>
                          <GridItem xs={10} lg={6} role="cell">
                            <GridContainer alignItems="center">
                              <GridItem xs={2} md={1}>
                                <FormatImage format={item.mimeType} />
                              </GridItem>
                              <GridItem xs={10} md={11}>
                                <Text className="u-pl1">{item.name}</Text>
                                <span className="visually-hidden">
                                  {t("googleModal.accessibility.fileDetails", {
                                    size: bytesToKilobytes(item.size),
                                    date: formatDate(item.createdTime),
                                  })}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem className="table-item" xs={2} role="cell">
                            <Text>{bytesToKilobytes(item.size)} kb</Text>
                          </GridItem>
                          <GridItem className="table-item" xs={2} role="cell">
                            <Text>{formatDate(item.createdTime)}</Text>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    );
                  })}
                  {filteredAndSortedList.length === 0 && (
                    <GridContainer justifyContent="center" role="row">
                      <GridItem className="google-upload-item" role="cell">
                        <Text>{t("googleModal.modal.noResults")}</Text>
                      </GridItem>
                    </GridContainer>
                  )}
                </GridContainer>
              </div>
            </div>
          </div>
        </div>
        <GridContainer
          className="u-pt3 google-container-actions"
          justifyContent="flex-end"
        >
          <GridItem className="table-item">
            <Button
              isDisabled={isLoading}
              onClick={() => setSelectedFiles([])}
              appareance="link"
              size="large"
              ariaLabel={t("googleModal.accessibility.clearSelectionLabel")}
            >
              {t("googleModal.modal.actions.clearSelection")}
            </Button>
          </GridItem>
          <GridItem className="u-pr1 u-pl1">
            <Button
              isDisabled={isLoading}
              onClick={handleCloseModal}
              appareance="secondary"
              size="large"
              ariaLabel={t("googleModal.accessibility.cancelSelectionLabel")}
            >
              {t("googleModal.modal.actions.cancel")}
            </Button>
          </GridItem>
          <GridItem>
            <Button
              isDisabled={isLoading}
              onClick={handleUploadFiles}
              size="large"
              ariaLabel={t("googleModal.accessibility.uploadFilesLabel")}
            >
              {t("googleModal.modal.actions.uploadFiles")}
            </Button>
          </GridItem>
        </GridContainer>
      </Modal>
    </>
  );
}
