import React from 'react';
import classNames from 'classnames';
import './Checkbox.scss';
import Text from '../Text/Text';

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  label?: string;
  hideLabel?: boolean;
  id: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  ariaLabel,
  label,
  hideLabel,
  id,
  name,
  disabled = false,
  required = false,
  error,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (onChange) {
      onChange(isChecked);
    } else {
      setInternalChecked(isChecked);
    }
  };

  const isChecked = onChange ? controlledChecked : internalChecked;

  const checkboxId = `checkbox-${id}`;
  const errorId = `${checkboxId}-error`;

  return (
    <div className="checkbox-wrapper">
      <label className={classNames('checkbox', { 'checkbox--disabled': disabled })} htmlFor={checkboxId}>
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-label={hideLabel ? label || ariaLabel : undefined}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="checkbox__input"
        />
        <span className="checkbox__checkmark" aria-hidden="true" />
        {!hideLabel && (
          <Text className='u-pl1' as="span">
            {label}
            {required && <span className="visually-hidden"> (required)</span>}
          </Text>
        )}
      </label>
      {error && (
        <Text id={errorId} className="checkbox__error" role="alert">
          {error}
        </Text>
      )}
    </div>
  );
};

export default Checkbox;