import './TestimonialSection.scss';
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import Card from "~/ui/Card/Card";
import { ConversionService, POPULAR_CONVERSIONS } from "~/utils/conversions";
import { useTranslation } from "react-i18next";

export default function CompanyServicesSection({ list = POPULAR_CONVERSIONS }: { list: ConversionService[] }) {

  const data = list.filter((item) => item?.from?.toLowerCase() !== 'pdf');
  const { t } = useTranslation();
  return (
    <ContentContainer className="bg-color-secondary">
    <GridContainer
      alignItems="center"
      justifyContent="center"
      className="u-mt6 u-mb3"
    >
      <GridItem
        xs={12}
        justifyContent="center"
      >
        <Heading align="center" level={2} appearance={4} underline>
              {t("services.popularConversions")}
        </Heading>
        <div className="u-pt2">
          <Text align="center" color="primary">
            {t('services.description')}
          </Text>
        </div>
      </GridItem>
      <GridContainer className="services-container u-mt4">
        {data.map((item, index) => (
          <GridItem
            xs={12}
            md={4}
            key={index}
            className="u-mt1 u-mb1"
          >
            <Card
              id={index}
              shadow
              {...item}
              ariaLabel={t('services.itemDescriptionAria', { 
                sourceFormat: item.from, 
                targetFormat: item.to 
              })}
              content={t('services.itemDescriptionContent', { 
                sourceFormat: item.from, 
                targetFormat: item.to 
              })}
              title={t('services.itemTitle', {
                sourceFormat: item.from, 
                targetFormat: item.to 
              })}
              conversion={{ from: item.from, to: item.to }}
              imageUrl={undefined}
              icon={undefined}
              url={item.href}
              imagePosition='left'
            />
          </GridItem>
        ))}
      </GridContainer>
    </GridContainer>
  </ContentContainer>
  );
}
