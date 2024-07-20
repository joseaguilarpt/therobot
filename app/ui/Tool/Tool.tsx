import './Tool.scss';

import { ConversionForm } from "../ConversionForm/ConversionForm";
import DragAndDrop from "../DragDrop/DragDrop";
import Files from "../Files/Files";
import { allOptions } from "~/constants/formats";
import { useParams } from "@remix-run/react";
import { useFileConversion } from "~/utils/useTool";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import { useTranslation } from 'react-i18next';
import HCaptchaComponent from '../HCaptcha/Hcaptcha';

export default function Tool() {
  const { sourceFormat, targetFormat, lang } = useParams();

  let language = lang;
  const { i18n } = useTranslation();
  if (!language) {
    language = i18n.language;
  }

  const initialFrom = allOptions.find(
    (item) => item.value === sourceFormat?.toLowerCase()
  );
  const initialTo = allOptions.find(
    (item) => item.value === targetFormat?.toLowerCase()
  );

  const selectedFormat = initialTo?.label ?? "PNG";
  const selectedFormatFrom = initialFrom?.label ?? "JPEG";

  const handleFromChange = (v: string) => {
    const fromValue = v?.toLowerCase() ?? "png";
    const toValue = selectedFormat?.toLowerCase() ?? "jpeg";
    window.location.href = `/${language}/convert/${fromValue}/${toValue}`;
  };

  const handleToChange = (v: string) => {
    const fromValue = selectedFormatFrom?.toLowerCase() ?? "png";
    const toValue = v?.toLowerCase() ?? "jpeg";
    window.location.href = `/${language}/convert/${fromValue}/${toValue}`;
  };

  const {
    convertedFiles,
    pdfType,
    isPending,
    setPdfType,
    handleAllAction,
    handleDownload,
    handleRemove,
    handleRemoveAll,
    handleEmailShare,
  } = useFileConversion(selectedFormat);

  return (
    <>
      <GridContainer className="u-mt3" justifyContent="space-between">
        <GridItem xs={12} lg={5}>
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
        <GridItem xs={12} lg={7}>
          <DragAndDrop
            onFilesDrop={handleAllAction}
            isLoading={isPending}
            acceptedTypes={[`image/${selectedFormatFrom?.toLowerCase()}`]}
            maxSize={10_000_000} // 10 MB
            files={convertedFiles}
          />
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
