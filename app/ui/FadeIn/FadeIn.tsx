import React from 'react';
import useIntersectionObserver from '../../utils/useIntersectionObserver';
import './FadeIn.scss';

interface FadeInComponentProps {
  children: React.ReactNode;
  animation?: string; // The class to apply for the animation
  className?: string; // Additional class names to apply
}

const FadeInComponent: React.FC<FadeInComponentProps> = ({
  children,
  animation = 'fade-in', // Default to fade-in animation
  className = '', // Default to an empty string if not provided
}) => {
  const [show, setShow] = React.useState(true);
  const { containerRef, isVisible } = useIntersectionObserver({
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1, // 10% of the element is visible
  });

  React.useEffect(() => {
    setShow(false);
  }, []);

  React.useEffect(() => {
    if (isVisible && !show) {
      setShow(true);
    }
  }, [isVisible, show]);

  return (
    <div
      ref={containerRef}
      className={`${animation} ${show ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default FadeInComponent;
