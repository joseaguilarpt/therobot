import React from 'react';
import './ToolTip.scss';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div 
      className="tooltip"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="tooltip__content">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
