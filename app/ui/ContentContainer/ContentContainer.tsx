import React from "react";
import "./ContentContainer.scss";
import classNames from "classnames";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={className} style={{ width: 'inherit', height: 'initial' }}>
      <div className={classNames("content-container")}>{children}</div>
    </div>
  );
};

export default ContentContainer;
