import React from 'react';
import './Box.scss';
import classNames from 'classnames';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div className={classNames("box-container", className)}>
      {children}
    </div>
  );
};

export default Box;
