import React, { ReactNode, useEffect } from 'react';

interface ClickOutsideListenerProps {
  onOutsideClick: () => void;
  children: ReactNode;
}

const ClickOutsideListener: React.FC<ClickOutsideListenerProps> = ({ onOutsideClick, children }) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest('.click-outside-ignore')) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick]);

  return <>{children}</>;
};

export default ClickOutsideListener;
