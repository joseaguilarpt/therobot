import React, { useState, useMemo } from "react";
import {
  useActionData,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import DragAndDrop from "../ui/DragDrop/DragDrop";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Footer from "~/ui/Footer/Footer";
import { FOOTER } from "~/constants/content";
import Navbar from "~/ui/Navbar/Navbar";
import {
  convertImagesToPdf,
  convertToOtherFormat,
  convertToSvg,
  parseFormData,
} from "~/utils/converter.server";
import ToolContainer from "~/ui/ToolContainer/ToolContainer";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Heading from "~/ui/Heading/Heading";
import { base64ToImage, downloadBlob } from "~/utils/convertUtils";
import Files from "~/ui/Files/Files";
import { useTheme } from "~/context/ThemeContext";
import { onSendEmail } from "~/utils/mail.server";
import Text from "~/ui/Text/Text";
import { allOptions, isValidFormat } from "~/constants/formats";
import CompanyServicesSection from "~/ui/AboutPage/CompanyServicesSection";
import FAQSection from "~/ui/AboutPage/FAQSection";
import { CONVERSIONS, POPULAR_CONVERSIONS } from "~/utils/conversions";
import { createMeta } from "~/utils/meta";
import { ConversionForm } from "~/ui/ConversionForm/ConversionForm";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import i18n from "~/i18n";
import { HCaptchaComponent } from "~/ui/Hcaptcha/Hcaptcha";

export const meta: MetaFunction = ({ data }) => {
  const { sourceFormat, targetFormat, description, title } = data as any;
  const url = `https://easyconvertimage.com/convert/${sourceFormat}/${targetFormat}`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      en: `https://easyconvertimage.com/en/convert/${sourceFormat}/${targetFormat}`,
      es: `https://easyconvertimage.com/es/convert/${sourceFormat}/${targetFormat}`,
      fr: `https://easyconvertimage.com/fr/convert/${sourceFormat}/${targetFormat}`,
      de: `https://easyconvertimage.com/de/convert/${sourceFormat}/${targetFormat}`,
      pt: `https://easyconvertimage.com/pt/convert/${sourceFormat}/${targetFormat}`,
      nl: `https://easyconvertimage.com/nl/convert/${sourceFormat}/${targetFormat}`,
      it: `https://easyconvertimage.com/it/convert/${sourceFormat}/${targetFormat}`,
      id: `https://easyconvertimage.com/id/convert/${sourceFormat}/${targetFormat}`,
      ru: `https://easyconvertimage.com/ru/convert/${sourceFormat}/${targetFormat}`,
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: url,
      description: description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Organization",
        name: "Easy Convert Image",
        url: "https://easyconvertimage.com",
      },
    },
    // @ts-ignore
  })({ data });
};

export let handle = { i18n: "common" };

