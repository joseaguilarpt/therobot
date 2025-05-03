// ShareSocial.tsx
import React from "react";
import "./ShareBlog.css";
import Icon from "~/ui/Icon/Icon";
import Tooltip from "~/ui/ToolTip/ToolTip";
import Button from "~/ui/Button/Button";
import { useTranslation } from "react-i18next";

interface ShareSocialProps {
  url: string;
  title: string;
  description: string;
}

const ShareSocial: React.FC<ShareSocialProps> = ({
  url,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      "_blank"
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
      "_blank"
    );
  };

  return (
    <div className="share-social">
      <Tooltip content={t('blog.shareInFacebook')}>
        <Button
          ariaLabel={t('blog.shareFacebook')}
          onClick={shareFacebook}
          className="share-button share-facebook"
        >
          <Icon icon="FaFacebook" />
        </Button>
      </Tooltip>
      <Tooltip content={t('blog.shareInTwitter')}>
        <Button ariaLabel={t('blog.shareInTwitter')} onClick={shareTwitter} className="share-button share-twitter">
          <Icon icon="FaTwitter" />
        </Button>
      </Tooltip>
      <Tooltip content={t('blog.shareInLinkedin')}>
        <Button ariaLabel={t('blog.shareInLinkedin')} onClick={shareLinkedIn} className="share-button share-linkedin">
          <Icon icon="FaLinkedin" />
        </Button>
      </Tooltip>
      <Tooltip content={t('blog.shareInWhatsapp')}>
        <Button ariaLabel={t('blog.shareInWhatsapp')} onClick={shareWhatsApp} className="share-button share-whatsapp">
          <Icon icon="FaWhatsapp" />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ShareSocial;
