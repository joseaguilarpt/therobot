import React, { useEffect, useState, useRef } from "react";
import "./InputSelect.scss";
import useOutsideClick from "../../utils/useOutsideClick";
import Icon from "../Icon/Icon";

interface Option {
  id: number;
  value: string;
  label: string;
}

interface InputSelectProps {
  options: Option[];
  onSelect: (value: string) => void;
  label: string;
  placeholder?: string;
  initialValue?: string;
  value?: string;
  className?: string;
  id?: string;
  hideLabel?: boolean;
}

const InputSelect: React.FC<InputSelectProps> = ({
  options,
  onSelect,
  label,
  placeholder,
  initialValue,
  value: controlledValue,
  className = "",
  id,
  hideLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialValue);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);

  const uniqueId = id || `input-select-${label}`;
  const listboxId = `${uniqueId}-listbox`;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedOption(controlledValue);
    }
  }, [controlledValue]);

  useOutsideClick(selectRef, () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(0);
    }
  };

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent, value: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionClick(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prevIndex) => (prevIndex + 1) % options.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex(
            (prevIndex) => (prevIndex - 1 + options.length) % options.length
          );
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && focusedIndex !== -1) {
          handleOptionClick(options[focusedIndex].value);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleMouseEnter = () => {
    if (!isOpen) {
      setIsOpen(true);
      setFocusedIndex(0);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const rect = selectRef.current?.getBoundingClientRect();
    if (rect) {
      const isMovingToList = e.clientY > rect.bottom;
      if (!isMovingToList) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex !== -1) {
      optionsRef.current[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, isOpen]);

  const current = options.find((item) => item.value === selectedOption);
  const selected = current ? current.label : placeholder;

  return (
    <div 
      className={`input-select ${className}`} 
      ref={selectRef}
    >
      <label
        id={`${uniqueId}-label`}
        htmlFor={`${uniqueId}-button`}
        className={hideLabel ? "visually-hidden" : ""}
      >
        {label}
      </label>
      <button
        ref={buttonRef}
        id={`${uniqueId}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${uniqueId}-label ${uniqueId}-button`}
        onClick={toggleDropdown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {selected}
        <span className="input-select__arrow" aria-hidden="true">
          <Icon size="small" icon="FaChevronDown" />
        </span>
      </button>
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${uniqueId}-label`}
          className="input-select__options"
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              ref={(el) => (optionsRef.current[index] = el)}
              id={`${uniqueId}-option-${option.value}`}
              role="option"
              aria-selected={option.value === selectedOption}
              className={`input-select__option ${
                index === focusedIndex ? "focused" : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
              onMouseEnter={() => setFocusedIndex(index)}
              tabIndex={0}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSelect;