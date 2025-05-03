// In app/routes/convert.tsx
import React, { useState } from "react";
import { useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
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
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import { base64ToImage, downloadBlob } from "~/utils/convertUtils";
import Files from "~/ui/Files/Files";
import { useTheme } from "~/context/ThemeContext";
import { onSendCustomerEmail, onSendEmail } from "~/utils/mail.server";
import Text from "~/ui/Text/Text";
import { allOptions } from "~/constants/formats";
import type { MetaFunction } from "@remix-run/node";
import { createMeta } from "~/utils/meta";
import CompanyServicesSection from "~/ui/AboutPage/CompanyServicesSection";
import Box from "~/ui/Box/Box";
import FormField from "~/ui/FormField/FormField";
import { GET_IN_TOUCH_FORM } from "~/constants/getInTouchForm";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";
import TestimonialSection from "~/ui/AboutPage/TestimonialSection";
import FAQSection from "~/ui/AboutPage/FAQSection";
import { ConversionForm } from "~/ui/ConversionForm/ConversionForm";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { validateEmailFormat } from "~/ui/ShareButton/ShareButton";

export let handle = { i18n: "common" };

export async function loader({ request }: LoaderFunctionArgs) {
  let t = await i18next.getFixedT(request);
  let keywords = t("homeMeta.keywords");
  let ogTitle = t("homeMeta.ogTitle");
  let ogDescription = t("homeMeta.ogDescription");
  let description = t("homeMeta.description");
  let title = t("homeMeta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = createMeta({
  ogImage: "https://easyconvertimage.com/img/advanced-technology.jpg",
  twitterCard: "summary_large_image",
  canonicalUrl: "https://easyconvertimage.com",
  alternateLanguages: {
    es: "https://easyconvertimage.com/es",
    fr: "https://easyconvertimage.com/fr",
    de: "https://easyconvertimage.com/de",
    en: "https://easyconvertimage.com/en",
    pt: "https://easyconvertimage.com/pt",
    nl: "https://easyconvertimage.com/nl",
    it: "https://easyconvertimage.com/it",
    id: "https://easyconvertimage.com/id",
    no: "https://easyconvertimage.com/no",
    pl: "https://easyconvertimage.com/pl",
    tr: "https://easyconvertimage.com/tr",
    ru: "https://easyconvertimage.com/ru",
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Easy Convert Image",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
    },
  },
});

export const action: ActionFunction = async ({ request }) => {
  const formData = await parseFormData(request);
  const typeOperation = formData.get("type") as string;

  if (typeOperation === "contact") {
    try {
      await onSendCustomerEmail(formData);
      return json({ emailSent: true });
    } catch {
      return json(
        { contactError: "Error sending contact email" },
        { status: 400 }
      );
    }
  } else if (typeOperation === "email") {
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
  let { t } = useTranslation("common");
  const { showSnackbar } = useTheme();
  const data = useActionData<typeof action>();
  const submit = useSubmit();
  const [selectedFormat] = useState("PNG");
  const [selectedFormatFrom] = useState("JPEG");
  const [pdfType, setPdfType] = useState("separated");
  const navigate = useNavigate();
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

  const [contactFormData, setContactForm] = React.useState({});
  const [isPending, setIsPending] = React.useState(false);
  // @ts-ignore
  const params: GetInTouchForm = GET_IN_TOUCH_FORM;
  const formId = "get-in-touch-form";

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
      setContactForm({});
    }
  }, [data?.emailSent]);

  const handleSubmit = (p: any) => {
    const formData = new FormData();
    formData.append("name", p.name);
    formData.append("phone", p.phone);
    formData.append("email", p.email);
    formData.append("comments", p.comments);
    if (!p.name) {
      showSnackbar(t("ui.missingName"), "error");
      return;
    }
    if (!p.phone) {
      showSnackbar(t("ui.missingPhone"), "error");
      return;
    }
    if (!p.email) {
      showSnackbar(t("ui.missingEmail"), "error");
      return;
    }
    if (!validateEmailFormat(p.email)) {
      showSnackbar(t("ui.formatEmail"), "error");
      return;
    }
    if (!p.comments) {
      showSnackbar(t("ui.missingComments"), "error");
      return;
    }
    formData.append("type", "contact");
    setIsPending(true);
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const handleFromChange = (v: string) => {
    const fromValue = v?.toLowerCase() ?? "png";
    const toValue = selectedFormat?.toLowerCase() ?? "jpeg";
    navigate(`/convert/${fromValue}/${toValue}`);
  };

  const handleToChange = (v: string) => {
    const fromValue = selectedFormat?.toLowerCase() ?? "png";
    const toValue = v?.toLowerCase() ?? "jpeg";
    navigate(`/convert/${fromValue}/${toValue}`);
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
              list={POPULAR_CONVERSIONS.slice(0, 9)}
              heading={t("services.popularConversions")}
            />
            <TestimonialSection />
            <FAQSection />
          </div>

          <ContentContainer className="bg-color-secondary">
            <GridContainer alignItems="center" className="u-mt3 u-mb6">
              <GridItem xs={12} lg={6}>
                <Heading align="left" level={1} appearance={4} underline>
                  {t("contact.heading")}
                </Heading>
                <div className="u-pt2 u-pr4">
                  <Text>{t("contact.description")}</Text>
                  <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
                    {t("contact.inquiries")}
                  </Heading>

                  <Text>{t("email")}: info@easyconvertimage.com</Text>

                  <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
                    {t("contact.support")}
                  </Heading>

                  <Text>{t("email")}: support@easyconvertimage.com</Text>
                </div>
              </GridItem>
              <GridItem xs={12} lg={6}>
                <Box>
                  <div className="u-pt2 u-pb2">
                    <Text size="small" color="secondary" textWeight="semi-bold">
                      {t("contact.contactUs")}
                    </Text>
                    <div className="u-pt1 u-pb1">
                      <Text size="small">{t("contact.instructions")}</Text>
                      <FormField
                        id={formId}
                        isLoading={isPending}
                        {...params}
                        initialValue={contactFormData}
                        onChange={setContactForm}
                        onSubmit={handleSubmit}
                      />
                    </div>
                  </div>
                </Box>
              </GridItem>
            </GridContainer>
          </ContentContainer>
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
