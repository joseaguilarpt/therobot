import { data as pngVsWebpConversionGuide } from "./png-vs-webp-conversion-guide";
import { data as top10ImageFormatsForWebsite } from "./top-10-image-formats-for-website";

export default {
  "png-vs-webp-conversion-guide": pngVsWebpConversionGuide,
  "top-10-image-formats-for-website": top10ImageFormatsForWebsite,
};

export const blogArticlesArray = [
  {
    img: '/app/img/blog/man-choosing.webp',
    heading: "articles.0.heading",
    url: "articles.0.url",
  },
  {
    img: '/app/img/blog/folders.webp',
    heading: "articles.1.heading",
    url: "articles.1.url",
  }
];

type ContentItem = {
  id: string;
  title: string;
  paragraphs: string[];
  img?: string;
  altText?: string;
  pros?: string[];
  cons?: string[];
};

type ArticleImage = {
  url: string;
  category: string;
  alt: string;
};

type Article = {
  id: string;
  heading: string;
  url: string;
  category: string;
  editor: string;
  date: string;
  readTime: string;
  resume: string;
  prosTitle: string;
  consTitle: string;
  content: ContentItem[];
  image: ArticleImage;
};

export type ArticleType = {
  article: Article;
};