import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import React from "react";
import { useTranslation } from "react-i18next";
import { FOOTER } from "~/constants/content";
import i18next from "~/i18next.server";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Breadcrumb from "~/ui/Breadcrumbs/Breadcrumbs";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Footer from "~/ui/Footer/Footer";
import GridContainer from "~/ui/Grid/Grid";
import Heading from "~/ui/Heading/Heading";
import Hero from "~/ui/Hero/Hero";
import Navbar from "~/ui/Navbar/Navbar";
import Text from "~/ui/Text/Text";
import { createMeta } from "~/utils/meta";

export async function loader({ request }: LoaderFunctionArgs) {
  let t = await i18next.getFixedT(request);
  const title = t("gdprCompliance.meta.title");
  const description = t("gdprCompliance.meta.description");
  const keywords = t("gdprCompliance.meta.keywords");
  const ogTitle = t("gdprCompliance.meta.ogTitle");
  const ogDescription = t("gdprCompliance.meta.ogDescription");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = ({ data }) => {
  const { description, title } = data as any;
  const url = `https://easyconvertimage.com/gdpr-compliance`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      en: "https://easyconvertimage.com/en/gdpr-compliance",
      es: `https://easyconvertimage.com/es/gdpr-compliance`,
      fr: `https://easyconvertimage.com/fr/gdpr-compliance`,
      de: `https://easyconvertimage.com/de/gdpr-compliance`,
      pt: `https://easyconvertimage.com/pt/gdpr-compliance`,
      nl: `https://easyconvertimage.com/nl/gdpr-compliance`,
      it: `https://easyconvertimage.com/it/gdpr-compliance`,
      id: `https://easyconvertimage.com/id/gdpr-compliance`,
      ru: `https://easyconvertimage.com/ru/gdpr-compliance`,
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: url,
      description: description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Organization",
        name: "Easy Convert Image",
        url: "https://easyconvertimage.com",
      },
    },
    // @ts-ignore
  })({ data });
};

export default function GDPR() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Navbar autoScrolled />
      <main id="main-content">
        <Hero>
          <Heading
            level={1}
            appearance={3}
            align="center"
            color="contrast"
            underline
          >
            {t("gdprCompliance.heading")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                { icon: "FaHome", label: t("home"), href: `/${i18n.language ?? ''}` },
                { label: t("gdprCompliance.heading") },
              ]}
            />
          </GridContainer>
        </Hero>
        <div className="u-pt6 u-mb6">
          <ContentContainer>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("gdprCompliance.subheading")}
            </Heading>

            <Text>{t("gdprCompliance.lastUpdated")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("gdprCompliance.sections.dataController.title")}
            </Heading>

            <Text>{t("gdprCompliance.sections.dataController.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("gdprCompliance.sections.legalBasis.title")}
            </Heading>

            <Text>{t("gdprCompliance.sections.legalBasis.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("gdprCompliance.sections.dataSubjectRights.title")}
            </Heading>

            <Text>
              {t("gdprCompliance.sections.dataSubjectRights.content")}
            </Text>

            <Text>
              {t("gdprCompliance.sections.dataSubjectRights.exerciseRights")}
            </Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("gdprCompliance.sections.dataRetention.title")}
            </Heading>

            <Text>{t("gdprCompliance.sections.dataRetention.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("gdprCompliance.sections.internationalTransfers.title")}
            </Heading>

            <Text>
              {t("gdprCompliance.sections.internationalTransfers.content")}
            </Text>
          </ContentContainer>
        </div>
      </main>
      <BackToTop />
      <Footer
        {...FOOTER}
        backgroundImageUrl={""}
        socialNetworks={[
          { label: "Facebook", icon: "FaFacebook", href: "#" },
          { label: "Twitter", icon: "FaTwitter", href: "#" },
        ]}
      />
    </>
  );
}
