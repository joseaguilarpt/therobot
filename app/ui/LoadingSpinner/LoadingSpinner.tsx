import React from "react";
import classNames from "classnames";
import "./LoadingSpinner.scss";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "tertiary";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "primary",
  className,
}) => {
  const spinnerClass = classNames(
    "loading-spinner",
    `loading-spinner--${size}`,
    `loading-spinner--${color}`,
    className
  );

  return (
    <div className={spinnerClass}>
      <div className="loading-spinner__circle" />
    </div>
  );
};

export default LoadingSpinner;
