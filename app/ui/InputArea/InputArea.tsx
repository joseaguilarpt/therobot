import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import classNames from 'classnames';
import './InputArea.scss';
import { useTranslation } from 'react-i18next';

interface InputAreaProps {
  id?: string;
  label: string;
  placeholder?: string;
  isLabelVisible?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  hintText?: string;
  errorText?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rows?: number;
  className?: string;
  maxLength?: number;
}

export interface InputAreaRef {
  validate: () => boolean;
  clear: () => void;
  getValue: () => string;
}

const InputArea: React.ForwardRefRenderFunction<InputAreaRef, InputAreaProps> = ({
  id,
  label,
  placeholder = '',
  isLabelVisible = true,
  isRequired = false,
  isDisabled = false,
  hintText,
  errorText,
  value,
  defaultValue = '',
  onChange,
  onFocus,
  onBlur,
  rows = 3,
  className,
  maxLength = 100,
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const initialValue = value !== undefined ? value : defaultValue;
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const value = textareaRef.current ? textareaRef.current.value : '';
      if (isRequired && !value.trim()) {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
        return false;
      }
      return true;
    },
    clear: () => {
      setInputValue('');
      if (onChange) {
        onChange('');
      }
    },
    getValue: () => {
      return textareaRef.current ? textareaRef.current.value : '';
    }
  }));

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const uniqueId = id || `input-area-${Math.random().toString(36).substr(2, 9)}`;
  const hintId = `${uniqueId}-hint`;
  const errorId = `${uniqueId}-error`;

  return (
    <div className={classNames('input-area', className, { 'input-area--focused': isFocused, 'input-area--error': errorText })}>
      <label 
        className={classNames("input-area__label", { "sr-only": !isLabelVisible })} 
        htmlFor={uniqueId}
      >
        {t(label)}
        {isRequired && <span className="input-area__required" aria-hidden="true"> *</span>}
      </label>
      <textarea
        ref={textareaRef}
        id={uniqueId}
        name={uniqueId}
        className="input-area__input"
        placeholder={t(placeholder)}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={isRequired}
        disabled={isDisabled}
        aria-required={isRequired}
        aria-invalid={!!errorText}
        aria-describedby={`${hintText ? hintId : ''} ${errorText ? errorId : ''}`.trim() || undefined}
        rows={rows}
        maxLength={100}
      />
      {hintText && <div id={hintId} className="input-area__hint">{t(hintText)}</div>}
      {errorText && <div id={errorId} className="input-area__error" role="alert">{t(errorText)}</div>}
      {maxLength && (
        <div className="input-area__character-count" aria-live="polite">
          {inputValue.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default forwardRef(InputArea);