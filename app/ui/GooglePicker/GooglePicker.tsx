import React, { useState } from "react";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import googleDriveLogo from "../../img/google-drive.svg";
import useDrivePicker from "react-google-drive-picker";
import { useTheme } from "~/context/ThemeContext";
import { GoogleFile, GoogleUploadProps, User } from "~/utils/googleUploadUtils";
import { useGoogleLogin } from "@react-oauth/google";

export const GoogleDrivePicker = ({
  addFiles,
  sourceFormat,
  isDisabled,
}: GoogleUploadProps) => {
  const { t, i18n } = useTranslation();
  const { showSnackbar } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [attempt, setAttempt] = useState<boolean>(false);
  const [openPicker] = useDrivePicker();

  const handleUploadFiles = async (selectedFiles: GoogleFile[]) => {
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
      addFiles(filesData);
      setUser(null);
    } catch (error) {
      showSnackbar(t("googleModal.errors.uploadError"), "error");
    }
  };

  const handleOpenPicker = () => {
    const query = `image/${sourceFormat?.toLowerCase()}`;
    openPicker({
      clientId: window.ENV?.DRIVE_PICKER_CLIENT ?? "",
      developerKey: window.ENV?.DRIVE_PICKER_API ?? "",
      viewId: "DOCS",
      showUploadView: false,
      token: user?.access_token,
      showUploadFolders: true,
      supportDrives: true,
      viewMimeTypes: query,
      multiselect: true,
      locale: i18n.language,
      callbackFunction: (data) => {
        console.log(data, "data");
        if (data.action === "picked") {
          // @ts-expect-error sisas
          handleUploadFiles(data?.docs);
        }
        if (data.action === "cancel") {
          showSnackbar(t("dropboxModal.messages.operationCancelled"), "info"),
          setUser(null)
        }
      },
    });
  };

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse as User);
    },
    onError: () => {
      showSnackbar(t("googleModal.errors.loginFailed"), "error");
    },
  });

  React.useEffect(() => {
    if (user && attempt) {
      handleOpenPicker();
      setAttempt(false);
    }
  }, [user, attempt]);

  const handleUpload = () => {
    setAttempt(true);
    if (user) {
      handleOpenPicker();
    } else {
      login();
    }
  };

  return (
    <div>
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
    </div>
  );
};
