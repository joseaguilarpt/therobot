import React from "react";
import classNames from "classnames";
import "./GridItem.scss";
import FadeInComponent from "../FadeIn/FadeIn";

interface GridItemProps {
  children: React.ReactNode;
  id?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
  className?: string;
  animation?: string;
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
}

const GridItem: React.FC<GridItemProps> = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  className,
  spacing,
  animation,
  justifyContent,
  alignItems,
  id
}) => {
  const itemClasses = classNames("grid-item", className, {
    [`grid-item--xs-${xs}`]: xs !== undefined,
    [`grid-item--sm-${sm}`]: sm !== undefined,
    [`grid-item--md-${md}`]: md !== undefined,
    [`grid-item--lg-${lg}`]: lg !== undefined,
    [`grid-item--xl-${xl}`]: xl !== undefined,
    [`justify-${justifyContent}`]: justifyContent,
    [`align-${alignItems}`]: alignItems,
  });

  if (animation) {
    return (
      <div  id={id} className={itemClasses} style={{ gap: spacing }}>
        <FadeInComponent className="max-height" animation={animation}>{children}</FadeInComponent>
      </div>
    );
  }

  return (
    <div id={id} className={itemClasses} style={{ gap: spacing }}>
      {children}
    </div>
  );
};

export default GridItem;
