import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./ButtonGroup.scss";
import Text from "../Text/Text";
import { useTranslation } from "react-i18next";

export interface ButtonOption {
  id: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonOption[];
  ariaLabel?: string;
  label?: string;
  isLabelVisible?: boolean;
  onChange?: (value: string) => void;
  selectedValue?: string | null;
  defaultSelectedValue?: string | null;
  name?: string;
  className?: string;
  id: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  ariaLabel,
  label,
  id,
  isLabelVisible = true,
  onChange,
  selectedValue,
  defaultSelectedValue = null,
  className,
}) => {
  const { t } = useTranslation();
  const [internalSelectedValue, setInternalSelectedValue] = useState(defaultSelectedValue);

  useEffect(() => {
    if (selectedValue !== undefined && selectedValue !== null) {
      if (onChange) {
        onChange(selectedValue);
      } else {
        setInternalSelectedValue(selectedValue);
      }
    }
  }, [selectedValue, onChange]);

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      setInternalSelectedValue(value);
    }
  };

  return (
    <div className={classNames("button-group", className)} role="group" aria-labelledby={`${id}-label`}>
      {isLabelVisible && label && (
        <Text id={`${id}-label`} className="button-group__label" as="span">
          {t(label)}
        </Text>
      )}
      <div className="button-group__buttons">
        {options.map((option) => {
          const isChecked = (selectedValue || internalSelectedValue) === option.id;
          return (
            <label
              key={option.id}
              className={classNames("button-group__button", {
                "button-group__button--active": isChecked,
              })}
            >
              <input
                type="radio"
                id={`${id}-${option.id}`}
                name={id}
                checked={isChecked}
                className="button-group__input"
                onChange={() => handleChange(option.id)}
                aria-checked={isChecked}
                data-id={option.id}
              />
              <span className="button-group__label-text">{t(option.label)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGroup;