import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import "./Modal.scss";
import Icon from "../Icon/Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  className?: string;
  title: string; // Add a required title prop for accessibility
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'full', className = '', title }) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      previousFocusedElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleFocusTrap = (event: FocusEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          event.preventDefault();
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            lastElement.focus();
          } else {
            firstElement.focus();
          }
        }
      };

      document.addEventListener("focusin", handleFocusTrap);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("focusin", handleFocusTrap);
        document.body.style.overflow = "auto";
        previousFocusedElement.current?.focus();
      };
    }
  }, [isOpen, mounted]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    <div 
      className={classNames("modal-overlay", className)} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div
        className={classNames("modal-content", size)}
        tabIndex={-1}
        ref={modalRef}
        onKeyDown={handleKeyDown}
      >
        <h2 id="modal-title" className="sr-only">{title}</h2>
        <button 
          className="modal-close-button" 
          onClick={onClose} 
          aria-label="Close Modal"
        >
          <Icon icon='FaTimes' size='medium' aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;