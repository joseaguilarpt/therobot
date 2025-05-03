import React, { useState, useEffect, useRef } from "react";
import "./AutoSuggest.scss";
import Text from "../Text/Text";
import classNames from "classnames";
import Icon, { IconType } from "../Icon/Icon";
import { useTranslation } from "react-i18next";

type Option = {
  id: string;
  label: string;
  details?: string;
};

export type AutoSuggestProps = {
  options: Option[];
  placeholder?: string;
  label: string;
  isLabelVisible?: boolean;
  id: string;
  value?: Option;
  onChange?: (value: Option) => void;
  leftIcon?: IconType;
  rightIcon?: IconType;
  isLoading?: boolean;
  isDisabled?: boolean;
  className: string;
};

const AutoSuggest: React.FC<AutoSuggestProps> = ({
  options,
  label,
  id,
  isLabelVisible = true,
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  isLoading,
  isDisabled,
  className,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && activeIndex !== -1) {
      const activeElement = listboxRef.current?.children[activeIndex] as HTMLElement;
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveIndex(-1);
    }
  };

  const handleOptionSelect = (option: Option) => {
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLUListElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setActiveIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : options.length - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex !== -1) {
          handleOptionSelect(options[activeIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'Tab':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className={classNames("auto-suggest", className)}>
      {isLabelVisible && (
        <label id={`${id}-label`}>
          <Text className="u-mb1" align="left">
            {t(label)}
          </Text>
        </label>
      )}
      <div className="auto-suggest__wrapper">
        {leftIcon && (
          <div className="auto-suggest__icon">
            <Icon icon={leftIcon} size="small" aria-hidden="true" />
          </div>
        )}
        <button
          ref={buttonRef}
          className={classNames(
            "auto-suggest__button",
            leftIcon && "__left-icon"
          )}
          id={id}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${id}-label`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        >
          {value?.label || placeholder}
          {rightIcon && (
            <Icon icon={rightIcon} size="medium" aria-hidden="true" />
          )}
        </button>
      </div>
      {isOpen && (
        <ul 
          ref={listboxRef}
          className="suggestions" 
          role="listbox" 
          aria-labelledby={`${id}-label`}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {!isLoading && options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={option.id}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : ""}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <Text>{option.label}</Text>
                {option?.details && (
                  <Text textWeight="bold" size="small">
                    {option?.details}
                  </Text>
                )}
              </li>
            ))
          ) : (
            <li className="disabled" role="option" aria-disabled="true">
              <Text>{isLoading ? t("loading") : t("noOptions")}</Text>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggest;