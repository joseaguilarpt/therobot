// EditorCard.tsx
import React from "react";
import "./EditorCard.scss";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import Button from "~/ui/Button/Button";
import Icon from "~/ui/Icon/Icon";
import { useTranslation } from "react-i18next";

interface EditorCardProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

// const editorBio = {
//   name: "Manuel Gomez",
//   role: "Senior Technical Editor",
//   bio: `Manuel Gomez is a passionate web developer and image optimization enthusiast. With over a decade of experience in crafting beautiful, performant websites, Manuel loves sharing his knowledge to help others create better web experiences. When he's not diving into the latest web technologies, you can find him experimenting with photography and exploring the great outdoors.`
// };

const EditorCard: React.FC<EditorCardProps> = ({
  name,
  imageUrl,
}) => {
  const { t } = useTranslation()
  return (
    <div className="editor-card">
      <img className="editor-card__image" src={imageUrl} alt={`${name}`} />
      <div className="editor-card__content">
        <Heading level={4} appearance={5} className="editor-card__name">
          {name}
        </Heading>
        <Text className="editor-card__role">{t('blog.seniorTechnicalEditor')}</Text>
        <Text className="editor-card__bio">
          {t('blog.manuelGomezBio')}
        </Text>
        <div className="u-pt1">
        <Button ariaLabel="Go to linkedin"  appareance="link" onClick={() => {}}>
          <Icon color="dark" icon="FaLinkedin" />
        </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorCard;
