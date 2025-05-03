import React, { useEffect, useRef, useState, useCallback } from "react";
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
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'full', className = '', title }) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleOverlayClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

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

  if (!isOpen || !mounted) return null;

  return ReactDOM.createPortal(
    // eslint-disable-next-line
    <div 
      className={classNames("modal-overlay", className)} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={classNames("modal-content", size)}
        tabIndex={-1}
        ref={modalRef}
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