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
import { MetaProps, createMeta } from "~/utils/meta";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const keywords = t("accessibility.meta.keywords");
  const ogTitle = t("accessibility.meta.ogTitle");
  const ogDescription = t("accessibility.meta.ogDescription");
  const description = t("accessibility.meta.description");
  const title = t("accessibility.meta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction<typeof loader> = ({ data, params, location, matches }) => {
  if (!data) {
    return [];
  }
  const { description, title } = data as MetaProps;
  const url = `https://easyconvertimage.com/accessibility`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      en: `https://easyconvertimage.com/en/accessibility`,
      es: `https://easyconvertimage.com/es/accessibility`,
      fr: `https://easyconvertimage.com/fr/accessibility`,
      de: `https://easyconvertimage.com/de/accessibility`,
      pt: `https://easyconvertimage.com/pt/accessibility`,
      nl: `https://easyconvertimage.com/nl/accessibility`,
      it: `https://easyconvertimage.com/it/accessibility`,
      id: `https://easyconvertimage.com/id/accessibility`,
      ru: `https://easyconvertimage.com/ru/accessibility`,
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
  })({ data,  params, location, matches });
};

export default function Accessibility() {
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
            {t("accessibility.title")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                { icon: "FaHome", label: t("home"), href: `/${i18n.language ?? ''}` },
                { label: t("accessibility.breadcrumb") },
              ]}
            />
          </GridContainer>
        </Hero>
        <div className="u-pt6 u-mb6">
          <ContentContainer>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("accessibility.statementTitle")}
            </Heading>
            <Text>{t("accessibility.lastUpdated")}</Text>
            <Text>{t("accessibility.commitment")}</Text>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("accessibility.conformanceStatus.title")}
            </Heading>
            <Text>{t("accessibility.conformanceStatus.description")}</Text>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("accessibility.feedback.title")}
            </Heading>
            <Text>{t("accessibility.feedback.description")}</Text>
            <Heading level={2} appearance={5}>
              {t("accessibility.technicalSpecs.title")}
            </Heading>
            <Text>{t("accessibility.technicalSpecs.description")}</Text>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("accessibility.assessmentApproach.title")}
            </Heading>
            <Text>{t("accessibility.assessmentApproach.description")}</Text>
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
