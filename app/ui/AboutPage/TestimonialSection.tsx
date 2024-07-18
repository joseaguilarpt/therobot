import "./TestimonialSection.scss";

import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import Icon from "../Icon/Icon";
import { useTranslation } from "react-i18next";

export default function TestimonialSection() {
  const { t } = useTranslation();
  return (
    <ContentContainer>
      <GridContainer
        alignItems="center"
        justifyContent="center"
        className="u-mt6 u-mb5"
      >
        <GridItem xs={12} animation="slide-in-bottom" justifyContent="center">
          <Heading align="center" level={2} appearance={4} underline>
            {t("testimonials.heading")}
          </Heading>
          <div className="u-pt2">
            <Text align="center" color="primary">
              {t("testimonials.description")}
            </Text>
          </div>
        </GridItem>
      </GridContainer>
      <div className="testimonial-container u-mb4">
        <GridContainer justifyContent="space-between" className="u-pt4">
          <GridItem className="testimonial-item  u-pb3" xs={12} lg={4}>
            <Icon size="large" icon="Fa500Px" />
            <Heading align="center" level={4} appearance={5}>
              {t("testimonials.option1.heading")}
            </Heading>
            <Text align="center"> {t("testimonials.option1.description")}</Text>
          </GridItem>
          <GridItem className="testimonial-item  u-pb3" xs={12} lg={4}>
            <Icon size="large" icon="FaBlender" />

            <Heading align="center" level={4} appearance={5}>
              {t("testimonials.option2.heading")}
            </Heading>
            <Text align="center"> {t("testimonials.option2.description")}</Text>
          </GridItem>
          <GridItem className="testimonial-item  u-pb3" xs={12} lg={4}>
            <Icon size="large" icon="FaCalendarCheck" />

            <Heading align="center" level={4} appearance={5}>
              {t("testimonials.option3.heading")}
            </Heading>
            <Text align="center"> {t("testimonials.option3.description")}</Text>
          </GridItem>
        </GridContainer>
        <GridContainer justifyContent="space-between" className="u-mt4 u-mb4">
          <GridItem className="testimonial-item  u-pb3" xs={12} lg={4}>
            <Icon size="large" icon="FaCommentDollar" />

            <Heading align="center" level={4} appearance={5}>
              {t("testimonials.option4.heading")}
            </Heading>
            <Text align="center"> {t("testimonials.option4.description")}</Text>
          </GridItem>
          <GridItem className="testimonial-item  u-pb3" xs={12} lg={4}>
            <Icon size="large" icon="FaUserSlash" />

            <Heading align="center" level={4} appearance={5}>
              {t("testimonials.option5.heading")}
            </Heading>
            <Text align="center"> {t("testimonials.option5.description")}</Text>
          </GridItem>
          <GridItem className="testimonial-item u-pb3" xs={12} lg={4}>
            <Icon size="large" icon="FaShippingFast" />

            <Heading align="center" level={4} appearance={5}>
              {t("testimonials.option6.heading")}
            </Heading>
            <Text align="center"> {t("testimonials.option6.description")}</Text>
          </GridItem>
        </GridContainer>
      </div>
    </ContentContainer>
  );
}
