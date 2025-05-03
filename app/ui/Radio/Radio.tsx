import React from 'react';
import classNames from 'classnames';
import './Radio.scss';

interface RadioProps {
  checked?: boolean; // Allow undefined for uncontrolled usage
  defaultChecked?: boolean; // Initial checked state for uncontrolled usage
  onChange?: () => void; // Controlled onChange handler
  ariaLabel?: string;
  label?: string;
  hideLabel?: boolean;
  name: string;
}

const Radio: React.FC<RadioProps> = ({
  checked: controlledChecked,
  defaultChecked = false, // Default checked state for uncontrolled usage
  onChange,
  ariaLabel,
  label,
  hideLabel,
  name,
}) => {
  // Internal state for uncontrolled usage
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  // Handle change event
  const handleChange = () => {
    if (onChange) {
      onChange(); // Propagate change to parent if controlled
    } else {
      setInternalChecked(!internalChecked); // Update internal state if uncontrolled
    }
  };

  // Determine checked state based on props (controlled vs. uncontrolled)
  const isChecked = onChange ? controlledChecked : internalChecked;

  return (
    <label className="radio">
      <input
        type="radio"
        checked={isChecked}
        onChange={handleChange}
        aria-label={ariaLabel}
        name={name}
        className="radio__input"
      />
      <span className="radio__checkmark" />
      {!hideLabel && <span className="radio__label">{label}</span>}
    </label>
  );
};

export default Radio;
