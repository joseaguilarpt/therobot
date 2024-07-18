import { ConversionForm } from "../ConversionForm/ConversionForm";
import DragAndDrop from "../DragDrop/DragDrop";
import Files from "../Files/Files";
import { allOptions } from "~/constants/formats";
import { useParams } from "@remix-run/react";
import { useFileConversion } from "~/utils/useTool";

export default function Tool() {

  const { sourceFormat, targetFormat, lang } = useParams();

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
    window.location.href = `/${lang}/convert/${fromValue}/${toValue}`;
  };

  const handleToChange = (v: string) => {
    const fromValue = selectedFormat?.toLowerCase() ?? "png";
    const toValue = v?.toLowerCase() ?? "jpeg";
    window.location.href = `/${lang}/convert/${fromValue}/${toValue}`;
  };

  const {
    convertedFiles,
    pdfType,
    setPdfType,
    handleAllAction,
    handleDownload,
    handleRemove,
    handleRemoveAll,
    handleEmailShare,
  } = useFileConversion(selectedFormat, selectedFormatFrom);

  return (
    <>
      <ConversionForm
        options={allOptions}
        selectedFormat={selectedFormat}
        selectedFormatFrom={selectedFormatFrom}
        pdfType={pdfType}
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
      />
      <DragAndDrop
        onFilesDrop={handleAllAction}
        acceptedTypes={[`image/${selectedFormatFrom?.toLowerCase()}`]}
        maxSize={10_000_000} // 10 MB
        files={convertedFiles}
      />
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
