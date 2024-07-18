import React, { ReactNode, useEffect, useRef } from "react";
import { IconType } from "react-icons";
import * as Icons from "react-icons/fa";
import classNames from "classnames";
import "./Sidebar.scss";
import { useTranslation } from "react-i18next";

export interface SidebarItem {
  value: string;
  href: string;
  icon: keyof typeof Icons;
}

export interface SidebarProps {
  items?: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "bottom" | "right" | "top";
  className?: string;
  children?: ReactNode;
  id?: string;
  label: string; // Add a label prop for accessibility
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  items,
  isOpen,
  onClose,
  position = "right",
  className,
  id,
  label,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  const { t } = useTranslation();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
    if (event.key === "Tab") {
      if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement.current
      ) {
        event.preventDefault();
        firstFocusableElement.current?.focus();
      } else if (
        event.shiftKey &&
        document.activeElement === firstFocusableElement.current
      ) {
        event.preventDefault();
        lastFocusableElement.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      // Set focus to the first focusable element
      firstFocusableElement.current?.focus();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusableElement.current = focusableElements[0] as HTMLElement;
      lastFocusableElement.current = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}
      <div
        id={id}
        className={classNames(
          "sidebar",
          `sidebar--${position}`,
          { "sidebar--open": isOpen },
          className
        )}
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        <button
          className="sidebar__close"
          onClick={onClose}
          aria-label={t("closeSidebar")}
        >
          ×
        </button>
        {items && (
          <nav>
            <ul className="sidebar__list">
              {items.map((item, index) => {
                const IconComponent: IconType = Icons[item.icon];
                return (
                  <li key={index} className="sidebar__item">
                    <a href={item.href} className="sidebar__link">
                      {IconComponent && (
                        <IconComponent
                          className="sidebar__icon"
                          aria-hidden="true"
                        />
                      )}
                      <span className="sidebar__label">{t(item.value)}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        {children}
      </div>
    </>
  );
};

export default Sidebar;
