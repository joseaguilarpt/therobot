import "./Filters.scss";
import React from "react";
import FormField from "../FormField/FormField";
import { FILTERS } from "~/constants/filters";
import Button from "../Button/Button";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Modal from "../Modal/Modal";
import ContentContainer from "../ContentContainer/ContentContainer";
import Pills from "../Pills/Pills";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

export default function Filters({
  onToggleMap,
  isMapOpen,
  onSubmit,
  formData,
  initialValue,
  onInitialValueChange,
  onClear,
  onFormDataChange,
  onRemoveFilter,
}: {
  isMapOpen: boolean;
  onToggleMap: () => void;
  onSubmit: (v: any) => void;
  formData: any;
  initialValue: any;
  onClear: (v: any) => void;
  onFormDataChange: (v: any) => void;
  onInitialValueChange: (v: any) => void;
  onRemoveFilter: (v: any) => void;
}) {
  const { t } = useTranslation(); // Hook for accessing translations
  const [filters, setFilters] = React.useState([]);
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const handleSetFilters = (p: any) => {
    const query = omit(p, ["radius"]);
    const params: any = Object.keys(query)
      .map((key) => {
        const current = FILTERS.inputs.find((item) => item.id === key);
        return {
          label: current?.label ?? current?.placeholder ?? "",
          id: current?.id ?? current?.placeholder ?? "",
        };
      })
      .filter((v) => !isEmpty(v.label));
    setFilters(params);
  };

  React.useEffect(() => {
    handleSetFilters(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    handleSetFilters(formData);
    setIsOpenModal(false);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleClear = () => {
    setFilters([]);
    setIsOpenModal(false);
    if (onClear) {
      onClear(formData);
    }
  };

  const handleChange = (v: any) => {
    onFormDataChange({ ...formData, ...v });
  };

  const handleRemoveFilter = (filter: string) => {
    const filtersData = filters.filter((v) => v.id !== filter);
    setFilters(filtersData);
    onRemoveFilter(filter);
  };

  React.useEffect(() => {
    if (!formData.make && formData.model) {
      onInitialValueChange({ ...formData, model: null });
    }
  }, [formData?.make]);

  const parsedConditional = (item: any) => {
    const param = formData && formData[item.conditionalDisabled];
    const parsed = param?.id
      ? item.options.filter((v) => v.id.includes(param.id))
      : item.options;
    return {
      ...item,
      options: parsed,
    };
  };

  const inputs = FILTERS.inputs.map((item) => {
    if (item.conditionalDisabled) {
      return parsedConditional(item);
    }
    return item;
  });


  return (
    <div className="filters-container">
      <div className="filters-container__desktop">
        <FormField
          {...FILTERS}
          inputs={inputs.slice(0, 7)}
          initialValue={initialValue}
          onChange={handleChange}
        />
        <GridContainer justifyContent="flex-end">
          <GridItem>
            <Button appareance="link" onClick={handleClear}>
              {t("filters.clearFilters")}
            </Button>
          </GridItem>
          <GridItem>
            <Button appareance="secondary" onClick={() => setIsOpenModal(true)}>
              {t("filters.moreFilters")}
            </Button>
          </GridItem>
          <GridItem>
            <Button onClick={handleSubmit}>{t("filters.search")}</Button>
          </GridItem>
        </GridContainer>
      </div>
      <div className="filters-container__mobile u-mt3">
        <GridContainer className="u-mb2">
          <GridItem className="filters-button__wrapper" xs={6}>
            <div className="u-mr1">
              <Button
                className="filters-button"
                appareance="primary"
                size="small"
                leftIcon="FaFilter"
                fitContainer
                onClick={() => setIsOpenModal(true)}
              >
                {t("filters.filters")}
              </Button>
            </div>
          </GridItem>
          <GridItem className="filters-button__wrapper" xs={6}>
            <div className="u-mr1">
              <Button
                className="filters-button"
                appareance="primary"
                size="small"
                leftIcon={isMapOpen ? "FaList" : "FaMap"}
                fitContainer
                onClick={onToggleMap}
              >
                {isMapOpen ? t("filters.backToList") : t("productDetails.map")}
              </Button>
            </div>
          </GridItem>
          {filters.length > 0 && (
            <GridItem className="filters-button__wrapper" xs={12}>
              <div className="u-mr1">
                <Button
                  className="filters-button"
                  appareance="outlined"
                  size="small"
                  leftIcon='FaRemoveFormat'
                  fitContainer
                  onClick={handleClear}
                >
                  {t('filters.clearFilters')}
                </Button>
              </div>
            </GridItem>
          )}
        </GridContainer>
        <Pills items={filters} onPillRemove={handleRemoveFilter} />
      </div>
      <Modal
        className="modal-filters-container"
        size="full"
        onClose={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
      >
        <ContentContainer>
          <FormField
            {...FILTERS}
            inputs={inputs}
            initialValue={initialValue}
            onChange={handleChange}
          />
        </ContentContainer>
        <div className="filters-actions">
          <ContentContainer>
            <GridContainer justifyContent="flex-end">
              <GridItem className="u-pr1">
                <Button appareance="link" onClick={handleClear}>
                  {t("filters.clearFilters")}
                </Button>
              </GridItem>
              <GridItem className="u-pr1">
                <Button
                  appareance="secondary"
                  onClick={() => setIsOpenModal(false)}
                >
                  {t("filters.lessFilters")}
                </Button>
              </GridItem>
              <GridItem>
                <Button onClick={handleSubmit}>{t("filters.search")}</Button>
              </GridItem>
            </GridContainer>
          </ContentContainer>
        </div>
      </Modal>
    </div>
  );
}
