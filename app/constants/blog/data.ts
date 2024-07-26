

export const blogArticlesArray = [
  {
    img: '/img/blog/man-choosing.webp',
    heading: "articles.0.heading",
    url: "png-vs-webp-conversion-guide",
  },
  {
    img: '/img/blog/folders.webp',
    heading: "articles.1.heading",
    url: "top-10-image-formats-for-website",
  },
  {
    img: '/img/blog/balance-savings.webp',
    heading: "articles.2.heading",
    url: "top-5-free-resources-designers-2024",
  }
];

const urls = blogArticlesArray.map((item) => item.url)

export default urls;

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