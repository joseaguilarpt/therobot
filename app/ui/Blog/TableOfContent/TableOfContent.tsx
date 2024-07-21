// TableOfContents.tsx
import React from "react";
import "./TableOfContent.scss";
import { Link } from "@remix-run/react";
import Text from "~/ui/Text/Text";
import Heading from "~/ui/Heading/Heading";
import { useTranslation } from "react-i18next";

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: ToCItem[];
  enumerate?: boolean;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  enumerate,
}) => {
  const { t } = useTranslation();
  return (
    <nav className="toc-container">
      <Heading level={3} appearance={4} className="toc-title">
        {t('blog.table')}
      </Heading>
      <ul className="toc-list">
        {items?.map((item, index) => (
          <li key={item.id} className={`toc-item toc-level-${item.level}`}>
            <Link to={`#${item.id}`}>
              <Text textWeight="bold">
                {enumerate && (
                  <>
                    {index + 1}
                    {") "}
                  </>
                )}
                {item.text}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
