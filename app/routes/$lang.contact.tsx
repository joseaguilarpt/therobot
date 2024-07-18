import React from "react";
import { FOOTER } from "~/constants/content";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Breadcrumb from "~/ui/Breadcrumbs/Breadcrumbs";
import Footer from "~/ui/Footer/Footer";
import GridContainer from "~/ui/Grid/Grid";
import Heading from "~/ui/Heading/Heading";
import Hero from "~/ui/Hero/Hero";
import Navbar from "~/ui/Navbar/Navbar";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import GridItem from "~/ui/Grid/GridItem";
import Text from "~/ui/Text/Text";
import FormField from "~/ui/FormField/FormField";
import { useTheme } from "~/context/ThemeContext";
import { GET_IN_TOUCH_FORM } from "~/constants/getInTouchForm";
import Box from "~/ui/Box/Box";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { parseFormData } from "~/utils/converter.server";
import { useActionData, useSubmit } from "@remix-run/react";
import { onSendCustomerEmail } from "~/utils/mail.server";
import { createMeta } from "~/utils/meta";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import { validateEmailFormat } from "~/ui/ShareButton/ShareButton";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";

export async function loader({ request }: LoaderFunctionArgs) {
  let t = await i18next.getFixedT(request);
  let keywords = t("contact.meta.keywords");
  let ogTitle = t("contact.meta.ogTitle");
  let ogDescription = t("contact.meta.ogDescription");
  let description = t("contact.meta.description");
  let title = t("contact.meta.title");
  return json({ title, description, keywords, ogDescription, ogTitle });
}

export const meta: MetaFunction = ({ data }) => {
  const { description, title } = data as any;
  const url = `https://easyconvertimage.com/contact`;

  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      en: `https://easyconvertimage.com/en/contact`,
      es: `https://easyconvertimage.com/es/contact`,
      fr: `https://easyconvertimage.com/fr/contact`,
      de: `https://easyconvertimage.com/de/contact`,
      pt: `https://easyconvertimage.com/pt/contact`,
      nl: `https://easyconvertimage.com/nl/contact`,
      it: `https://easyconvertimage.com/it/contact`,
      id: `https://easyconvertimage.com/id/contact`,
      ru: `https://easyconvertimage.com/ru/contact`,
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await parseFormData(request);
  try {
    await onSendCustomerEmail(formData);
    return json({ emailSent: true });
  } catch {
    return json({ error: "Error sending email" }, { status: 400 });
  }
};

export default function Contact() {
    const { t }= useTranslation();
  const data = useActionData<typeof action>();
  const submit = useSubmit();
  const [formDataValue, setFormData] = React.useState({});
  const [isPending, setIsPending] = React.useState(false);

  // @ts-ignore
  const params: GetInTouchForm = GET_IN_TOUCH_FORM;
  const formId = "get-in-touch-form";

  const { showSnackbar } = useTheme();

  React.useEffect(() => {
    if (data?.error) {
      showSnackbar(data?.error, "error");
      setIsPending(false);
    }
  }, [data?.error]);

  React.useEffect(() => {
    if (data?.emailSent) {
      showSnackbar(
        t('ui.contactEmailSent'),
        "success"
      );
      setIsPending(false);
      setFormData({});
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
        <Hero>
          <Heading
            level={1}
            appearance={3}
            align="center"
            color="contrast"
            underline
          >
            {t('contact.heading')}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[{ icon: 'FaHome', label: t('home'), href: "/" }, { label: t('contact.contactUs') }]}
            />
          </GridContainer>
        </Hero>
        <ContentContainer>
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
                        initialValue={formDataValue}
                        onChange={setFormData}
                        onSubmit={handleSubmit}
                      />
                    </div>
                  </div>
                </Box>
              </GridItem>
            </GridContainer>
          </ContentContainer>
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
