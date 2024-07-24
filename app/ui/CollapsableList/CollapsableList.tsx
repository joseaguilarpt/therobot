import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import "./CollapsableList.scss";

import React, { useState } from "react";

interface ListItem {
  title: string;
  content: string;
}

interface CollapsableListProps {
  items: ListItem[];
  initialExpandedIndex?: number;
}

const CollapsableList: React.FC<CollapsableListProps> = ({
  items,
  initialExpandedIndex = -1,
}) => {
  const [expandedIndex, setExpandedIndex] =
    useState<number>(initialExpandedIndex);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="collapsable-list">
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <button
            className={`list-item-header ${
              expandedIndex === index ? "expanded" : ""
            }`}
            onClick={() => toggleItem(index)}
          >
            <Text size="large">{item.title}</Text>
            <span className="toggle-icon">
              {expandedIndex === index ? (
                <Icon icon="keyboard_arrow_down" />
              ) : (
                <Icon icon="keyboard_arrow_right" />
              )}
            </span>
          </button>
          {expandedIndex === index && (
            <div className="list-item-content">
              <Text>{item.content}</Text>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollapsableList;
