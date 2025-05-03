import "./InputText.scss";

import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export interface InputTextProps {
  id?: string;
  type?: string;
  label: string;
  placeholder?: string;
  isLabelVisible?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  hintText?: string;
  clearButton?: boolean;
  leftIcon?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  validateFormat?: (value: string) => boolean;
  error?: string;
  className?: string;
  autoComplete?: string;
}

export interface InputTextRef {
  validate: () => boolean;
  clear: () => void;
  getValue: () => string;
}

const InputText: React.ForwardRefRenderFunction<
  InputTextRef,
  InputTextProps
> = (
  {
    id,
    type = "text",
    label,
    placeholder = "",
    isLabelVisible = true,
    isRequired = false,
    isDisabled = false,
    hintText,
    clearButton = false,
    leftIcon,
    value,
    defaultValue = "",
    onChange,
    onFocus,
    onBlur,
    validateFormat,
    error,
    className,
    autoComplete = "off",
  },
  ref
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const initialValue = value !== undefined ? value : defaultValue;
  const [inputValue, setInputValue] = useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target;
    setInputValue(inputValue);
    if (onChange) {
      onChange(inputValue);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const value = inputRef.current ? inputRef.current.value : "";
      if (isRequired && !value.trim()) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return false;
      }
      if (validateFormat && !validateFormat(value)) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return false;
      }
      return true;
    },
    clear: () => {
      setInputValue("");
      if (onChange) {
        onChange("");
      }
    },
    getValue: () => {
      return inputRef.current ? inputRef.current.value : "";
    },
  }));

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const uniqueId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hintId = `${uniqueId}-hint`;
  const errorId = `${uniqueId}-error`;

  return (
    <div className={classNames("input-text", className)}>
      <label
        className={classNames("input-text__label", {
          "sr-only": !isLabelVisible,
        })}
        htmlFor={uniqueId}
      >
        {t(label)}
        {isRequired && <span className="input-text__required"> *</span>}
      </label>
      <div
        className={classNames("input-text__wrapper", {
          "input-text__wrapper--error": error,
        })}
      >
        {leftIcon && (
          <div className="input-text__icon" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          id={uniqueId}
          name={uniqueId}
          className={classNames("input-text__input", {
            "input-text__input--error": error,
          })}
          placeholder={t(placeholder)}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={isRequired}
          disabled={isDisabled}
          aria-required={isRequired}
          aria-invalid={!!error}
          aria-describedby={
            `${hintText ? hintId : ""} ${error ? errorId : ""}`.trim() ||
            undefined
          }
          autoComplete={autoComplete}
        />
        {clearButton && inputValue && (
          <button
            type="button"
            className="input-text__clear-button"
            onClick={() => {
              setInputValue("");
              if (onChange) {
                onChange("");
              }
              inputRef.current?.focus();
            }}
            aria-label={t("clearInput")}
          >
            <span aria-hidden="true">✖</span>
          </button>
        )}
      </div>
      {error && (
        <div id={errorId} className="input-text__error" role="alert">
          {error}
        </div>
      )}
      {hintText && (
        <div id={hintId} className="input-text__hint">
          {t(hintText)}
        </div>
      )}
    </div>
  );
};

export default forwardRef(InputText);
