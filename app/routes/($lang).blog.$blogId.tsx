import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { FOOTER } from "~/constants/content";
import i18next from "~/i18next.server";
import BackToTop from "~/ui/BackToTop/BackToTop";
import BlogPage from "~/ui/Blog/BlogPage";
import Footer from "~/ui/Footer/Footer";
import Navbar from "~/ui/Navbar/Navbar";
import { MetaProps, createMeta } from "~/utils/meta";
import { ArticleType } from "../constants/blog/data";
import { useLoaderData, useParams } from "@remix-run/react";
import { data as template } from "~/constants/blog/template";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const blogData: ArticleType = template;
  const t = await i18next.getFixedT(request, params.blogId);
  const ogTitle = `${t(blogData?.article?.heading)} | Easy Convert Image`;
  const keywords = (blogData?.article?.content ?? [])
    .map((item) => t(item.title))
    ?.join(", ");
  const ogDescription = t(blogData?.article.resume);
  const description = t(blogData?.article.resume);
  const title = `${t(blogData?.article?.heading)} | Easy Convert Image`;
  return json({
    title,
    description,
    keywords,
    ogDescription,
    ogTitle,
    blogData,
    path: params?.blogId,
    datePublished: blogData?.article?.date || new Date().toISOString(),
    dateModified: blogData?.article?.date || new Date().toISOString(),
  });
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
  const {
    description,
    title,
    keywords,
    ogDescription,
    ogTitle,
    path,
    datePublished,
    dateModified,
  } = data as MetaProps;

  const lang = params.lang || 'en';
  const fullUrl = `https://easyconvertimage.com${lang === 'en' ? '' : '/' + lang}/blog/${path}`;

  const alternateLanguages = {
    "x-default": `https://easyconvertimage.com/blog/${path}`,
    en: `https://easyconvertimage.com/blog/${path}`,
    es: `https://easyconvertimage.com/es/blog/${path}`,
    fr: `https://easyconvertimage.com/fr/blog/${path}`,
    de: `https://easyconvertimage.com/de/blog/${path}`,
    pt: `https://easyconvertimage.com/pt/blog/${path}`,
    nl: `https://easyconvertimage.com/nl/blog/${path}`,
    it: `https://easyconvertimage.com/it/blog/${path}`,
    id: `https://easyconvertimage.com/id/blog/${path}`,
    ru: `https://easyconvertimage.com/ru/blog/${path}`,
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
      datePublished: datePublished,
      dateModified: dateModified,
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
  const { blogId } = useParams();
  const { blogData } = useLoaderData() as { blogData: ArticleType };
  return (
    <>
      <Navbar autoScrolled />
      <main className='blog-page__container' id="main-content">
        {blogData && <BlogPage blogId={blogId ?? ""} data={blogData} />}
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
