import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "@remix-run/react";
import InputSelect from "../InputSelect/InputSelect";
import classNames from "classnames";

type Tool = {
  id: number;
  value: string;
  label: string;
};

const ToolSelector = ({ keepScrolled }: { keepScrolled?: boolean }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const { t } = useTranslation();

  const tools: Tool[] = [
    {
      id: 12,
      value: "jpeg/png",
      label: t("services.itemTitle", {
        sourceFormat: "JPEG",
        targetFormat: "PNG",
      }),
    },
    {
      id: 22,
      value: "png/webp",
      label: t("services.itemTitle", {
        sourceFormat: "PNG",
        targetFormat: "WEBP",
      }),
    },
    {
      id: 32,
      value: "jpeg/webp",
      label: t("services.itemTitle", {
        sourceFormat: "JPEG",
        targetFormat: "WEBP",
      }),
    },
    {
      id: 42,
      value: "jpeg/pdf",
      label: t("services.itemTitle", {
        sourceFormat: "JPEG",
        targetFormat: "PDF",
      }),
    },
    {
      id: 52,
      value: "png/svg",
      label: t("services.itemTitle", {
        sourceFormat: "PNG",
        targetFormat: "SVG",
      }),
    },
    {
      id: 62,
      value: "tiff/webp",
      label: t("services.itemTitle", {
        sourceFormat: "TIFF",
        targetFormat: "WEBP",
      }),
    },
    {
      id: 72,
      value: "jpeg/gif",
      label: t("services.itemTitle", {
        sourceFormat: "JPEG",
        targetFormat: "GIF",
      }),
    },
  ];

  const [currentTool, setCurrentTool] = useState('');

  useEffect(() => {
    const selection = `${params.sourceFormat}/${params.targetFormat}`;
    if (tools.find((item) => item.value === selection)) {
        setCurrentTool(selection)
    }
  }, [params?.sourceFormat, params?.targetFormat]);

  const changeTool = (langCode: string) => {
    const newPath = `/${i18n.language}/convert/${langCode}`;
    window.location.href = newPath;
  };

  return (
    <InputSelect
      options={tools}
      className={classNames("navbar__select", keepScrolled && "--contrast")}
      label={t("nav.topTools")}
      placeholder={t("nav.topTools")}
      initialValue={currentTool}
      onSelect={changeTool}
    />
  );
};

export default ToolSelector;
