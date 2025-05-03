// app/components/Icon.tsx
import React from "react";
import "./Icon.scss";

export type IconType = string;

interface IconProps {
  icon: IconType;
  size?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge";
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "white";
}

const Icon: React.FC<IconProps> = ({ icon, size = "medium", color = "primary" }) => {
  return (
    <i className={`material-icons icon icon--${color} icon--${size}`}>
      {icon}
    </i>
  );
};

export default Icon;