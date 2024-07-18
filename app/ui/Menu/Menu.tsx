// components/MenuDropdown.tsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Icon, { IconType } from "../Icon/Icon";
import "./Menu.scss"; // Ensure your local styles are imported

interface MenuItem {
  value: string;
  href: string;
  icon?: IconType;
}

const MenuDropdown: React.FC<{ menuItems: MenuItem[]; scrolled: boolean }> = ({
  menuItems,
  scrolled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    buttonRef.current?.focus(); // Return focus to the button after closing dropdown
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (dropdownRef.current) {
          const firstMenuItem = dropdownRef.current.querySelector(
            ".menu-dropdown__item"
          ) as HTMLElement;
          firstMenuItem?.focus();
        }
        break;
      case "Escape":
        closeDropdown();
        break;
      default:
        break;
    }
  };

  return (
    <div className="menu-dropdown">
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : "false"}
        ref={buttonRef}
        className={classNames("menu-dropdown__toggle")}
      >
        <Icon icon="FaBars" color={!scrolled ? "success" : "primary"} size='medium' />
      </button>
      <ul
        className={classNames("menu-dropdown__list", { open: isOpen })}
        ref={dropdownRef}
        role="menu"
        aria-label="Menu Items"
      >
        {menuItems.map((item) => (
          <li
            key={item.value}
            className="menu-dropdown__item"
            role="none"
            onClick={closeDropdown}
          >
            <Link to={item.href} role="menuitem">
              {item.icon && <Icon icon={item.icon} color='primary' />} {item.value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuDropdown;
