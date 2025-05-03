import React from "react";
import Button from "~/ui/Button/Button";
import "./ContactWithCall.scss";
import { useTranslation } from "react-i18next";

interface ContactWithCallProps {
  phoneNumber: string;
}

const ContactWithCall: React.FC<ContactWithCallProps> = ({ phoneNumber }) => {
  const { t } = useTranslation();
  const handleClick = () => {
    const callUrl = `tel:${phoneNumber}`;
    window.open(callUrl, "_self");
  };

  return (
    <div className="contact-with-call">
      <Button leftIcon="FaPhone" appareance="secondary" onClick={handleClick}>
        {t("contactCall.call")}
      </Button>
    </div>
  );
};

export default ContactWithCall;
