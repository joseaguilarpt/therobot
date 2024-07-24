import Navbar from "~/ui/Navbar/Navbar";
import Footer from "~/ui/Footer/Footer";
import BackToTop from "~/ui/BackToTop/BackToTop";
import CompanyGoalSection from "../ui/AboutPage/CompanyGoalSection";
import CompanyServicesSection from "../ui/AboutPage/CompanyServicesSection";
import { FOOTER } from "~/constants/content";
import Hero from "~/ui/Hero/Hero";
import Heading from "~/ui/Heading/Heading";
import GridContainer from "~/ui/Grid/Grid";
import Breadcrumb from "~/ui/Breadcrumbs/Breadcrumbs";
import { MetaProps, createMeta } from "~/utils/meta";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const keywords = t("about.meta.keywords");
  const ogTitle = t("about.meta.ogTitle");
  const ogDescription = t("about.meta.ogDescription");
  const description = t("about.meta.description");
  const title = t("about.meta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction<typeof loader> = ({ data, params, location, matches }) => {
  if (!data) {
    return [];
  }
  
  const { description, title, keywords, ogDescription, ogTitle } = data as MetaProps;
  const lang = params.lang || 'en';
  const path = 'about';
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

export default function AboutPage() {
  const { t, i18n } = useTranslation();

  const footerData = { ...FOOTER };

  footerData.sections = [
    ...footerData.sections,
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
  return (
    <>
      <div>
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
              {t("about.about")}
            </Heading>
            <GridContainer justifyContent="center" className="u-pt3">
              <Breadcrumb
                paths={[
                  { icon: "home", label: t("home"), href: `/${i18n.language ?? ''}` },
                  { label: t("about.about") },
                ]}
              />
            </GridContainer>
          </Hero>{" "}
          <CompanyGoalSection />
          <CompanyServicesSection />
        </main>
      </div>
      <BackToTop />
      <Footer
        {...footerData}
        backgroundImageUrl={""}
        socialNetworks={[
          { label: "Facebook", icon: "facebook", href: "#" },
          { label: "Twitter", icon: "X", href: "#" },
        ]}
      />
    </>
  );
}
