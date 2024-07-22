export const FINANCE = "finance";
export const ORGANIZATION = "organization";
export const DECISION_MAKING = "decision making";
export const DESIGN = "design";
export const APPROVAL = "approval";
export const RANKING = "ranking";

export const BLOG_IMAGES = [
  {
    name: "balance.webp",
    category: FINANCE,
    alt: "Balance scale representing financial equilibrium",
  },
  {
    name: "balance-savings.webp",
    category: FINANCE,
    alt: "Piggy bank on a balance scale showing savings concept",
  },
  {
    name: "folders.webp",
    category: ORGANIZATION,
    alt: "Colorful file folders for organizing documents",
  },
  {
    name: "girl-yes-or-no.webp",
    category: DECISION_MAKING,
    alt: "Young girl contemplating a yes or no decision",
  },
  {
    name: "graphics.webp",
    category: DESIGN,
    alt: "Abstract geometric shapes representing graphic design elements",
  },
  {
    name: "man-choosing.webp",
    category: DECISION_MAKING,
    alt: "Man selecting between multiple options or paths",
  },
  {
    name: "profit.webp",
    category: FINANCE,
    alt: "Upward trending graph or arrow indicating profit growth",
  },
  {
    name: "savings.webp",
    category: FINANCE,
    alt: "Piggy bank or coin jar representing savings",
  },
  {
    name: "thumbsup.webp",
    category: APPROVAL,
    alt: "Hand giving a thumbs up gesture of approval",
  },
  {
    name: "top-ten.webp",
    category: RANKING,
    alt: "List or podium showing top ten ranking",
  },
];

export const article = {
  heading: "Top 10 Image Formats for Your Website: A Comprehensive Guide",
  url: "top-10-image-formats-for-website",
  category: DECISION_MAKING,
  editor: "Manuel Gomez",
  date: "21/08/2024",
  readTime: 8,
  resume:
    "Choosing the right image format is crucial for website performance and user experience. This guide explores the top 10 image formats, including JPEG, PNG, WebP, and newer options like AVIF. Learn about their pros and cons to make informed decisions for your web projects and optimize your site's visual content effectively.",
  content: [
    {
      title: "Introduction",
      paragraphs: [
        "In the digital age, choosing the right image format for your website is crucial. It can significantly impact your site's performance, user experience, and even search engine rankings. This comprehensive guide will walk you through the top 10 image formats, helping you make informed decisions for your web projects.",
        "From the ubiquitous JPEG to the cutting-edge WebP, we'll explore the strengths and weaknesses of each format, ensuring you have the knowledge to optimize your website's visual content effectively.",
      ],
    },
    {
      title: "1. JPEG (Joint Photographic Experts Group)",
      img: 'jpg.png',
      paragraphs: [
        "JPEG is one of the most common image formats on the web. It's ideal for photographs and complex images with many colors.",
        "Pros: Small file size, wide compatibility.",
        "Cons: Lossy compression, not suitable for images with text or sharp edges.",
      ],
    },
    {
      title: "2. PNG (Portable Network Graphics)",
      paragraphs: [
        "PNG is excellent for images that require transparency or have sharp edges.",
        "Pros: Lossless compression, supports transparency.",
        "Cons: Larger file size compared to JPEG for photographs.",
      ],
    },
    {
      title: "3. WebP",
      img: 'webp.png',
      paragraphs: [
        "WebP is a modern image format developed by Google, offering superior compression and quality.",
        "Pros: Smaller file sizes than JPEG and PNG, supports both lossy and lossless compression.",
        "Cons: Not supported by all browsers, especially older versions.",
      ],
    },
    {
      title: "4. SVG (Scalable Vector Graphics)",
      img: 'svg.png',
      paragraphs: [
        "SVG is perfect for logos, icons, and simple illustrations that need to scale to different sizes.",
        "Pros: Scalable without loss of quality, small file size for simple graphics.",
        "Cons: Not suitable for complex photographs, can be slower to render if very complex.",
      ],
    },
    {
      title: "5. GIF (Graphics Interchange Format)",
      img: 'gif.png',
      paragraphs: [
        "GIF is known for its ability to display simple animations.",
        "Pros: Supports animation, widely compatible.",
        "Cons: Limited to 256 colors, generally larger file sizes than modern alternatives.",
      ],
    },
    {
      title: "Balancing Performance and Quality",
      paragraphs: [
        "Choosing the right image format is a balancing act between file size and quality. While formats like JPEG and WebP offer excellent compression, they might not always be the best choice for every situation.",
        "Consider your audience, the type of image, and your website's performance requirements when making your decision.",
      ],
      quote:
        "The right image format can make the difference between a fast, engaging website and a slow, frustrating user experience.",
    },
    {
      title: "6. AVIF (AV1 Image File Format)",
      img: 'avif.png',
      paragraphs: [
        "AVIF is a newcomer with impressive compression capabilities.",
        "Pros: Excellent compression, high quality at low file sizes.",
        "Cons: Limited browser support, can be slow to encode.",
      ],
    },
    {
      title: "7. HEIF (High Efficiency Image Format)",
      img: 'jpg.png',
      paragraphs: [
        "HEIF offers better compression than JPEG while maintaining higher quality.",
        "Pros: Smaller file sizes than JPEG at similar quality.",
        "Cons: Limited support, mainly used in Apple ecosystems.",
      ],
    },
    {
      title: "8. BMP (Bitmap Image File)",
      img: 'bmp.png',
      paragraphs: [
        "BMP files are uncompressed, resulting in high quality but large file sizes.",
        "Pros: Lossless quality, simple format.",
        "Cons: Very large file sizes, not suitable for web use in most cases.",
      ],
    },
    {
      title: "9. TIFF (Tagged Image File Format)",
      img: 'tiff.png',
      paragraphs: [
        "TIFF is used for high-quality images in print and professional photography.",
        "Pros: High quality, supports layers and multiple pages.",
        "Cons: Large file sizes, not suitable for web use.",
      ],
    },
    {
      title: "10. WebP 2",
      img: 'webp.png',
      paragraphs: [
        "WebP 2 is the next generation of WebP, promising even better compression and quality.",
        "Pros: Improved compression over WebP, potential future standard.",
        "Cons: Still in development, not yet widely supported.",
      ],
    },
    {
      title: "Conclusion",
      paragraphs: [
        "Selecting the right image format for your website involves considering factors like image type, desired quality, file size, and browser compatibility. While formats like JPEG and PNG remain popular, newer options like WebP offer exciting possibilities for optimizing your site's performance.",
        "Remember, the best choice often depends on your specific needs. Don't hesitate to experiment with different formats to find the perfect balance between quality and performance for your website.",
      ],
    },
  ],
  image: {
    url: "graphics.webp",
    category: DESIGN,
    alt: "Abstract geometric shapes representing various image file formats",
  },
};
