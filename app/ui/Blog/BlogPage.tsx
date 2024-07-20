import React from "react";
import ContentContainer from "../ContentContainer/ContentContainer";
import Breadcrumb from "../Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  return (
    <div className="blog-page-container">
      <ContentContainer>
        <Breadcrumb
          paths={[
            {
              label: t("home"),
              icon: "FaHome",
              href: `/${i18n.language ?? ""}`,
            },
          ]}
        />
        hola
      </ContentContainer>
    </div>
  );
}
