import "../ui/Blog/BlogPage.scss";

import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { blogArticlesArray } from "~/constants/blog/data";
import { FOOTER } from "~/constants/content";
import { FORMATS } from "~/constants/formats";
import i18next from "~/i18next.server";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Breadcrumb from "~/ui/Breadcrumbs/Breadcrumbs";
import Card from "~/ui/Card/Card";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Footer from "~/ui/Footer/Footer";
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import Heading from "~/ui/Heading/Heading";
import Navbar from "~/ui/Navbar/Navbar";
import Text from "~/ui/Text/Text";
import { MetaProps, createMeta } from "~/utils/meta";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const titleData = `${t("nav.blog")} ${t(
    "blog.latestPosts"
  )} | Easy Convert Image`;
  const keywords = `${t("tool.convertFrom")} ${FORMATS.map(
    (item) => item.label
  ).join(", ")}`;
  const ogTitle = titleData;
  const ogDescription = t("blog.latestPostsDescription");
  const description = t("blog.latestPostsDescription");
  const title = titleData;
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
  const path = 'blog';
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
      "@type": "BlogPosting",
      headline: title,
      description: description,
      image: "https://easyconvertimage.com/img/advanced-technology.jpg",
      url: fullUrl,
      author: {
        "@type": "Organization",
        name: "Easy Convert Image",
        url: "https://easyconvertimage.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Easy Convert Image",
        url: "https://easyconvertimage.com",
        logo: {
          "@type": "ImageObject",
          url: "https://easyconvertimage.com/img/thebot.svg",
        },
      },
      keywords: keywords,
    },
  })({ data, params, location, matches });
};

export default function Blog() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Navbar autoScrolled />
      <main id="main-content">
        <div className="blogs-page">
          <ContentContainer>
            <Breadcrumb
              paths={[
                {
                  icon: "home",
                  label: t("nav.home"),
                  href: `/${i18n.language ?? ""}`,
                },
                {
                  label: t("nav.blog"),
                },
              ]}
            />
            <Heading align="center" underline level={1} appearance={4}>
              {t("nav.blog")}
            </Heading>
            <div className="u-pt2 u-pb3">
              <Text align="center">{t("blog.latestPostsDescription")}</Text>
            </div>
            <GridContainer>
              {blogArticlesArray.map((item, index) => (
                <GridItem
                  xs={12}
                  md={6}
                  lg={4}
                  key={index}
                  className="u-mt1 u-mb1"
                >
                  <Card
                    imagePosition="top"
                    title={t(item.heading)}
                    imageUrl={item.img}
                    id={index}
                    url={`/blog/${t(item.url)}`}
                    icon={undefined}
                  />
                </GridItem>
              ))}
            </GridContainer>
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
