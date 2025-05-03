import "./ShareButton.scss";
import React, { useState } from "react";
import Modal from "../Modal/Modal"; // Make sure you have this Modal component
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import Button from "../Button/Button";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import InputText from "../InputText/InputText";
import { useTheme } from "~/context/ThemeContext";
import ContactWithWhatsapp from "../ContactWhatsapp/ContactWhatsapp";
import { useTranslation } from "react-i18next";

interface FileInfo {
  fileUrl: string;
  fileName: string;
}

interface ShareButtonProps {
  files: FileInfo[];
  onDownload: () => void;
  onEmailShare: (email: string) => void;
}

export function validateEmailFormat(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const ShareButton: React.FC<ShareButtonProps> = ({
  files,
  onDownload,
  onEmailShare,
}) => {
  const { t } = useTranslation();
  const { showSnackbar } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEmailShare = () => {
    if (email && !validateEmailFormat(email)) {
      showSnackbar(t("share.invalidEmail"), "error");
      return;
    }
    setIsLoading(true);
    if (onEmailShare) {
      onEmailShare(email ?? '');
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
    }, 3000);
  };

  return (
    <>
      <Button
        appareance="outlined"
        onClick={() => setIsModalOpen(true)}
        isDisabled={!files || files.length === 0}
      >
        Share
      </Button>
      <Modal
        className="share-modal"
        size="lg"
        title={t('share.title')}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className="u-pt2 u-pl2 u-pr2 u-pb4">
          <Heading level={3} appearance={5}>
            {t('share.title')}
          </Heading>
          <Text>
            {t('share.description')}
          </Text>
          <div className="u-pt3 u-pb3 share-buttons">

            <Text>
              {t('share.viaEmail')}
            </Text>
            <GridContainer className="u-pt2 u-pb1">
              <GridItem className="u-pr2" xs={6}>
                <InputText
                  id="email"
                  type="text"
                  onChange={setEmail}
                  isLabelVisible={false}
                  placeholder={t('email')}
                  label={t('email')}
                />
              </GridItem>
              <GridItem xs={6}>
                <Button
                  className="share-email__button"
                  onClick={handleEmailShare}
                  size="large"
                  isLoading={isLoading}
                  isDisabled={!email}
                >
                  {t('share.viaEmail')}
                </Button>
              </GridItem>
            </GridContainer>
            <div>
              <Text className="u-pb2">Or</Text>
              <Button
                className="download-email__button"
                size="large"
                onClick={onDownload}
              >
                {t('share.downloadZip')}
              </Button>
            </div>
            <Text className="u-pt3">
            {t('share.optionWhatsapp')}
            </Text>
            <GridContainer className="u-pt2">
              <GridItem xs={7} className="u-pr2">
                <InputText
                  id="phone"
                  type="text"
                  onChange={setPhone}
                  isLabelVisible={false}
                  placeholder={t('phone')}
                  label={t('phone')}
                  
                />
              </GridItem>
              <GridItem xs={5}>
                <ContactWithWhatsapp
                  message={t('share.whatsappMessage')}
                  isDisabled={!phone}
                  phoneNumber={phone ?? ""}
                />
              </GridItem>
            </GridContainer>
          </div>
          <Text>
            {t('share.warning')}
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;
