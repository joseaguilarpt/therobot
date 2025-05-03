// In app/routes/convert.tsx
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunctionArgs , json } from "@remix-run/node";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Footer from "~/ui/Footer/Footer";
import { FOOTER } from "~/constants/content";
import Navbar from "~/ui/Navbar/Navbar";
import ToolContainer from "~/ui/ToolContainer/ToolContainer";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import CompanyServicesSection from "~/ui/AboutPage/CompanyServicesSection";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";
import TestimonialSection from "~/ui/AboutPage/TestimonialSection";
import FAQSection from "~/ui/AboutPage/FAQSection";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { toolAction } from "~/utils/toolUtils";
import Tool from "~/ui/Tool/Tool";
import ContactForm from "~/ui/ContactForm/ContactForm";
import { meta } from "~/utils/meta";
import { getCSRFToken } from "~/utils/csrf.server";
import { HCaptchaComponent } from "~/ui/HCaptcha/Hcaptcha";

export { meta };
export const handle = { i18n: "common" };

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const keywords = t("homeMeta.keywords");
  const ogTitle = t("homeMeta.ogTitle");
  const ogDescription = t("homeMeta.ogDescription");
  const description = t("homeMeta.description");
  const title = t("homeMeta.title");
  const { token, cookieHeader } = await getCSRFToken(request);
  return json(
    { title, description, keywords, ogDescription, ogTitle, csrfToken: token },
    { headers: { "Set-Cookie": cookieHeader } }
  );
}

export const action: ActionFunction = async ({ request }) => {
  return toolAction(request);
};

export default function IndexPage() {
  const { t } = useTranslation("common");
  const data = useActionData<typeof action>();

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
                {t("hero.description")}{' '}{t("hero.freeToUse")}
              </Text>
              <Tool />
            </section>
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
            <ContactForm data={data} />
          </ContentContainer>
        </ToolContainer>
      </main>
      <BackToTop />
      <Footer
        {...FOOTER}
        backgroundImageUrl={""}
        socialNetworks={[
          { label: "Facebook", icon: "FaFacebook", href: "#" },
          { label: "Twitter", icon: "FaTwitter", href: "#" },
        ]}
      />
    </>
  );
}

export { IndexPage };
