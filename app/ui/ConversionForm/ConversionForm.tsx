import React from "react";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import AutoSuggest from "../AutoSuggest/AutoSuggest";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { useTranslation } from "react-i18next";

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
    ({
      selectedFormat,
      selectedFormatFrom,
      pdfType,
      setPdfType,
      options,
      handleFromChange,
      handleToChange,
    }) => {
      let { t } = useTranslation("common");
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
                rightIcon="FaChevronDown"
                label={t("tool.convertFrom")}
                onChange={(v) => handleFromChange(v.label)}
                value={{ label: selectedFormatFrom}}
                options={options.filter(
                  (item) =>
                    item.label?.toLowerCase() !== selectedFormat?.toLowerCase() && item.value !== 'pdf'
                )}
              />
            </GridItem>
            <GridItem className="tool-heading__to">
              <Icon icon="FaArrowRight" size="medium" color="accent" />
            </GridItem>
            <GridItem className="u-pl1 u-pr1">
              <AutoSuggest
                className="home-suggest"
                id="to"
                label={t("tool.convertTo")}
                rightIcon="FaChevronDown"
                onChange={(v) => handleToChange(v.label)}
                isLabelVisible={false}
                filterData={false}
                showSuggestionsOnFocus
                value={{label: selectedFormat}}
                options={options.filter(
                  (item) =>
                    item.label?.toLowerCase() !==
                    selectedFormatFrom?.toLowerCase()
                )}
              />
            </GridItem>
          </GridContainer>
          {selectedFormat === "PDF" && (
            <>
              <Text textWeight="bold" align="center">
                {t('tool.selectOption')}
              </Text>
              <GridContainer className="u-pt2 u-pb3" justifyContent="center">
                <ButtonGroup
                  id="pdf-type"
                  onChange={setPdfType}
                  selectedValue={pdfType}
                  options={[
                    { label: t('tool.pdfOption1'), id: "separated" },
                    { label: t('tool.pdfOption2'), id: "single" },
                  ]}
                />
              </GridContainer>
            </>
          )}
        </>
      );
    }
  );