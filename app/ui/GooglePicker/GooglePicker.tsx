import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import googleDriveLogo from "../../img/google-drive.svg";
import { useTheme } from "~/context/ThemeContext";
import { GoogleFile, GoogleUploadProps } from "~/utils/googleUploadUtils";

export const GoogleDrivePicker = ({
  addFiles,
  sourceFormat,
  setLoading,
  isDisabled,
}: GoogleUploadProps) => {
  const { t, i18n } = useTranslation();
  const { showSnackbar } = useTheme();

  const handleUploadFiles = async (selectedFiles: GoogleFile[]) => {
    const token = window.gapi.auth.getToken();
    if (!token.access_token) {
      showSnackbar(t("googleModal.errors.noAccessToken"), "error");
      return;
    }

    try {
      setLoading(true);
      const downloadPromises = selectedFiles.map(async (file) => {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return new File([blob], file.name, { type: file.mimeType });
      });

      const downloadedFiles = await Promise.all(downloadPromises);
      addFiles(downloadedFiles);
    } catch (error) {
      setLoading(false);
      showSnackbar(t("googleModal.errors.uploadError"), "error");
    }
  };

  const pickerCallback = (data: { action: string; docs: GoogleFile[] }) => {
    if (data.action === window.google.picker.Action.PICKED) {
      handleUploadFiles(data.docs);
    }
    if (data.action === window.google.picker.Action.CANCEL) {
      showSnackbar(t("dropboxModal.messages.operationCancelled"), "info");
    }
  };

  const createPicker = () => {
    if (!window.google || !window.google.picker) {
      console.error("Google Picker API not loaded");
      showSnackbar(t("googleModal.errors.apiNotLoaded"), "error");
      return;
    }

    const showPicker = () => {
      const token = window.gapi.auth.getToken();
      if (!token.access_token) {
        console.error("Access token is null");
        showSnackbar(t("googleModal.errors.noAccessToken"), "error");
        return;
      }

      const picker = new window.google.picker.PickerBuilder()
        .addView(
          new window.google.picker.DocsView().setMode(
            window.google.picker.DocsViewMode.LIST
          )
        )
        .setOAuthToken(token.access_token)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(window.ENV?.G_DRIVE_API ?? "")
        .setSelectableMimeTypes(`image/${sourceFormat?.toLowerCase() ?? ""}`)
        .setCallback(pickerCallback)
        .setAppId(window.ENV?.G_DRIVE_APP_ID ?? "")
        .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
        .setLocale(i18n.language)
        .build();

      picker.setVisible(true);
    };

    window.tokenClient.callback = async (response: { error: string }) => {
      if (response.error !== undefined) {
        console.error("Error getting access token:", response.error);
        showSnackbar(t("googleModal.errors.authError"), "error");
        return;
      }
      showPicker();
    };

    if (window.gapi?.client?.getToken() === null) {
      window.tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      window.tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  const handleUpload = () => {
    if (!window.gisInited) {
      showSnackbar(t("googleModal.errors.apiNotLoaded"), "error");
      return;
    }

    createPicker();
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
