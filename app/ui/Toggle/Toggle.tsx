import React from 'react';
import classNames from 'classnames';
import './Toggle.scss';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
  label?: string;
  hideLabel?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, ariaLabel, label, hideLabel }) => {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="toggle__input"
      />
      <span className="toggle__slider" />
      {!hideLabel && <span className="toggle__label">{label}</span>}
    </label>
  );
};

export default Toggle;
