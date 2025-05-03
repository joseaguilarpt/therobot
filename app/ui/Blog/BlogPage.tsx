import "./BlogPage.scss";
import ContentContainer from "../ContentContainer/ContentContainer";
import Breadcrumb from "../Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";
import Heading from "../Heading/Heading";
import GridContainer from "../Grid/Grid";
import Text from "../Text/Text";
import ScrollProgressBar from "./ScrollProgressBar/ScrollProgressBar";
import Editor from "./Editor/Editor";
import ShareSocial from "./ShareBlog/ShareBlog";
import TableOfContents from "./TableOfContent/TableOfContent";
import EditorCard from "./EditorCard/EditorCard";
import GridItem from "../Grid/GridItem";
import Card from "../Card/Card";
import { useLocation } from "@remix-run/react";
import Button from "../Button/Button";
import { ArticleType, blogArticlesArray } from "~/constants/blog/data";

export default function BlogPage({
  data,
  blogId,
}: {
  data: ArticleType;
  blogId: string;
}) {
  const { t, i18n } = useTranslation(blogId);
  const { t: tOther } = useTranslation("common");

  const location = useLocation();
  const currentURL = `https://easyconvertimage.com${location.pathname}${location.search}${location.hash}`;

  const articleKeys = data.article;

  const tableOfContentData = Object.values(articleKeys.content).map((item) => ({
    level: 1,
    id: t(item.id),
    text: t(item.title),
  }));

  return (
    <div
      className="blog-page-container"
      role="main"
      aria-labelledby="blog-title"
      lang={i18n.language}
    >
      <a href="#blog-content" className="visually-hidden">
        Skip to main content
      </a>
      <ScrollProgressBar />
      <ContentContainer>
        <GridContainer justifyContent="flex-start" className="u-pb3">
          <Breadcrumb
            paths={[
              {
                icon: "FaHome",
                label: tOther("nav.home"),
                href: `/${i18n.language ?? ""}`,
              },
              {
                label: tOther("nav.blog"),
                href: `/${i18n.language ?? ""}/blog`,
              },
              { label: t(articleKeys.heading) },
            ]}
          />
        </GridContainer>
        <div>
          <div className="blog-pill">
            <Text
              transform="uppercase"
              size="small"
              textWeight="bold"
              color="contrast"
            >
              {t(articleKeys.category)}
            </Text>
          </div>
        </div>
        <Heading
          level={1}
          appearance={4}
          underline
          className="u-mb5"
          id="blog-title"
        >
          {t(articleKeys.heading)}
        </Heading>
        <Editor
          data={{
            editor: t(articleKeys.editor),
            date: t(articleKeys.date),
            readTime: t(articleKeys.readTime),
          }}
        />
        <div className="u-pt3">
          <Text textWeight="bold" size="small" className="u-pr2 u-pb1">
            {tOther("blog.share")}:
          </Text>
          <ShareSocial
            url={currentURL}
            title={tOther("blog.share")}
            description={t(articleKeys.resume)}
            aria-label={tOther("blog.shareAriaLabel")}
          />
        </div>
      </ContentContainer>
      <div id="blog-content">
        <ContentContainer>
          <div className="blog-header__image">
            <img
              src={t(articleKeys.image.url)}
              alt={t(articleKeys.image.alt)}
              loading="lazy"
            />
          </div>
          <nav aria-labelledby="toc-heading" className="u-pt4">
            <h2 id="toc-heading" className="visually-hidden">
              Table of Contents
            </h2>
            <TableOfContents items={tableOfContentData} />
          </nav>
        </ContentContainer>
        <ContentContainer className="blog-content">
          {articleKeys.content.map((item) => (
            <div key={t(item.id)}>
              <Heading
                underline
                id={t(item.id)}
                className="u-pb1 u-pt2"
                level={2}
                appearance={5}
              >
                {t(item.title)}
              </Heading>
              {item.img && (
                <div className="u-pt2 u-pb2 content-image">
                  <img
                    src={t(item.img)}
                    alt={t(item.altText)}
                    width="100%"
                    height="auto"
                    loading="lazy"
                  />
                </div>
              )}
              {item.paragraphs?.map((p: string, index: number) => (
                <Text key={index} className="u-pt2">
                  {t(p)}
                </Text>
              ))}
              {item.pros && (
                <div className="u-pt2">
                  <Text size="large" textWeight="bold">
                    {t(articleKeys.prosTitle)}
                  </Text>
                  <ul>
                    {item.pros?.map((pro: string, index: number) => (
                      <li key={`${pro}-${index}`}>
                        <Text>{t(pro)}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.cons && (
                <div className="u-pt2">
                  <Text size="large" textWeight="bold">
                    {t(articleKeys.consTitle)}
                  </Text>
                  <ul>
                    {item.cons?.map((con: string, index: number) => (
                      <li key={`${con}-${index}`}>
                        <Text>{t(con)}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.quote && (
                <GridContainer
                  justifyContent="center"
                  className="u-pt5 u-pb5 blog-quote"
                >
                  <GridItem xs={11} md={8}>
                    <Heading italic align="center" level={3} appearance={6}>
                      {t(item.quote)}
                    </Heading>
                  </GridItem>
                </GridContainer>
              )}
            </div>
          ))}
          <div className="u-pt5 u-pb4">
            <Text className="u-pb2" textWeight="bold" transform="uppercase">
              {tOther("hero.header1")} {tOther("hero.header2")}{" "}
              {tOther("hero.freeToUse")}{" "}
            </Text>
            <Button
              target="_blank"
              size="large"
              href="https://easyconvertimage.com"
              rel="noopener noreferrer"
            >
              {tOther("goNow")} Easy Convert Image
            </Button>
          </div>
        </ContentContainer>
        <ContentContainer>
          <EditorCard
            name={t(articleKeys.editor)}
            role={t("editor")}
            bio="link"
            imageUrl="/app/img/profile.jpg"
          />
        </ContentContainer>
        <ContentContainer>
          <Heading
            underline
            id="related"
            className="u-pb1"
            level={2}
            appearance={5}
          >
            {tOther("blog.relatedPosts")}
          </Heading>
          <div className="u-pt2">
            <GridContainer>
              {blogArticlesArray.map((item, index) => (
                <GridItem
                  animation="slide-in-bottom"
                  xs={12}
                  md={6}
                  lg={4}
                  key={index}
                  className="u-mt1 u-mb1"
                >
                  <Card
                    imagePosition="top"
                    title={tOther(item.heading)}
                    imageUrl={item.img}
                    id={index}
                    url={`/blog/${tOther(item.url)}`}
                    icon={undefined}
                  />
                </GridItem>
              ))}
            </GridContainer>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}
