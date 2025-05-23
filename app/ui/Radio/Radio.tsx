import React from "react";
import "./Radio.scss";

interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
  ariaLabel?: string;
  label?: string;
  hideLabel?: boolean;
  name: string;
}

const Radio: React.FC<RadioProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  ariaLabel,
  label,
  hideLabel,
  name,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  const handleChange = () => {
    if (onChange) {
      onChange();
    } else {
      setInternalChecked(!internalChecked);
    }
  };

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
