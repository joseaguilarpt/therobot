// TableOfContents.tsx
import React, { useState, useEffect } from 'react';
import './TableOfContents.css';

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC = () => {
  const [toc, setToc] = useState<ToCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6'));
    const tocItems = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));
    setToc(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -40% 0px' }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  return (
    <nav className="toc-container">
      <h2 className="toc-title">Table of Contents</h2>
      <ul className="toc-list">
        {toc.map((item) => (
          <li
            key={item.id}
            className={`toc-item toc-level-${item.level} ${
              activeId === item.id ? 'toc-active' : ''
            }`}
          >
            <a href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;