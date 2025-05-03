import "./Tool.scss";

import { ConversionForm } from "../ConversionForm/ConversionForm";
import DragAndDrop from "../DragDrop/DragDrop";
import Files from "../Files/Files";
import { allOptions } from "~/constants/formats";
import { useNavigate, useParams } from "@remix-run/react";
import { useFileConversion } from "~/utils/useTool";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import { useTranslation } from "react-i18next";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";

export default function Tool() {
  const { sourceFormat, targetFormat, lang } = useParams();
  const navigate = useNavigate();
  const initialFrom = allOptions.find(
    (item) => item.value === sourceFormat?.toLowerCase()
  );
  const initialTo = allOptions.find(
    (item) => item.value === targetFormat?.toLowerCase()
  );

  let language = lang;
  const { i18n, t } = useTranslation();
  if (!language) {
    language = i18n.language;
  }

  const selectedFormat = initialTo?.label ?? "PNG";
  const selectedFormatFrom = initialFrom?.label ?? "JPEG";

  const handleFromChange = (v: string) => {
    const fromValue = v?.toLowerCase() ?? "png";
    const toValue = selectedFormat?.toLowerCase() ?? "jpeg";
    navigate(`/${language}/convert/${fromValue}/${toValue}`);
  };

  const handleToChange = (v: string) => {
    const fromValue = selectedFormatFrom?.toLowerCase() ?? "png";
    const toValue = v?.toLowerCase() ?? "jpeg";
    navigate(`/${language}/convert/${fromValue}/${toValue}`);
  };

  const {
    convertedFiles,
    pdfType,
    isPending,
    setPdfType,
    setIsPending,
    handleAllAction,
    handleDownload,
    handleRemove,
    handleRemoveAll,
    handleEmailShare,
  } = useFileConversion(selectedFormat, selectedFormatFrom);

  return (
    <>
      <GridContainer alignItems="center" justifyContent="space-between">
        <GridItem xs={12} lg={6}>
          {sourceFormat && targetFormat && (
            <>
             <Text
             className="hero-pill"
               size="small"
              >
                {t("hero.header1")}
              </Text>
              <Heading
                id="conversion-heading"
                appearance={3}
                level={1}
                underline
              >
                {t("services.itemDescriptionContent", {
                  sourceFormat: sourceFormat?.toUpperCase(),
                  targetFormat: targetFormat?.toUpperCase(),
                })}{" "}
              </Heading>
              <Text className="u-pt5 hero-description">
                {t(`${sourceFormat}.${targetFormat}.description`)}
              </Text>
            </>
          )}
          {!sourceFormat && !targetFormat && (
            <>
              <Heading
                id="conversion-heading"
                color="accent"
                appearance={3}
                level={1}
              >
                {t("hero.header1")}
              </Heading>
              <Heading underline appearance={3} level={1}>
                {t("hero.header2")}
              </Heading>
              <Text className="u-pt5 hero-description">
                {t("hero.description")} {t("hero.freeToUse")}
              </Text>
            </>
          )}
        </GridItem>
        <GridItem xs={12} lg={5}>
          <GridContainer className="u-mt4 tool-conversion__container" justifyContent="space-between">
            <GridItem xs={12}>
              <div className="tool-conversion-form">
                <ConversionForm
                  options={allOptions}
                  selectedFormat={selectedFormat}
                  selectedFormatFrom={selectedFormatFrom}
                  pdfType={pdfType}
                  setPdfType={setPdfType}
                  handleFromChange={handleFromChange}
                  handleToChange={handleToChange}
                />
              </div>
            </GridItem>
            <GridItem xs={12}>
              <DragAndDrop
                onFilesDrop={handleAllAction}
                isLoading={isPending}
                setIsPending={setIsPending}
                acceptedTypes={[`image/${selectedFormatFrom?.toLowerCase()}`]}
                maxSize={6_291_456} // 6 MB
                files={convertedFiles}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <Files
        onEmailShare={handleEmailShare}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        files={convertedFiles}
        onDownload={handleDownload}
      />
    </>
  );
}
