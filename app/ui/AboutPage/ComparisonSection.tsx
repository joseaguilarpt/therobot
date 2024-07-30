import "./TestimonialSection.scss";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import GridContainer from "~/ui/Grid/Grid";
import GridItem from "~/ui/Grid/GridItem";
import Heading from "~/ui/Heading/Heading";
import Text from "~/ui/Text/Text";
import { useTranslation } from "react-i18next";
import { useParams } from "@remix-run/react";
import Icon from "../Icon/Icon";
import jpg from "../../img/formats/jpeg.svg";
import gif from "../../img/formats/gif.svg";
import webp from "../../img/formats/webp.svg";
import png from "../../img/formats/png.svg";
import files from "../../img/formats/file.svg";
import tiff from "../../img/formats/tiff.svg";
import svg from "../../img/formats/svg.svg";
import bmp from "../../img/formats/bmp.svg";
import avif from "../../img/formats/avif.svg";

export const FormatImage = ({ format }: { format: string }) => {
  switch (true) {
    case format.includes("jpg") || format.includes("jpeg"):
      return <img  src={jpg} alt="format jpg" />;
    case format.includes("png"):
      return <img  src={png} alt="format png" />;
    case format.includes("gif"):
      return <img  src={gif} alt="format gif" />;
    case format.includes("webp"):
      return <img  src={webp} alt="format webp" />;
    case format.includes("tiff"):
      return <img  src={tiff} alt="format tiff" />;
    case format.includes("bmp"):
      return <img  src={bmp} alt="format bmp" />;
    case format.includes("svg"):
      return <img  src={svg} alt="format svg" />;
    case format.includes("avif"):
      return <img  src={avif} alt="format avif" />;
    default:
      return <img  src={files} alt="format File" />;
  }
};

export default function ComparisonSection() {
  const { sourceFormat = 'jpeg', targetFormat = 'png' } = useParams();
  const { t } = useTranslation();
  const sourcePros = t(`${targetFormat}.pros`, {
    returnObjects: true,
  }) as string[];
  const sourceCons = t(`${targetFormat}.cons`, {
    returnObjects: true,
  }) as string[];
  const targetPros = t(`${sourceFormat}.pros`, {
    returnObjects: true,
  }) as string[];
  const targetCons = t(`${sourceFormat}.cons`, {
    returnObjects: true,
  }) as string[];
  return (
    <ContentContainer className="bg-color-secondary">
      <GridContainer
        alignItems="center"
        justifyContent="center"
        className="u-mt6 u-mb3"
      >
        <GridItem xs={12} justifyContent="center">
          <Heading align="center" level={2} appearance={4} underline>
            {t("services.itemTitle", {
              sourceFormat: sourceFormat?.toUpperCase(),
              targetFormat: targetFormat?.toUpperCase(),
            })}{" "}
          </Heading>
          <div className="u-pt2">
            <Text align="center" color="primary">
              {targetFormat?.toUpperCase()}{" "}
              {t(`${sourceFormat}.${targetFormat}.technicalDetails`)}
            </Text>
          </div>
        </GridItem>
        <GridContainer
          alignItems="stretch"
          justifyContent="space-between"
          className="comparsion-container u-mt4"
        >
          <GridItem className="grow" xs={12} md={5}>
            <div className="comparison-item">
              <div className="comparison-image">
                <FormatImage format={sourceFormat ?? "jpg"} />
              </div>
              <Heading color="contrast" align="center" level={2} appearance={6}>
                {sourceFormat?.toUpperCase()}
              </Heading>
              <div>
                <Text color="contrast"  className="u-pl4" size="large" textWeight="bold">
                  {t('prosTitle')}
                </Text>
                <ul className="pros">
                  {targetPros.map((item) => (
                    <li className="comparision-content__item" key={item}>
                      <Icon color="white" size="small" icon="check" />
                      <Text color="contrast"  className="u-pb1 u-pl1">{item}</Text>
                    </li>
                  ))}
                </ul>
                <Text color="contrast"  className="u-pl4" size="large" textWeight="bold">
                {t('consTitle')}
                </Text>
                <ul className="cons">
                  {targetCons.map((item) => (
                    <li className="comparision-content__item" key={item}>
                      <Icon color="white" size="small" icon="close" />
                      <Text color="contrast"  className="u-pb1 u-pl1">{item}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} md={2}>
            <Heading  className="vs table-item" align="center" level={2} color="accent" appearance={1}>
              VS
            </Heading>
          </GridItem>
          <GridItem className="grow"  xs={12} md={5}>
            <div className="comparison-item">
              <div className="comparison-image">
                <FormatImage format={targetFormat ?? "jpg"} />
              </div>
              <Heading color="contrast" align="center" level={2} appearance={6}>
                {targetFormat?.toUpperCase()}
              </Heading>
              <div>
                <Text color="contrast"  className="u-pl4" size="large" textWeight="bold">
                {t('prosTitle')}
                </Text>
                <ul className="pros">
                  {sourcePros.map((item) => (
                    <li className="comparision-content__item" key={item}>
                      <Icon color="white" size="small" icon="check" />
                      <Text color="contrast"  className="u-pb1 u-pl1">{item}</Text>
                    </li>
                  ))}
                </ul>
                <Text color="contrast"  className="u-pl4" size="large" textWeight="bold">
                {t('consTitle')}
                </Text>
                <ul className="cons">
                  {sourceCons.map((item) => (
                    <li className="comparision-content__item" key={item}>
                      <Icon color="white" size="small" icon="close" />
                      <Text color="contrast"  className="u-pb1 u-pl1">{item}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GridItem>
        </GridContainer>
      </GridContainer>
    </ContentContainer>
  );
}
