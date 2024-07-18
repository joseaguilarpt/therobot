import "./TestimonialSection.scss";

import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import CollapsableList from "../CollapsableList/CollapsableList";
import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();
  const items = [
    {
      title: t("faq.option1.heading"),
      content: t("faq.option1.description"),
    },
    {
      title: t("faq.option2.heading"),
      content: t("faq.option2.description"),
    },
    {
      title: t("faq.option3.heading"),
      content: t("faq.option3.description"),
    },
    {
      title: t("faq.option4.heading"),
      content: t("faq.option4.description"),
    },
    {
      title: t("faq.option5.heading"),
      content: t("faq.option5.description"),
    },
    {
      title: t("faq.option6.heading"),
      content: t("faq.option6.description"),
    },
    {
      title: t("faq.option7.heading"),
      content: t("faq.option7.description"),
    },
    {
      title: t("faq.option8.heading"),
      content: t("faq.option8.description"),
    },
    {
      title: t("faq.option9.heading"),
      content: t("faq.option9.description"),
    },
    {
      title: t("faq.option10.heading"),
      content: t("faq.option10.description"),
    },
    {
      title: t("faq.option11.heading"),
      content: t("faq.option11.description"),
    },
    {
      title: t("faq.option12.heading"),
      content: t("faq.option12.description"),
    },
    {
      title: t("faq.option13.heading"),
      content: t("faq.option13.description"),
    },
  ];
  return (
    <ContentContainer>
      <GridContainer
        alignItems="center"
        justifyContent="center"
        className="u-mt6 u-mb5"
      >
        <GridItem xs={12} animation="slide-in-bottom" justifyContent="center">
          <Heading align="center" level={2} appearance={4} underline>
            {t("faq.heading")}
          </Heading>
          <div className="u-pt2">
            <Text align="center" color="primary">
              {t("faq.description")}
            </Text>
          </div>
        </GridItem>
      </GridContainer>
      <div className="u-mb4">
        <CollapsableList items={items} initialExpandedIndex={0} />
      </div>
    </ContentContainer>
  );
}
