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
  const title = t("cookiePolicy.meta.title");
  const description = t("cookiePolicy.meta.description");
  const keywords = t("cookiePolicy.meta.keywords");
  const ogTitle = t("cookiePolicy.meta.ogTitle");
  const ogDescription = t("cookiePolicy.meta.ogDescription");
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
  const { description, title, keywords, ogDescription, ogTitle } = data as MetaProps;
  const lang = params.lang || 'en';
  const path = 'cookie-policy';
  const fullUrl = `https://easyconvertimage.com${lang === 'en' ? '' : '/' + lang}/${path}`;

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

export default function CookiesPolicy() {
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
            {t("cookiePolicy.heading")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                {
                  icon: "home",
                  label: t("home"),
                  href: `/${i18n.language ?? ""}`,
                },
                { label: t("cookiePolicy.heading") },
              ]}
            />
          </GridContainer>
        </Hero>
        <div className="u-pt6 u-mb6">
          <ContentContainer>
            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              {t("cookiePolicy.subheading")}
            </Heading>

            <Text>{t("cookiePolicy.lastUpdated")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              1. {t("cookiePolicy.sections.whatAre.title")}
            </Heading>

            <Text>{t("cookiePolicy.sections.whatAre.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              2. {t("cookiePolicy.sections.howWeUse.title")}
            </Heading>

            <Text>{t("cookiePolicy.sections.howWeUse.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              3. {t("cookiePolicy.sections.thirdParty.title")}
            </Heading>

            <Text>{t("cookiePolicy.sections.thirdParty.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              4. {t("cookiePolicy.sections.managing.title")}
            </Heading>

            <Text>{t("cookiePolicy.sections.managing.content")}</Text>

            <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
              5. {t("cookiePolicy.sections.contact.title")}
            </Heading>

            <Text>{t("cookiePolicy.sections.contact.content")}</Text>
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
