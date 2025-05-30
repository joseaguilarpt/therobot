import { LoaderFunctionArgs , json } from "@remix-run/node";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Navbar from "~/ui/Navbar/Navbar";
import Heading from "~/ui/Heading/Heading";
import type { MetaFunction } from "@remix-run/node";
import { createMeta } from "~/utils/meta";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import GridContainer from "~/ui/Grid/Grid";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Icon from "~/ui/Icon/Icon";
import Button from "~/ui/Button/Button";

export const handle = { i18n: "common" };

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const keywords = t("homeMeta.keywords");
  const ogTitle = t("homeMeta.ogTitle");
  const ogDescription = t("homeMeta.ogDescription");
  const description = t("homeMeta.description");
  const title = t("homeMeta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = createMeta({
  ogImage: "https://easyconvertimage.com/img/advanced-technology.jpg",
  twitterCard: "summary_large_image",
  canonicalUrl: "https://easyconvertimage.com/404",
  alternateLanguages: {
    es: "https://easyconvertimage.com/es/404",
    fr: "https://easyconvertimage.com/fr/404",
    de: "https://easyconvertimage.com/de/404",
    en: "https://easyconvertimage.com/en/404",
    pt: "https://easyconvertimage.com/pt/404",
    nl: "https://easyconvertimage.com/nl/404",
    it: "https://easyconvertimage.com/it/404",
    id: "https://easyconvertimage.com/id/404",
    no: "https://easyconvertimage.com/no/404",
    pl: "https://easyconvertimage.com/pl/404",
    tr: "https://easyconvertimage.com/tr/404",
    ru: "https://easyconvertimage.com/ru/404",
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
  const { t, i18n } = useTranslation("common");


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
              <Icon color="secondary" size="xlarge" icon="sentiment_very_dissatisfied" />

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
