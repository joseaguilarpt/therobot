import "./ToolContainer.scss";
import React, { ReactNode } from "react";

export default function ToolContainer({ children }: { children: ReactNode }) {
  return <div className="tool-container">{children}</div>;
}
