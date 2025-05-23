import React from "react";
import Button from "~/ui/Button/Button";
import "./ContactWhatsapp.scss";
import { useTranslation } from "react-i18next";

interface ContactWithWhatsappProps {
  phoneNumber: string;
  isDisabled?: boolean;
  message?: string;
}

const ContactWithWhatsapp: React.FC<ContactWithWhatsappProps> = ({
  phoneNumber,
  message,
  isDisabled
}) => {
  const { t } = useTranslation(); // Hook for accessing translations

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-numeric characters
    return phone.replace(/\D/g, "");
  };

  const handleClick = () => {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${encodeURIComponent(
      message || "Hello!"
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="contact-with-whatsapp">
      <Button isDisabled={isDisabled} appareance="primary" onClick={handleClick}>
        {t("share.viaWhatsapp")}
      </Button>
    </div>
  );
};

export default ContactWithWhatsapp;
