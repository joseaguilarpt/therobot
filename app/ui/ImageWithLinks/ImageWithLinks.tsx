// app/components/Cards.tsx
import Button from "../Button/Button";
import Heading from "../Heading/Heading";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import "./ImageWithLinks.scss";
import { useTranslation } from "react-i18next";

interface Card {
  title: string;
  imageUrl: string;
  category: string;
  content: string;
}

const ImageWithLinks = ({ card }: { card: Card }) => {
  const { t } = useTranslation();
  return (
    <div className="image-with-link">
      <img
        src={card.imageUrl}
        alt={t(card.title)}
        className="image-with-link__image"
      />
      <div className="image-with-link__overlay">
        <div className="image-with-link__overlay-content u-pl1 u-pr1">
          <Heading appearance={6} level={6}>
            {t(card.title)}
          </Heading>
          <div className="u-pb2">
            <Text align="center">{t(card.content)}</Text>
          </div>
          <div className="image-with-link__buttons">
            <Button appareance="outlined">
              <Icon icon="FaSearch" color="success" size="small" />
            </Button>
            <Button appareance="outlined">
              <Icon icon="FaLink" color="success" size="small" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWithLinks;
