import React from "react";
import { useParams } from "@remix-run/react";
import { ActionFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import BackToTop from "~/ui/BackToTop/BackToTop";
import Footer from "~/ui/Footer/Footer";
import { FOOTER } from "~/constants/content";
import Navbar from "~/ui/Navbar/Navbar";
import ToolContainer from "~/ui/ToolContainer/ToolContainer";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import { allOptions } from "~/constants/formats";
import CompanyServicesSection from "~/ui/AboutPage/CompanyServicesSection";
import FAQSection from "~/ui/AboutPage/FAQSection";
import { CONVERSIONS, POPULAR_CONVERSIONS } from "~/utils/conversions";
import { useTranslation } from "react-i18next";
import { toolAction } from "~/utils/toolUtils";
import { meta } from "../utils/meta";
import { getMetaIntl } from "~/utils/metaIntl";
import Tool from "~/ui/Tool/Tool";

export { meta };
export let handle = { i18n: "common" };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { sourceFormat, targetFormat } = params;
  const data = await getMetaIntl(params, request);

  return json({
    ...data,
    alternate: `convert/${sourceFormat}/${targetFormat}`,
  });
}

export const action: ActionFunction = async ({ request }) => {
  return toolAction(request);
};

export default function ConvertPageMultilanguage() {
  const { t } = useTranslation("common");
  const { sourceFormat } = useParams();

  const initialFrom = allOptions.find(
    (item) => item.value === sourceFormat?.toLowerCase()
  );

  const selectedFormatFrom = initialFrom?.label ?? "JPEG";

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
              <Tool />
            </section>
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
