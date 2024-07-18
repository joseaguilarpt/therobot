// components/Divider/Divider.tsx
import React from "react";
import classNames from "classnames";
import "./Divider.scss";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  thickness?: string;
  color?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  thickness = "1px",
  color = "rgb(201 201 201)",
  className
}) => {
  return (
    <div
      className={classNames(
        "divider",
        `divider--${orientation}`,
        className
      )}
      style={{
        backgroundColor: color,
        width: orientation === "horizontal" ? "100%" : thickness,
        height: orientation === "vertical" ? "100%" : thickness,
      }}
    />
  );
};

export default Divider;
