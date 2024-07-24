import React, { useCallback, useMemo } from "react";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import AutoSuggest from "../AutoSuggest/AutoSuggest";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { useTranslation } from "react-i18next";
import { trackClick } from "~/utils/analytics";

type Option = {
  id: string | number;
  label: string;
  value: string;
};

interface ConversionFormProps {
  selectedFormat: string;
  selectedFormatFrom: string;
  pdfType: string;
  setPdfType: (type: string) => void;
  handleFromChange: (value: string) => void;
  handleToChange: (value: string) => void;
  options: Option[];
}

export const ConversionForm: React.FC<ConversionFormProps> = React.memo(
  function ConversionForm({
    selectedFormat,
    selectedFormatFrom,
    pdfType,
    setPdfType,
    options,
    handleFromChange,
    handleToChange,
  }: ConversionFormProps) {
    const { t, i18n } = useTranslation("common");

    const filteredFromOptions = useMemo(
      () =>
        options.filter(
          (item) =>
            item.label.toLowerCase() !== selectedFormat.toLowerCase() &&
            item.value !== "pdf"
        ),
      [options, selectedFormat]
    );

    const filteredToOptions = useMemo(
      () =>
        options.filter(
          (item) =>
            item.label.toLowerCase() !== selectedFormatFrom.toLowerCase()
        ),
      [options, selectedFormatFrom]
    );

    const handleFromChangeCallback = useCallback(
      (v: Option) => {
        trackClick(
          "Conversion Form Interaction",
          `Change Format from`,
          `language: ${i18n.language} - format from: ${v.label} - format to: : ${selectedFormat}`
        );
        handleFromChange(v.label);
      },
      [handleFromChange, i18n.language, selectedFormat]
    );

    const handleToChangeCallback = useCallback(
      (v: Option) => {
        trackClick(
          "Conversion Form Interaction",
          `Change Format to`,
          `language: ${i18n.language} - format from: ${selectedFormatFrom} - format to: : ${v.label}`
        );
        handleToChange(v.label);
      },
      [handleToChange, i18n.language, selectedFormatFrom]
    );

    return (
      <>
        <GridContainer
          className="tool-actions"
          alignItems="center"
          justifyContent="center"
        >
          <GridItem className="u-pl1 u-pr1">
            <AutoSuggest
              className="home-suggest"
              id="from"
              filterData={false}
              isLabelVisible={false}
              showSuggestionsOnFocus
              rightIcon="keyboard_arrow_down"
              label={t("tool.convertFrom")}
              onChange={handleFromChangeCallback}
              value={{ label: selectedFormatFrom }}
              options={filteredFromOptions}
            />
          </GridItem>
          <GridItem className="tool-heading__to">
            <Icon icon="arrow_forward" size="medium" color="white" />
          </GridItem>
          <GridItem className="u-pl1 u-pr1">
            <AutoSuggest
              className="home-suggest"
              id="to"
              label={t("tool.convertTo")}
              rightIcon="keyboard_arrow_down"
              onChange={handleToChangeCallback}
              isLabelVisible={false}
              filterData={false}
              showSuggestionsOnFocus
              value={{ label: selectedFormat }}
              options={filteredToOptions}
            />
          </GridItem>
        </GridContainer>
        {selectedFormat === "PDF" && (
          <>
            <Text textWeight="bold" align="center">
              {t("tool.selectOption")}
            </Text>
            <GridContainer className="u-pt2 u-pb3" justifyContent="center">
              <ButtonGroup
                id="pdf-type"
                onChange={setPdfType}
                selectedValue={pdfType}
                options={[
                  { label: t("tool.pdfOption1"), id: "separated" },
                  { label: t("tool.pdfOption2"), id: "single" },
                ]}
              />
            </GridContainer>
          </>
        )}
      </>
    );
  }
);
