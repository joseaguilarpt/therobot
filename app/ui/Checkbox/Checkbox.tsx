import React from 'react';
import classNames from 'classnames';
import './Checkbox.scss';

interface CheckboxProps {
  checked?: boolean; // Allow undefined for uncontrolled usage
  defaultChecked?: boolean; // Initial checked state for uncontrolled usage
  onChange?: (checked: boolean) => void; // Controlled onChange handler
  ariaLabel?: string;
  label?: string;
  hideLabel?: boolean;
  id?: string; // Add an id prop for form compatibility
  name: string; // Add a name prop for form compatibility
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false, // Default checked state for uncontrolled usage
  onChange,
  ariaLabel,
  label,
  hideLabel,
  id,
  name,
}) => {
  // Internal state for uncontrolled usage
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  // Handle change event
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    if (onChange) {
      onChange(isChecked); // Propagate change to parent if controlled
    } else {
      setInternalChecked(isChecked); // Update internal state if uncontrolled
    }
  };

  // Determine checked state based on props (controlled vs. uncontrolled)
  const isChecked = onChange ? controlledChecked : internalChecked;

  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        onChange={handleChange}
        aria-label={ariaLabel}
        className="checkbox__input"
      />
      <span className="checkbox__checkmark" />
      {!hideLabel && <span className="checkbox__label">{label}</span>}
    </label>
  );
};

export default Checkbox;
