import React, { ReactNode } from "react";
import classNames from "classnames";
import "./Card.scss";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import Button from "../Button/Button";
import Icon, { IconType } from "../Icon/Icon";
import GridContainer from "../Grid/Grid";
import { useTranslation } from "react-i18next";

interface CardProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  imagePosition?: "top" | "left" | "right";
  className?: string;
  url?: string;
  shadow?: boolean;
  unstyled?: boolean;
  layout?: string;
  children?: ReactNode;
  underline?: boolean;
  icon?: string;
  iconType?: string;
  id: number;
  ariaLabel?: string;
  conversion?: { from: string; to: string };
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  imagePosition = "left",
  className,
  shadow,
  url,
  underline,
  unstyled,
  icon,
  id,
  ariaLabel,
  iconType = "circle",
  children,
  conversion,
}) => {
  const { t, i18n } = useTranslation();
  const cardClasses = classNames(
    "card",
    className,
    shadow && "__shadow",
    unstyled && "__unstyled",
    {
      [`card--image-${imagePosition}`]: imageUrl,
      [`card--icon-${imagePosition}`]: icon || conversion,
    }
  );

  const iconValue: IconType = icon ? t(icon) : "leaderboard";

  // Create a unique ID for the card
  const cardId = `card-${id}`;
  // Create a unique ID for the title
  const titleId = title ? `${cardId}-title` : undefined;
  // Create a unique labelledby value
  const labelledBy = titleId ? `${cardId} ${titleId}` : cardId;

  const getLocalizedUrl = (originalUrl: string): string => {
    const currentLocale = i18n.language;
    const urlParts = originalUrl.split("/").filter(Boolean);

    // Check if the URL already starts with a locale
    if (i18n.options.supportedLngs?.includes(urlParts[0])) {
      // If it does, replace it with the current locale
      urlParts[0] = currentLocale;
    } else {
      // If it doesn't, add the current locale at the beginning
      urlParts.unshift(currentLocale);
    }

    return `/${urlParts.join("/")}`;
  };

  const handleNavigation = () => {
    if (url) {
      const urlValue = getLocalizedUrl(url);
      window.location.href = urlValue;
    }
  };

  return (
    <div
      className={cardClasses}
      role="region"
      aria-labelledby={labelledBy}
      id={cardId}
    >
      {icon && (
        <div className="__icon-wrapper" aria-hidden="true">
          <div
            className={classNames(
              "__icon-container",
              "u-mb2 u-mt2 u-ml4",
              iconType
            )}
          >
            <div style={{ zIndex: 2, position: "relative" }}>
              <Icon icon={iconValue} size="large" />
            </div>
          </div>
        </div>
      )}
      {conversion && (
        <div className="__icon-wrapper" aria-hidden="true">
          <div className={classNames("__icon-container", "u-ml2", iconType)}>
            <GridContainer
              direction="column"
              alignItems="center"
              justifyContent="center"
              className="icon-content"
            >
              <Text textWeight="bold" size="large">
                {conversion.from}
              </Text>
              <Text textWeight="bold" size="large">
                {conversion.to}
              </Text>
            </GridContainer>
          </div>
        </div>
      )}
      {imageUrl && (
        <div
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={classNames("card__image", `image-${imagePosition}`)}
          role="img"
          aria-label={t("cardImage")}
        ></div>
      )}
      <div className={classNames("card__content", icon && "__with-icon")}>
        {title && (
          <Button
            onClick={handleNavigation}
            appareance="link"
            className="heading--button"
            ariaLabel={ariaLabel ? ariaLabel : title}
          >
            <Heading
              align="left"
              underline={underline}
              level={3}
              type='questrial'
              appearance={6}
              id={titleId}
            >
              {title}
            </Heading>
          </Button>
        )}
        {content && (
          <div className={underline ? "u-pt2" : ""}>
            <Text size="small">{content}</Text>
          </div>
        )}
        {url && (
          <GridContainer justifyContent="flex-end" className="u-mt1">
            <Button
              onClick={handleNavigation}
              appareance="link"
              ariaLabel={ariaLabel ? ariaLabel : t("goToDetails")}
            >
              {t("goNow")}
            </Button>
          </GridContainer>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
