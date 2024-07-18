// app/components/Icon.tsx
import React from "react";
import * as Icons from "react-icons/fa"; // Import all icons from react-icons/fa
import "./Icon.scss"; // Import the SCSS file

export type IconType = keyof typeof Icons;

interface IconProps {
  icon: IconType; // keyof typeof Icons ensures 'icon' is a valid key in Icons
  size?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge"; // Accept only defined size names
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "white"; // Accept only defined color names
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = "medium",
  color = "primary",
}) => {
  const IconComponent = Icons[icon as IconType]; // Access the specific icon by key

  if (!IconComponent) {
    console.error(`Icon '${icon}' not found`);
    return null;
  }

  return <IconComponent className={`icon icon--${color} icon--${size}`} />;
};

export default Icon;
