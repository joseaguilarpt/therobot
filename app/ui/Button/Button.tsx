import React from "react";
import classNames from "classnames";
import "./Button.scss";
import Tooltip from "../ToolTip/ToolTip";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Icon, { IconType } from "../Icon/Icon";

export interface ButtonProps {
  appareance?: "primary" | "secondary" | "tertiary" | "outlined" | "link" | "subtle";
  children: React.ReactNode;
  color?: "default" | "contrast";
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
  href?: string;
  ariaLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  fitContainer?: boolean;
  className?: string;
  leftIcon?: IconType;
  target?: string;
  size?: "small" | "medium" | "large";
  tooltipContent?: string;
}

const Button: React.FC<ButtonProps> = ({
  appareance = "primary",
  children,
  onClick,
  href,
  color,
  ariaLabel,
  type = "button",
  className,
  target,
  isLoading = false,
  isDisabled = false,
  fitContainer = false,
  leftIcon,
  size = "medium",
  tooltipContent,
}) => {
  const isLink = appareance === "link" || href;
  const buttonContent = (
    <>
      {isLoading && <LoadingSpinner size="small" aria-hidden="true" />}
      {leftIcon && <Icon size={size} icon={leftIcon} aria-hidden="true" />}
      <span className="button__text">{children}</span>
    </>
  );

  const buttonClasses = classNames(
    "button",
    `button--${appareance}`,
    color && `button--${color}`,
    size && `button--${size}`,
    className,
    { "button--disabled": isDisabled || isLoading },
    fitContainer && 'fit-container'
  );

  const commonProps = {
    className: buttonClasses,
    onClick: isDisabled || isLoading ? undefined : onClick,
    "aria-disabled": isDisabled || isLoading,
    "aria-busy": isLoading,
    "aria-label": ariaLabel,
  };

  const buttonElement = isLink ? (
    <a
      href={href}
      {...commonProps}
      target={target}
      role="button"
      tabIndex={isDisabled || isLoading ? -1 : 0}
    >
      {buttonContent}
    </a>
  ) : (
    <button
      type={type}
      {...commonProps}
      disabled={isDisabled || isLoading}
    >
      {buttonContent}
    </button>
  );

  return tooltipContent ? (
    <Tooltip content={tooltipContent}>
      {buttonElement}
    </Tooltip>
  ) : buttonElement;
};

export default Button;