// Breadcrumb.tsx

import React from "react";
import "./Breadcrumbs.scss";
import { Link } from "@remix-run/react";
import Icon from "../Icon/Icon";

export interface BreadcrumbProps {
  paths: BreadcrumbPath[];
}

interface BreadcrumbPath {
  label: string;
  href?: string;
  icon?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb__list">
        {paths.map((path, index) => (
          <li key={index} className="breadcrumb__item">
            {path.href ? (
              <Link to={path.href} className="breadcrumb__link">
                {path.icon && <span className="u-pr1">
                  <Icon size="small" icon={path.icon} />
                </span>}
                {path.label}
              </Link>
            ) : (
              <span className="breadcrumb__label">{path.label}</span>
            )}
            {index !== paths.length - 1 && (
              <span className="breadcrumb__label u-pl1"> / </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
