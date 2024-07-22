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
  const title = t("termsOfService.meta.title");
  const description = t("termsOfService.meta.description");
  const keywords = t("termsOfService.meta.keywords");
  const ogTitle = t("termsOfService.meta.ogTitle");
  const ogDescription = t("termsOfService.meta.ogDescription");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction<typeof loader> = ({
  data,
  params,
  location,
  matches,
}) => {
  if (!data) {
    return [];
  }
  const { description, title } = data as MetaProps;
  const url = `https://easyconvertimage.com/terms-of-service`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      en: "https://easyconvertimage.com/en/terms-of-service",
      es: `https://easyconvertimage.com/es/terms-of-service`,
      fr: `https://easyconvertimage.com/fr/terms-of-service`,
      de: `https://easyconvertimage.com/de/terms-of-service`,
      pt: `https://easyconvertimage.com/pt/terms-of-service`,
      nl: `https://easyconvertimage.com/nl/terms-of-service`,
      it: `https://easyconvertimage.com/it/terms-of-service`,
      id: `https://easyconvertimage.com/id/terms-of-service`,
      ru: `https://easyconvertimage.com/ru/terms-of-service`,
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
  })({ data, params, location, matches });
};

export default function Terms() {
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
            {t("termsOfService.heading")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                {
                  icon: "FaHome",
                  label: t("home"),
                  href: `/${i18n.language ?? ""}`,
                },
                { label: t("termsOfService.heading") },
              ]}
            />
          </GridContainer>
        </Hero>
        <div className="u-pt6 u-mb6">
          <ContentContainer>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("termsOfService.subheading")}
            </Heading>

            <Text>{t("termsOfService.lastUpdated")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              1. {t("termsOfService.sections.acceptance.title")}
            </Heading>

            <Text>{t("termsOfService.sections.acceptance.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              2. {t("termsOfService.sections.use.title")}
            </Heading>

            <Text>{t("termsOfService.sections.use.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              3. {t("termsOfService.sections.userContent.title")}
            </Heading>

            <Text>{t("termsOfService.sections.userContent.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              4. {t("termsOfService.sections.prohibited.title")}
            </Heading>

            <Text>{t("termsOfService.sections.prohibited.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              5. {t("termsOfService.sections.termination.title")}
            </Heading>

            <Text>{t("termsOfService.sections.termination.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              6. {t("termsOfService.sections.liability.title")}
            </Heading>

            <Text>{t("termsOfService.sections.liability.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              7. {t("termsOfService.sections.changes.title")}
            </Heading>

            <Text>{t("termsOfService.sections.changes.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              8. {t("termsOfService.sections.contact.title")}
            </Heading>

            <Text>{t("termsOfService.sections.contact.content")}</Text>
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
