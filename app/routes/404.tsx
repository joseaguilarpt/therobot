// In app/routes/convert.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Footer from "~/ui/Footer/Footer";
import { FOOTER } from "~/constants/content";
import Navbar from "~/ui/Navbar/Navbar";
import ToolContainer from "~/ui/ToolContainer/ToolContainer";
import Heading from "~/ui/Heading/Heading";
import type { MetaFunction } from "@remix-run/node";
import { createMeta } from "~/utils/meta";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import GridContainer from "~/ui/Grid/Grid";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Icon from "~/ui/Icon/Icon";
import Button from "~/ui/Button/Button";

export let handle = { i18n: "common" };

export async function loader({ request }: LoaderFunctionArgs) {
  let t = await i18next.getFixedT(request);
  let keywords = t("homeMeta.keywords");
  let ogTitle = t("homeMeta.ogTitle");
  let ogDescription = t("homeMeta.ogDescription");
  let description = t("homeMeta.description");
  let title = t("homeMeta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = createMeta({
  ogImage: "https://easyconvertimage.com/img/advanced-technology.jpg",
  twitterCard: "summary_large_image",
  canonicalUrl: "https://easyconvertimage.com",
  alternateLanguages: {
    es: "https://easyconvertimage.com/es",
    fr: "https://easyconvertimage.com/fr",
    de: "https://easyconvertimage.com/de",
    en: "https://easyconvertimage.com/en",
    pt: "https://easyconvertimage.com/pt",
    nl: "https://easyconvertimage.com/nl",
    it: "https://easyconvertimage.com/it",
    id: "https://easyconvertimage.com/id",
    no: "https://easyconvertimage.com/no",
    pl: "https://easyconvertimage.com/pl",
    tr: "https://easyconvertimage.com/tr",
    ru: "https://easyconvertimage.com/ru",
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Easy Convert Image",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
    },
  },
});

export default function NotFound() {
  let { t, i18n } = useTranslation("common");
  let footerData = { ...FOOTER };

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
      <Navbar autoScrolled />
      <main id="main-content">
        <ContentContainer>
          <div style={{ height: "calc(100vh - 100px)" }}>
            <GridContainer
              className="max-height"
              justifyContent="center"
              alignItems="center"
              direction="column"
            >
              <Icon color="secondary" size="xlarge" icon="FaSadTear" />

              <Heading level={1} underline align="center" appearance={1}>
                404: {t("notFound.title")}
              </Heading>
              <Heading level={1} align="center" appearance={5}>
                {t("notFound.message")}
              </Heading>
              <div className="u-mt3">
                <Button
                  onClick={() =>
                    (window.location.href = `/${i18n.language ?? ""}`)
                  }
                  size="large"
                >
                  {t("nav.home")}
                </Button>
              </div>
            </GridContainer>
          </div>
        </ContentContainer>
      </main>
      <BackToTop />
    </>
  );
}
