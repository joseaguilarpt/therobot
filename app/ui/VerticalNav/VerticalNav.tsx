import React, { useState } from 'react';
import classNames from 'classnames';
import './VerticalNav.scss';

export interface VerticalNavItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

export interface VerticalNavProps {
  items: VerticalNavItem[];
  defaultActiveIndex?: number;
  onItemSelect?: (index: number) => void;
  className?: string;
}

const VerticalNav: React.FC<VerticalNavProps> = ({
  items,
  defaultActiveIndex = 0,
  onItemSelect,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    if (onItemSelect) {
      onItemSelect(index);
    }
  };

  React.useEffect(() => {
    if (defaultActiveIndex) {
      setActiveIndex(defaultActiveIndex)
    }
  }, [defaultActiveIndex])

  return (
    <nav className={classNames('vertical-nav', className)}>
      <ul className="vertical-nav__list">
        {items.map((item, index) => (
          <li
            key={index}
            className={classNames('vertical-nav__item', {
              'vertical-nav__item--active': index === activeIndex
            })}
            onClick={() => handleItemClick(index)}
          >
            {item.icon && <span className="vertical-nav__icon">{item.icon}</span>}
            <a href={item.link} className="vertical-nav__link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default VerticalNav;
