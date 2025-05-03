import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
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
  const title = t("ccpaCompliance.meta.title");
  const description = t("ccpaCompliance.meta.description");
  const keywords = t("ccpaCompliance.meta.keywords");
  const ogTitle = t("ccpaCompliance.meta.ogTitle");
  const ogDescription = t("ccpaCompliance.meta.ogDescription");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = ({ data }) => {
  const { description, title } = data as any;
  const url = `https://easyconvertimage.com/ccpa-compliance`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      en: "https://easyconvertimage.com/en/ccpa-compliance",
      es: `https://easyconvertimage.com/es/ccpa-compliance`,
      fr: `https://easyconvertimage.com/fr/ccpa-compliance`,
      de: `https://easyconvertimage.com/de/ccpa-compliance`,
      pt: `https://easyconvertimage.com/pt/ccpa-compliance`,
      nl: `https://easyconvertimage.com/nl/ccpa-compliance`,
      it: `https://easyconvertimage.com/it/ccpa-compliance`,
      id: `https://easyconvertimage.com/id/ccpa-compliance`,
      ru: `https://easyconvertimage.com/ru/ccpa-compliance`,
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

export default function CCPA() {
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
            {t("ccpaCompliance.heading")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                { icon: "FaHome", label: t("home"), href: `/${i18n.language ?? ''}` },
                { label: t("ccpaCompliance.heading") },
              ]}
            />
          </GridContainer>
        </Hero>
        <div className="u-pt6 u-mb6">
          <ContentContainer>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.subheading")}
            </Heading>

            <Text>{t("ccpaCompliance.lastUpdated")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.sections.consumerRights.title")}
            </Heading>

            <Text>{t("ccpaCompliance.sections.consumerRights.intro")}</Text>

            <Text>{t("ccpaCompliance.sections.consumerRights.list")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.sections.infoCollected.title")}
            </Heading>

            <Text>{t("ccpaCompliance.sections.infoCollected.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.sections.exerciseRights.title")}
            </Heading>

            <Text>{t("ccpaCompliance.sections.exerciseRights.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.sections.verification.title")}
            </Heading>

            <Text>{t("ccpaCompliance.sections.verification.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.sections.authorizedAgent.title")}
            </Heading>

            <Text>{t("ccpaCompliance.sections.authorizedAgent.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("ccpaCompliance.sections.doNotSell.title")}
            </Heading>

            <Text>{t("ccpaCompliance.sections.doNotSell.content")}</Text>
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
