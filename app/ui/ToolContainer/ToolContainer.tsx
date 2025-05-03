import "./ToolContainer.scss";
import { ReactNode } from "react";

export default function ToolContainer({ children }: { children: ReactNode }) {
  return <div className="tool-container">{children}</div>;
}
