import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import Card from "~/ui/Card/Card";
import { COMPANY_OBJECTIVES } from "~/constants/content";
import { useTranslation } from "react-i18next";

export default function CompanyGoalSection() {
  const { t } = useTranslation();
  const parsedObjectives = COMPANY_OBJECTIVES.map((item) => ({
    ...item,
    title: t(item.title),
    content: t(item.content),
  }));
  return (
    <ContentContainer>
      <GridContainer
        alignItems="center"
        justifyContent="center"
        className="u-mt6 u-mb3"
      >
        <GridItem xs={12} animation="slide-in-bottom" justifyContent="center">
          <Heading align="center" level={2} appearance={4} underline>
            {t("about.purpose")}
          </Heading>
          <div className="u-pt2 u-pr4">
            <Text align="center" color="primary">
              {t("about.description")}
            </Text>
          </div>
        </GridItem>
        <GridContainer className="u-mt4">
          {parsedObjectives.map((item, index) => (
            <GridItem
              animation="slide-in-bottom"
              xs={12}
              md={6}
              key={index}
              className="u-mt1 u-mb1"
            >
              <Card {...item} icon={undefined} />
            </GridItem>
          ))}
        </GridContainer>
      </GridContainer>
    </ContentContainer>
  );
}
