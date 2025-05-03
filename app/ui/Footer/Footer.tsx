import React from "react";
import "./Footer.scss";
import ContentContainer from "../ContentContainer/ContentContainer";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import GridContainer from "../Grid/Grid";
import { IconType } from "../Icon/Icon";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { FOOTER } from "~/constants/content";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";

type FooterProps = {
  sections: {
    title: string;
    links: { name: string; url: string }[];
  }[];
  socialNetworks: {
    href: string;
    icon: IconType;
    label: string;
  }[];
  address: string;
  phone: string;
  email: string;
  copyright: string;
  backgroundImageUrl: string;
  className?: string;
};

const Footer: React.FC<FooterProps> = ({
  email,
  copyright,
  className,
  backgroundImageUrl,
}) => {
  const { t, i18n } = useTranslation();


  const sections = [
    ...FOOTER.sections,
    {
      title: t("footer.otherTools.heading"),
      links: POPULAR_CONVERSIONS?.slice(0, 7)?.map((item) => ({
        name: t("services.itemTitle", {
          sourceFormat: item.from,
          targetFormat: item.to,
        }),
        url: item.href,
      })),
    },
  ];

  // Helper function to ensure the locale is in the URL
  const getLocalizedUrl = (originalUrl: string): string => {
    const currentLocale = i18n.language;
    const urlParts = originalUrl.split('/').filter(Boolean);
    
    // Check if the URL already starts with a locale
    if (i18n.options.supportedLngs?.includes(urlParts[0])) {
      // If it does, replace it with the current locale
      urlParts[0] = currentLocale;
    } else {
      // If it doesn't, add the current locale at the beginning
      urlParts.unshift(currentLocale);
    }

    return `/${urlParts.join('/')}`;
  };

  return (
    <footer
      className={classNames("footer bg-color-dark", className)}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="footer__overlay">
        <ContentContainer>
          <div className="footer__container">
            <div className="footer__section">
              <Heading appearance={6} level={2} color="accent">
                {t("pageName")}
              </Heading>
              <address className="footer__address u-pb1">
                <strong>{t('email')}:</strong> {t(email)}
              </address>
              <GridContainer className="footer__buttons u-pt1">
                {/* <GridItem>
                  <ThemeToggle />
                </GridItem> */}
                {/* {socialNetworks.map((item) => (
                  <GridItem className="u-pl1" key={item.icon}>
                    <Button
                      href={getLocalizedUrl(item.href)}
                      ariaLabel={item.label}
                      appareance="tertiary"
                      tooltipContent={item.label}
                    >
                      <Icon icon={item.icon} color="white" size="small" />
                    </Button>
                  </GridItem>
                ))} */}
              </GridContainer>
            </div>

            {sections.map((section, index) => (
              <div className="footer__section" key={index}>
                <Heading appearance={6} level={2} color="accent">
                  {t(section.title)}
                </Heading>
                <ul className="footer__links">
                  {section.links.map((link, linkIndex) => (
                    <li className="footer__link-item" key={linkIndex}>
                      <a href={getLocalizedUrl(t(link.url))} className="footer__link">
                        {t(link.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer__bottom">
            <Text align="center">{t(copyright)}</Text>
          </div>
        </ContentContainer>
      </div>
    </footer>
  );
};

export default Footer;