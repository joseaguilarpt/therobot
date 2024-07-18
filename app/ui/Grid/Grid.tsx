import React from "react";
import classNames from "classnames";
import "./Grid.scss";

interface GridContainerProps {
  children: React.ReactNode;
  containerClassName?: string;
  direction?: "row" | "column";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  alignContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "space-between"
    | "space-around";
  spacing?: number;
  className?: string;
  backgroundColorClass?: string; // New prop for background color class
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  containerClassName,
  direction = "row",
  justifyContent = "flex-start",
  alignItems = "stretch",
  alignContent = "stretch",
  spacing = 0,
  className,
  backgroundColorClass, // Handle background color class
}) => {
  const containerClasses = classNames(
    "grid-container",
    containerClassName,
    className,
    backgroundColorClass,
    {
      "flex-row": direction === "row",
      "flex-column": direction === "column",
      [`justify-${justifyContent}`]: justifyContent,
      [`align-${alignItems}`]: alignItems,
      [`content-${alignContent}`]: alignContent,
      [`gap-${spacing}`]: spacing > 0, // Apply spacing class if greater than 0
    }
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default GridContainer;
