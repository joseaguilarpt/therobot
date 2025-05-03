import i18next from "~/i18next.server";

export const getMetaIntl = async (params: any, request: any) => {
    const t = await i18next.getFixedT(request);
    const { sourceFormat, targetFormat } = params;
    const sourceFormatUpper = sourceFormat?.toUpperCase();
    const targetFormatUpper = targetFormat?.toUpperCase();
    const title = t("convertMeta.title", {
      sourceFormatUpper,
      targetFormatUpper,
    });
  
    const formatBenefits = {
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
  
    const sourceBenefit =
      formatBenefits[sourceFormat as keyof typeof formatBenefits] || "";
    const targetBenefit =
      formatBenefits[targetFormat as keyof typeof formatBenefits] || "";
  
    const description = t("convertMeta.description", {
      sourceFormatUpper,
      targetFormatUpper,
      sourceBenefit,
      targetBenefit,
    });
  
    // Fetch keyword data from i18n
    const baseKeywords = t("keywordGenerator.baseKeywords", {
      returnObjects: true,
    });
    const formatSpecificKeywords = t("keywordGenerator.formatSpecificKeywords", {
      returnObjects: true,
    });
    const conversionKeywordTemplates = t(
      "keywordGenerator.conversionKeywordTemplates",
      { returnObjects: true }
    );
  
    // Generate source and target specific keywords
    const sourceKeywords = formatSpecificKeywords[sourceFormat] || [];
    const targetKeywords = formatSpecificKeywords[targetFormat] || [];
  
    // Generate conversion keywords
    const conversionKeywords = conversionKeywordTemplates?.map((template) =>
      template
        .replace("{sourceFormat}", sourceFormat)
        .replace("{targetFormat}", targetFormat)
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
  