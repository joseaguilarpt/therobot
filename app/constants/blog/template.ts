interface Article {
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
  content: ArticleContent[];
  image: {
    url: string;
    category: string;
    alt: string;
  };
}

interface ArticleContent {
  id: string;
  title: string;
  img?: string;
  altText?: string;
  pros?: string[];
  cons?: string[];
  paragraphs: string[];
  quote?: string;
}

const generateArticleData = (): { article: Article } => {
  const article: Article = {
    id: "article.id",
    heading: "article.heading",
    url: "article.url",
    category: "article.category",
    editor: "article.editor",
    date: "article.date",
    readTime: "article.readTime",
    resume: "article.resume",
    prosTitle: "article.prosTitle",
    consTitle: "article.consTitle",
    content: [
      {
        id: "article.content.0.id",
        title: "article.content.0.title",
        paragraphs: Array(17).fill(0).map((_, i) => `article.content.0.paragraphs.${i}`),
      },
      ...Array(10).fill(0).map((_, index) => ({
        id: `article.content.${index + 1}.id`,
        title: `article.content.${index + 1}.title`,
        img: `article.content.${index + 1}.img`,
        altText: `article.content.${index + 1}.altText`,
        pros: Array(13).fill(0).map((_, i) => `article.content.${index + 1}.pros.${i}`),
        cons: Array(12).fill(0).map((_, i) => `article.content.${index + 1}.cons.${i}`),
        paragraphs: Array(17).fill(0).map((_, i) => `article.content.${index + 1}.paragraphs.${i}`),
      })),
      {
        id: "article.content.11.id",
        title: "article.content.11.title",
        paragraphs: Array(15).fill(0).map((_, i) => `article.content.11.paragraphs.${i}`),
      },
      {
        id: "article.content.12.id",
        title: "article.content.12.title",
        paragraphs: Array(17).fill(0).map((_, i) => `article.content.12.paragraphs.${i}`),
        quote: "article.content.12.quote",
      },
    ],
    image: {
      url: "article.image.url",
      category: "article.image.category",
      alt: "article.image.alt",
    },
  };

  return { article };
};

export const data = generateArticleData()