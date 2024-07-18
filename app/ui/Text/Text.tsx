import React from "react";
import classNames from "classnames";
import "./Text.scss";

interface TextProps {
  className?: string;
  size?: "smaller" | "small" | "medium" | "large";
  color?: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
  textWeight?: "bold" | "normal" | "semi-bold";
  align?: "left" | "center" | "right";
  fontStyle?: "normal" | "italic" | "oblique";
  textDecoration?: "none" | "underline" | "overline" | "line-through";
}

const Text: React.FC<TextProps> = ({
  size = "medium",
  color = "primary",
  children,
  textWeight = "normal",
  align = "left",
  fontStyle = "normal",
  textDecoration = "none",
  className
}) => {
  return (
    <p
      className={classNames(
        "text",
        `text--${size}`,
        `text--${color}`,
        `text--${textWeight}`,
        `text--${align}`,
        className && className,
        {
          [`text--${fontStyle}`]: fontStyle !== "normal",
          [`text--${textDecoration}`]: textDecoration !== "none",
        }
      )}
    >
      {children}
    </p>
  );
};

export default Text;
