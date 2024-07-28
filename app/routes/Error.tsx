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
  canonicalUrl: "https://easyconvertimage.com",
  alternateLanguages: {
    es: "https://easyconvertimage.com/es/Error",
    fr: "https://easyconvertimage.com/fr/Error",
    de: "https://easyconvertimage.com/de/Error",
    en: "https://easyconvertimage.com/en/Error",
    pt: "https://easyconvertimage.com/pt/Error",
    nl: "https://easyconvertimage.com/nl/Error",
    it: "https://easyconvertimage.com/it/Error",
    id: "https://easyconvertimage.com/id/Error",
    no: "https://easyconvertimage.com/no/Error",
    pl: "https://easyconvertimage.com/pl/Error",
    tr: "https://easyconvertimage.com/tr/Error",
    ru: "https://easyconvertimage.com/ru/Error",
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

export default function ErrorPage() {
  const { t } = useTranslation("common");
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
                <Icon color="secondary" size="xlarge" icon='sentiment_very_dissatisfied' />
              <Heading level={1} underline align="center" appearance={1}>
               {t('errorBoundary.title')}
              </Heading>
              <Heading level={1} align="center" appearance={5}>
              {t('errorBoundary.message')}
              </Heading>
            </GridContainer>
          </div>
        </ContentContainer>
      </main>
      <BackToTop />
    </>
  );
}
