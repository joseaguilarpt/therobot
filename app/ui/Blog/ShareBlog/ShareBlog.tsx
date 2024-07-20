// ShareSocial.tsx
import React from 'react';
import styles from './ShareSocial.module.scss';

interface ShareSocialProps {
  url: string;
  title: string;
  description: string;
}

const ShareSocial: React.FC<ShareSocialProps> = ({ url, title, description }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`, '_blank');
  };

  return (
    <div className={styles.shareSocial}>
      <button onClick={shareFacebook} className={styles.facebook}>
        Share on Facebook
      </button>
      <button onClick={shareTwitter} className={styles.twitter}>
        Share on Twitter
      </button>
      <button onClick={shareLinkedIn} className={styles.linkedin}>
        Share on LinkedIn
      </button>
      <button onClick={shareWhatsApp} className={styles.whatsapp}>
        Share on WhatsApp
      </button>
    </div>
  );
};

export default ShareSocial;