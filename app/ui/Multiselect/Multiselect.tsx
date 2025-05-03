import React, { useState, useRef } from "react";
import "./Multiselect.scss";
import Text from "../Text/Text";
import classNames from "classnames";
import Icon, { IconType } from "../Icon/Icon";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

type Option = {
  id: string;
  label: string;
  selected?: boolean; // New: include selected property
};

export type MultiselectProps = {
  options: Option[];
  placeholder?: string;
  label: string;
  isLabelVisible?: boolean;
  id: string;
  onChange?: (selectedOptions: Option[]) => void;
  leftIcon?: IconType;
  rightIcon?: IconType;
  clearButton?: boolean;
  showSuggestionsOnFocus?: boolean;
  isLoading?: boolean;
};

const Multiselect: React.FC<MultiselectProps> = ({
  options,
  label,
  id,
  isLabelVisible = true,
  placeholder,
  onChange,
  leftIcon,
  rightIcon,
  clearButton,
  showSuggestionsOnFocus = false,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setActiveIndex(-1);
    if (newValue) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleClick = (option: Option) => {
    const selectedIndex = selectedOptions.findIndex((o) => o.id === option.id);
    if (selectedIndex === -1) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(selectedIndex, 1);
      setSelectedOptions(updatedOptions);
    }
    setQuery("");
    setShowSuggestions(false);
    if (onChange) {
      onChange(selectedOptions);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (activeIndex < filteredOptions.length - 1) {
        setActiveIndex((prevIndex) => prevIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      if (activeIndex > 0) {
        setActiveIndex((prevIndex) => prevIndex - 1);
      }
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleClick(filteredOptions[activeIndex]);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const toggleOption = (option: Option) => {
    const selectedIndex = selectedOptions.findIndex((o) => o.id === option.id);
    if (selectedIndex === -1) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(selectedIndex, 1);
      setSelectedOptions(updatedOptions);
    }
    if (onChange) {
      onChange(selectedOptions);
    }
  };

  const filteredOptions = query
    ? options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  return (
    <div className="multiselect">
      {isLabelVisible && (
        <label htmlFor={id}>
          <Text className="u-mb1" align="left">
            {t(label)}
          </Text>
        </label>
      )}
      <div className="multiselect__wrapper">
        {leftIcon && (
          <div className="multiselect__icon">
            <Icon icon={leftIcon} size="small" />
          </div>
        )}
        <input
          autoComplete="off"
          className={classNames(
            "multiselect__input",
            leftIcon && "__left-icon"
          )}
          id={id + "-multiselect"}
          name={label + "-multiselect"}
          type="text"
          placeholder={selectedOptions.length > 0 ? '' : t(placeholder ?? '')}

          aria-label={placeholder ?? label}
          value={query}
          onChange={handleChange}
          onKeyUp={handleKeyDown}
          onFocus={
            showSuggestionsOnFocus ? () => setShowSuggestions(true) : () => {}
          }
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions || (query && clearButton) ? (
          <button
            type="button"
            className="multiselect__clear-button"
            onClick={handleClear}
            aria-label="Clear text input"
          >
            <Icon size="small" icon="FaTimes" />
          </button>
        ) : null}
        {rightIcon && (
          <div className="multiselect__icon-right">
            <Icon icon={rightIcon} size="small" />
          </div>
        )}
      </div>
      {showSuggestions && (
        <ul className="multiselect__suggestions" ref={suggestionsRef}>
          {filteredOptions.length > 0 &&
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                className={classNames({ active: index === activeIndex })}
                onClick={() => handleClick(option)}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <Checkbox
                  name={option.label}
                  checked={selectedOptions.some((o) => o.id === option.id)}
                  onChange={() => toggleOption(option)}
                />
                <Text>{option.label}</Text>
              </li>
            ))}
          {filteredOptions.length === 0 && !isLoading && (
            <li className="disabled" key="no-results">
              <Text>{!query ? "Type something..." : "No Results.."}</Text>
            </li>
          )}
        </ul>
      )}
      <div className="multiselect__selected-options">
        {selectedOptions.slice(0, 2).map((option) => (
          <span key={option.id} className="multiselect__selected-option u-mr1">
            <Button
              leftIcon="FaTimes"
              size="small"
              appareance="primary"
              onClick={() => toggleOption(option)}
              ariaLabel={`Remove ${option.label}`}
            >
              {option.label}
            </Button>
          </span>
        ))}
        {selectedOptions.length > 2 && (
          <span className="multiselect__selected-option-pill">+{selectedOptions.length - 2}</span>
        )}
      </div>
    </div>
  );
};

export default Multiselect;
