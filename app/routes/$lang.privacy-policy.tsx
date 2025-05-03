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
  const t = await i18next.getFixedT(request);
  const keywords = t("privacyPolicy.meta.keywords");
  const ogTitle = t("privacyPolicy.meta.ogTitle");
  const ogDescription = t("privacyPolicy.meta.ogDescription");
  const description = t("privacyPolicy.meta.description");
  const title = t("privacyPolicy.meta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = ({ data }) => {
  const { description, title } = data as any;
  const url = `https://easyconvertimage.com/privacy-policy`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      es: `https://easyconvertimage.com/es/privacy-policy`,
      fr: `https://easyconvertimage.com/fr/privacy-policy`,
      de: `https://easyconvertimage.com/de/privacy-policy`,
      pt: `https://easyconvertimage.com/pt/privacy-policy`,
      nl: `https://easyconvertimage.com/nl/privacy-policy`,
      it: `https://easyconvertimage.com/it/privacy-policy`,
      id: `https://easyconvertimage.com/id/privacy-policy`,
      ru: `https://easyconvertimage.com/ru/privacy-policy`,
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

export default function PrivacyPolicy() {
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
            {t("privacyPolicy.content.heading")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                { icon: "FaHome", label: t("home"), href: `/${i18n.language ?? ''}` },
                { label: t("privacyPolicy.content.heading") },
              ]}
            />
          </GridContainer>
        </Hero>
        <div className="u-pt6 u-mb6">
          <ContentContainer>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("privacyPolicy.content.heading")} {t("for")} Easy Convert Image
            </Heading>

            <Text>{t("privacyPolicy.content.lastUpdated")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              1. {t("privacyPolicy.content.sections.0.title")}
            </Heading>

            <Text>{t("privacyPolicy.content.introduction")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              2. {t("privacyPolicy.content.sections.0.title")}
            </Heading>

            <Text>{t("privacyPolicy.content.sections.0.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              3. {t("privacyPolicy.content.sections.1.title")}
            </Heading>

            <Text>{t("privacyPolicy.content.sections.1.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              4. {t("privacyPolicy.dataSharing.title")}
            </Heading>

            <Text>{t("privacyPolicy.dataSharing.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              5. {t("privacyPolicy.content.sections.2.title")}
            </Heading>

            <Text>{t("privacyPolicy.content.sections.2.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              6. {t("privacyPolicy.content.sections.3.title")}
            </Heading>

            <Text>{t("privacyPolicy.content.sections.3.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              7. {t("privacyPolicy.contactUs.title")}
            </Heading>

            <Text>{t("privacyPolicy.contactUs.content")}</Text>
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
