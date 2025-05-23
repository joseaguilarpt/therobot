import React from "react";
import classNames from "classnames";
import "./Heading.scss";

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  appearance?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: string;
  children: React.ReactNode;
  underline?: boolean;
  className?: string;
  align?: "left" | "center" | "right";
  id?: string;
  italic?: boolean;
  type?: 'questrial';
  tabIndex?: number;
}

const Heading: React.FC<HeadingProps> = ({
  level,
  color,
  children,
  appearance = 1,
  underline,
  align,
  className,
  id,
  italic,
  type,
  tabIndex
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={classNames(
        "heading",
        `heading--h${appearance}`,
        color && `heading--${color}`,
        underline && `heading--underline`,
        align && `heading--${align}`,
        italic && 'heading--italic',
        type && `heading--${type}`,
        className
      )}
      id={id}
      tabIndex={tabIndex}
      aria-level={level}
    >
      {children}
    </Tag>
  );
};

export default Heading;