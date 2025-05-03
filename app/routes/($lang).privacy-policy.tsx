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
  const keywords = t("privacyPolicy.meta.keywords");
  const ogTitle = t("privacyPolicy.meta.ogTitle");
  const ogDescription = t("privacyPolicy.meta.ogDescription");
  const description = t("privacyPolicy.meta.description");
  const title = t("privacyPolicy.meta.title");
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
  const { description, title, keywords, ogDescription, ogTitle } =
    data as MetaProps;
  const lang = params.lang || "en";
  const path = "privacy-policy";
  const fullUrl = `https://easyconvertimage.com${
    lang === "en" ? "" : "/" + lang
  }/${path}`;

  const alternateLanguages = {
    "x-default": `https://easyconvertimage.com/${path}`,
    en: `https://easyconvertimage.com/${path}`,
    es: `https://easyconvertimage.com/es/${path}`,
    fr: `https://easyconvertimage.com/fr/${path}`,
    de: `https://easyconvertimage.com/de/${path}`,
    pt: `https://easyconvertimage.com/pt/${path}`,
    nl: `https://easyconvertimage.com/nl/${path}`,
    it: `https://easyconvertimage.com/it/${path}`,
    id: `https://easyconvertimage.com/id/${path}`,
    ru: `https://easyconvertimage.com/ru/${path}`,
  };

  return createMeta({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage: "https://easyconvertimage.com/img/advanced-technology.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: fullUrl,
    alternateLanguages,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: fullUrl,
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
                {
                  icon: "home",
                  label: t("home"),
                  href: `/${i18n.language ?? ""}`,
                },
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
            <Text>{t("privacyPolicy.content.introduction")}</Text>

            {t("privacyPolicy.content.sections", { returnObjects: true }).map((section, index) => (
              <div key={index}>
                <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
                  {index + 1}. {section.title}
                </Heading>
                <Text>{section.content}</Text>
              </div>
            ))}

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("privacyPolicy.dataSharing.title")}
            </Heading>
            <Text>{t("privacyPolicy.dataSharing.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("privacyPolicy.contactUs.title")}
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
          { label: "Facebook", icon: "facebook", href: "#" },
          { label: "Twitter", icon: "X", href: "#" },
        ]}
      />
    </>
  );
}