import React, { useState, useEffect, useRef } from "react";
import "./Image.scss";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface ImageProps {
  src: string;
  alt: string;
  imageLoading?: 'lazy' | 'eager';
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt, imageLoading = 'eager' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const ref = useRef<HTMLImageElement>(null);

  const handleImageError = () => {
    setLoadError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="image">
      <img
        ref={ref}
        className="image__img"
        src={src}
        alt={alt}
        loading={imageLoading}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {isLoading && (
        <div className="image__loading">
          <LoadingSpinner size="large" />
        </div>
      )}
      {loadError && <div className="image__fallback">Failed to load image</div>}
    </div>
  );
};

export default ImageComponent;