const getMetaIntl = async (params: any, request: any) => {
  let t = await i18next.getFixedT(request);
  const { sourceFormat, targetFormat } = params;
  const sourceFormatUpper = sourceFormat?.toUpperCase();
  const targetFormatUpper = targetFormat?.toUpperCase();
  let title = t("convertMeta.title", {
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

  let description = t("convertMeta.description", {
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
  const conversionKeywords = conversionKeywordTemplates.map((template) =>
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { sourceFormat, targetFormat } = params;

  if (
    !isValidFormat(sourceFormat ?? "") ||
    !isValidFormat(targetFormat ?? "")
  ) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const data = await getMetaIntl(params, request);

  return json({
    ...data,
    sourceFormat,
    targetFormat,
  });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await parseFormData(request);
  const typeOperation = formData.get("type") as string;

  if (typeOperation === "email") {
    return await onSendEmail(formData);
  } else {
    const files = formData.getAll("file") as File[];
    const format = formData.get("format") as string | null;

    if (files.length === 0 || !format) {
      return json(
        { error: "Files and format are required", convertedFiles: null },
        { status: 400 }
      );
    }

    try {
      let convertedFiles: any[] = [];
      if (format === "svg") {
        convertedFiles = await convertToSvg(files, format);
      } else if (format === "pdf") {
        const pdfType = formData.get("pdfType");
        const imageFiles = Array.from(files);
        convertedFiles = await convertImagesToPdf(
          imageFiles,
          pdfType === "separated"
        );
      } else {
        convertedFiles = await convertToOtherFormat(files, format);
      }
      return json({ convertedFiles });
    } catch (error) {
      return json(
        { error: "Conversion failed", convertedFiles: null },
        { status: 500 }
      );
    }
  }
};

export default function IndexPage() {
  let { t, i18n } = useTranslation("common");
  const { sourceFormat, targetFormat } = useParams();
  const { showSnackbar } = useTheme();
  const data = useActionData<typeof action>();
  const initialFrom = allOptions.find(
    (item) => item.value === sourceFormat?.toLowerCase()
  );
  const initialTo = allOptions.find(
    (item) => item.value === targetFormat?.toLowerCase()
  );
  const [token, setToken] = useState<string | null>(null);

  const submit = useSubmit();
  const [selectedFormat] = useState(initialTo?.label ?? "PNG");
  const [selectedFormatFrom] = useState(initialFrom?.label ?? "JPEG");
  const [pdfType, setPdfType] = useState("separated");
  const [convertedFiles, setConvertedFiles] = useState<any[]>([]);

  const handleError = (errorMessage: string) => {
    showSnackbar(errorMessage, "error");
  };

  React.useEffect(() => {
    if (data?.error) {
      showSnackbar(data?.error, "error");
      if (convertedFiles) {
        const files = convertedFiles.map((item) => {
          if (item.status === "processing") {
            return {
              ...item,
              status: "error",
            };
          } else {
            return item;
          }
        });
        setConvertedFiles(files);
      }
    }
  }, [data?.error]);

  React.useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(t("ui.emailSuccess"), "success");
    }
  }, [data?.emailSent]);

  React.useEffect(() => {
    if (data?.convertedFiles) {
      const files = data.convertedFiles.map((item: any) => ({
        ...item,
        fileUrl: base64ToImage(item.fileUrl),
        status: "completed",
      }));
      setTimeout(() => {
        const data = convertedFiles.filter(
          (item) => item.status !== "processing"
        );
        showSnackbar(t("ui.conversionSuccess"), "success");
        setConvertedFiles([...data, ...files]);
      }, 1500);
    }
  }, [data?.convertedFiles]);

  React.useEffect(() => {
    if (selectedFormat !== "PDF" && pdfType !== "separated") {
      setPdfType("separated");
    }
  }, [selectedFormat]);

  const handleAllAction = (files: File[]) => {
    if (!token) {
      console.log("Please complete the CAPTCHA");
      return;
    }
    const parsed = files.map((item) => ({
      status: "processing",
      fileName: item.name,
      fileSize: item.size,
    }));
    setConvertedFiles([...convertedFiles, ...parsed]);
    const formData = new FormData();
    formData.append("format", selectedFormat?.toLowerCase());
    files.forEach((file) => formData.append("file", file));
    if (selectedFormat === "PDF") {
      formData.append("pdfType", pdfType);
    }
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const handleDownload = (v: any) => {
    downloadBlob(v.fileUrl, v.fileName);
    showSnackbar(t("ui.downloadSuccess"), "success");
  };

  const handleRemove = (v: number) => {
    const filtered = convertedFiles.filter((value, i) => i !== v);
    setConvertedFiles(filtered);
    showSnackbar(t("ui.fileRemoveSuccess"), "info");
  };
  const handleRemoveAll = () => {
    showSnackbar(t("ui.filesRemoveSuccess"), "info");
    setConvertedFiles([]);
  };

  const handleEmailShare = (v: any, email: string) => {
    const formData = new FormData();
    formData.append("type", "email");
    formData.append("email", email);
    formData.append("zipFile", v);
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (data?.contactError) {
      showSnackbar(t("ui.emailError"), "error");
      setIsPending(false);
    }
  }, [data?.contactError]);

  React.useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(t("ui.emailSuccess"), "success");
      setIsPending(false);
    }
  }, [data?.emailSent]);

  const handleFromChange = (v: string) => {
    const fromValue = v?.toLowerCase() ?? "png";
    const toValue = selectedFormat?.toLowerCase() ?? "jpeg";
    window.location.href = `/${i18n.language}/convert/${fromValue}/${toValue}`;
  };

  const handleToChange = (v: string) => {
    const fromValue = selectedFormat?.toLowerCase() ?? "png";
    const toValue = v?.toLowerCase() ?? "jpeg";
    window.location.href = `/${i18n.language}/convert/${fromValue}/${toValue}`;
  };

  let footerData = { ...FOOTER };

  footerData.sections = [
    ...footerData.sections,
    {
      title: t("footer.otherTools.heading"),
      links: POPULAR_CONVERSIONS?.slice(0, 7)?.map((item) => ({
        name: t("services.itemTitle", {
          sourceFormat: item.from,
          targetFormat: item.to,
        }),
        url: item.href,
      })),
    },
  ];

  const conversionOptions = useMemo(
    () =>
      CONVERSIONS.filter(
        (item) =>
          item?.from?.toLowerCase() === selectedFormatFrom?.toLowerCase()
      ),
    [selectedFormatFrom]
  );
  return (
    <>
      <Navbar autoScrolled />
      <main id="main-content">
        <ToolContainer>
          <ContentContainer>
            <section
              className="tool-heading"
              aria-labelledby="conversion-heading"
            >
              <Heading
                id="conversion-heading"
                align="center"
                color="accent"
                appearance={4}
                level={1}
              >
                {t("hero.header1")}
              </Heading>
              <Heading align="center" underline appearance={4} level={2}>
                {t("hero.header2")}
              </Heading>
              <Text className="u-pt5" align="center">
                {t("hero.description")}
              </Text>
              <Text className="u-pt2" align="center">
                {t("hero.freeToUse")}
              </Text>
              <form>
                <HCaptchaComponent
                  sitekey="YOUR_HCAPTCHA_SITE_KEY"
                  onVerify={setToken}
                />

                <ConversionForm
                  options={allOptions}
                  selectedFormat={selectedFormat}
                  selectedFormatFrom={selectedFormatFrom}
                  pdfType={pdfType}
                  setPdfType={setPdfType}
                  handleFromChange={handleFromChange}
                  handleToChange={handleToChange}
                />
                <DragAndDrop
                  onFilesDrop={handleAllAction}
                  onError={handleError}
                  acceptedTypes={[`image/${selectedFormatFrom?.toLowerCase()}`]}
                  maxSize={10_000_000} // 10 MB
                  files={convertedFiles}
                />
              </form>
            </section>
            <Files
              onEmailShare={handleEmailShare}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              files={convertedFiles}
              onDownload={handleDownload}
            />
          </ContentContainer>
          <div id="top-tools">
            <CompanyServicesSection
              list={conversionOptions}
              heading={t("services.otherConversions", {
                conversion: selectedFormatFrom,
              })}
            />
            <FAQSection />
          </div>
        </ToolContainer>
      </main>
      <BackToTop />
      <Footer
        {...footerData}
        backgroundImageUrl={""}
        socialNetworks={[
          { label: "Facebook", icon: "FaFacebook", href: "#" },
          { label: "Twitter", icon: "FaTwitter", href: "#" },
        ]}
      />
    </>
  );
}
