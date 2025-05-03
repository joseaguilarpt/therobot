import { FOOTER } from "~/constants/content";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Breadcrumb from "~/ui/Breadcrumbs/Breadcrumbs";
import Footer from "~/ui/Footer/Footer";
import GridContainer from "~/ui/Grid/Grid";
import Heading from "~/ui/Heading/Heading";
import Hero from "~/ui/Hero/Hero";
import Navbar from "~/ui/Navbar/Navbar";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { MetaProps, createMeta } from "~/utils/meta";
import i18next from "~/i18next.server";
import { useTranslation } from "react-i18next";
import ContactForm from "~/ui/ContactForm/ContactForm";
import { getCSRFToken } from "~/utils/csrf.server";
import { handleError, contactAction } from "~/utils/serverUtils";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const keywords = t("contact.meta.keywords");
  const ogTitle = t("contact.meta.ogTitle");
  const ogDescription = t("contact.meta.ogDescription");
  const description = t("contact.meta.description");
  const title = t("contact.meta.title");
  const { token, cookieHeader } = await getCSRFToken(request);
  return json(
    { title, description, keywords, ogDescription, ogTitle, csrfToken: token },
    { headers: { "Set-Cookie": cookieHeader } }
  );
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
  const { description, title, keywords, ogDescription, ogTitle } = data as MetaProps;
  const lang = params.lang || 'en';
  const path = 'contact';
  const fullUrl = `https://easyconvertimage.com${lang === 'en' ? '' : '/' + lang}/${path}`;

  const alternateLanguages = {
    "x-default": `https://easyconvertimage.com/${path}`,
    en: `https://easyconvertimage.com/${path}`,
    es: `https://easyconvertimage.com/es/${path}`,
    fr: `https://easyconvertimage.com/fr/${path}`,
    de: `https://easyconvertimage.com/de/${path}`,
    pt: `https://easyconvertimage.com/pt/${path}`,
    nl: `https://easyconvertimage.com/nl/${path}`,
    it: `https://easyconvertimage.com/it/${path}`,
    id: `https://easyconvertimage.com/id/${path}`,
    ru: `https://easyconvertimage.com/ru/${path}`,
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
      "@type": "WebApplication",
      name: title,
      url: fullUrl,
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
  })({ data, params, location, matches });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    return await contactAction(request);
  } catch (error) {
    console.error('Error in action function:', error);
    return handleError(error);
  }
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const data = useActionData<typeof action>();
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
            {t("contact.heading")}
          </Heading>
          <GridContainer justifyContent="center" className="u-pt3">
            <Breadcrumb
              paths={[
                {
                  icon: "home",
                  label: t("home"),
                  href: `/${i18n.language ?? ""}`,
                },
                { label: t("contact.contactUs") },
              ]}
            />
          </GridContainer>
        </Hero>
        <ContentContainer>
          <ContactForm data={data} />
        </ContentContainer>
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
