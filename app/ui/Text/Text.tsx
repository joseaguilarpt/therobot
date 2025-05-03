import React from "react";
import classNames from "classnames";
import "./Text.scss";

interface TextProps {
  className?: string;
  id?: string;
  size?: "smaller" | "small" | "medium" | "large";
  color?: "primary" | "secondary" | "tertiary" | "contrast";
  children: React.ReactNode;
  role?: string;
  textWeight?: "bold" | "normal" | "semi-bold";
  transform?: 'capitalize' | 'uppercase' | 'lowercase';
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
  id,
  role,
  transform,
  fontStyle = "normal",
  textDecoration = "none",
  className
}) => {
  return (
    <p
      
      id={id}
      role={role}
      className={classNames(
        "text",
        `text--${size}`,
        `text--${color}`,
        `text--${textWeight}`,
        `text--${align}`,
        `text--${transform}`,
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
