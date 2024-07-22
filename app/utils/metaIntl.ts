import i18next from "~/i18next.server";

interface Params {
  sourceFormat?: string;
  targetFormat?: string;
}

export const getMetaIntl = async (params: Params, request: Request) => {
  const t = await i18next.getFixedT(request);
  const { sourceFormat, targetFormat } = params;
  const sourceFormatUpper = sourceFormat?.toUpperCase();
  const targetFormatUpper = targetFormat?.toUpperCase();
  const title = t("convertMeta.title", {
    sourceFormatUpper,
    targetFormatUpper,
  });

  const formatBenefits: Record<string, string> = {
    jpeg: "smaller file sizes",
    png: "lossless quality and transparency",
    gif: "animations and simple graphics",
    webp: "superior compression for web",
    avif: "next-gen compression and quality",
    tiff: "high-quality for print and editing",
    svg: "scalable vector graphics",
    bmp: "uncompressed bitmap images",
    pdf: "document and image compatibility",
  };

  const sourceBenefit = sourceFormat ? formatBenefits[sourceFormat] || "" : "";
  const targetBenefit = targetFormat ? formatBenefits[targetFormat] || "" : "";

  const description = t("convertMeta.description", {
    sourceFormatUpper,
    targetFormatUpper,
    sourceBenefit,
    targetBenefit,
  });

  // Fetch keyword data from i18n
  const baseKeywords = t("keywordGenerator.baseKeywords", {
    returnObjects: true,
  }) as string[];
  const formatSpecificKeywords = t("keywordGenerator.formatSpecificKeywords", {
    returnObjects: true,
  }) as Record<string, string[]>;
  const conversionKeywordTemplates = t(
    "keywordGenerator.conversionKeywordTemplates",
    { returnObjects: true }
  ) as string[];

  // Generate source and target specific keywords
  const sourceKeywords = sourceFormat ? formatSpecificKeywords[sourceFormat] || [] : [];
  const targetKeywords = targetFormat ? formatSpecificKeywords[targetFormat] || [] : [];

  // Generate conversion keywords
  const conversionKeywords = conversionKeywordTemplates.map((template) =>
    template
      .replace("{sourceFormat}", sourceFormat || "")
      .replace("{targetFormat}", targetFormat || "")
  );

  // Combine all keywords
  const allKeywords = [
    ...baseKeywords,
    ...sourceKeywords,
    ...targetKeywords,
    ...conversionKeywords,
  ];

  const uniqueKeywords = Array.from(new Set(allKeywords)); // Remove duplicates
  const keywordsString = uniqueKeywords.join(", ");

  return {
    title,
    keywords: keywordsString,
    description,
    sourceFormatUpper,
    targetFormatUpper,
    ogDescription: description,
    ogTitle: title,
  };
};
