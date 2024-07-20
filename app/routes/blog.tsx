import React from "react";
import { useTranslation } from "react-i18next";
import { FOOTER } from "~/constants/content";
import Breadcrumb from "~/ui/Breadcrumbs/Breadcrumbs";
import ContentContainer from "~/ui/ContentContainer/ContentContainer";
import Footer from "~/ui/Footer/Footer";
import Navbar from "~/ui/Navbar/Navbar";
import { POPULAR_CONVERSIONS } from "~/utils/conversions";

export default function BlogPage({}) {
  const { t } = useTranslation();
  const footerData = { ...FOOTER };
  footerData.sections = [
    ...footerData.sections,
    {
      title: t("footer.otherTools.heading"),
      links: POPULAR_CONVERSIONS?.slice(0, 7)?.map((item) => ({
        name: t("services.itemTitle", {
          sourceFormat: item.from,
          targetFormat: item.to,
        }),
        url: item.href,
      })),
    },
  ];
  return (
    <>
      <Navbar autoScrolled />
      <main id="main-content">
        <BlogPage />
      </main>
      <Footer
        {...footerData}
        backgroundImageUrl={""}
        socialNetworks={[
          { label: "Facebook", icon: "FaFacebook", href: "#" },
          { label: "Twitter", icon: "FaTwitter", href: "#" },
        ]}
      />
    </>
  );
}
