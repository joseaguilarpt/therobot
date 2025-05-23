import React from "react";
import "./Box.scss";
import classNames from "classnames";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div data-testid="box" className={classNames("box-container", className)}>
      {children}
    </div>
  );
};

export default Box;
