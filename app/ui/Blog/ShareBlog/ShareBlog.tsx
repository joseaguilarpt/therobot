// ShareSocial.tsx
import React from "react";
import "./ShareBlog.css";
import Tooltip from "~/ui/ToolTip/ToolTip";
import Button from "~/ui/Button/Button";
import { useTranslation } from "react-i18next";
import facebook from '../../../img/facebook.svg'
import whatsapp from '../../../img/whatsapp.svg'
import linkedin from '../../../img/linkedin.svg'
import twitter from '../../../img/twitter.svg'
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
          <img src={facebook} alt={t('blog.shareFacebook')} />
        </Button>
      </Tooltip>
      <Tooltip content={t('blog.shareInTwitter')}>
        <Button ariaLabel={t('blog.shareInTwitter')} onClick={shareTwitter} className="share-button share-twitter">
        <img src={twitter} alt={t('blog.shareInTwitter')} />
        </Button>
      </Tooltip>
      <Tooltip content={t('blog.shareInLinkedin')}>
        <Button ariaLabel={t('blog.shareInLinkedin')} onClick={shareLinkedIn} className="share-button share-linkedin">
        <img src={linkedin} alt={t('blog.shareInLinkedin')} />
        </Button>
      </Tooltip>
      <Tooltip content={t('blog.shareInWhatsapp')}>
        <Button ariaLabel={t('blog.shareInWhatsapp')} onClick={shareWhatsApp} className="share-button share-whatsapp">
        <img src={whatsapp} alt={t('blog.shareInWhatsapp')} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ShareSocial;
