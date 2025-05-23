import React from "react";
import { useParams } from "@remix-run/react";
import { ActionFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Footer from "~/ui/Footer/Footer";
import { FOOTER } from "~/constants/content";
import Navbar from "~/ui/Navbar/Navbar";
import ToolContainer from "~/ui/ToolContainer/ToolContainer";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import { allOptions } from "~/constants/formats";
import CompanyServicesSection from "~/ui/LegalPage/CompanyServicesSection";
import FAQSection from "~/ui/LegalPage/FAQSection";
import { CONVERSIONS, POPULAR_CONVERSIONS } from "~/utils/conversions";
import { useTranslation } from "react-i18next";
import { handleError, contactAction } from "~/utils/serverUtils";
import { meta } from "../utils/meta";
import { getMetaIntl } from "~/utils/metaIntl";
import Tool from "~/ui/Tool/Tool";
import { getCSRFToken } from "~/utils/csrf.server";
import ComparisonSection from "~/ui/LegalPage/ComparisonSection";

export { meta };
export const handle = { i18n: "common" };

export const shouldRevalidate = () => false;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { sourceFormat, targetFormat } = params;
  const data = await getMetaIntl(params, request);

  const { token, cookieHeader } = await getCSRFToken(request);
  return json(
    {
      ...data,
      alternate: `convert/${sourceFormat}/${targetFormat}`,
      csrfToken: token,
    },
    { headers: { "Set-Cookie": cookieHeader } }
  );
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await contactAction(request);
  } catch (error) {
    console.error('Error in action function:', error);
    return handleError(error);
  }
};

export default function ConvertPageMultilanguage() {
  const { t } = useTranslation("common");
  const { sourceFormat } = useParams();

  const initialFrom = allOptions.find(
    (item) => item.value === sourceFormat?.toLowerCase()
  );

  const selectedFormatFrom = initialFrom?.label ?? "JPEG";

  const footerData = { ...FOOTER };
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

  const conversionOptions = React.useMemo(
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
          <ContentContainer className="u-mb5">
            <section
              className="tool-heading"
              aria-labelledby="conversion-heading"
            >
              <Tool />
            </section>
          </ContentContainer>
          <div id="top-tools">
            <ComparisonSection />
            <CompanyServicesSection
              list={conversionOptions}
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
          { label: "Facebook", icon: "facebook", href: "#" },
          { label: "Twitter", icon: "X", href: "#" },
        ]}
      />
    </>
  );
}
