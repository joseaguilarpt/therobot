import React, { useState, useEffect, useRef } from "react";
import "./ImageSlider.scss";
import Image from "../Image/Image";
import Button from "../Button/Button";
import classNames from "classnames";

interface ImageSliderProps {
  images: string[];
  autoSlideInterval?: number;
  initialValue?: number;
  showTotal?: boolean;
  onSelectSlider?: (v: number) => void;
  onTotalClick?: (v: number) => void;
  defaultBackgroundColor?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoSlideInterval = 310000,
  initialValue = 0,
  showTotal = false,
  onSelectSlider,
  onTotalClick = () => {},
  defaultBackgroundColor = "#f0f0f0", // Default background color if not provided
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  let startX = 0;
  let isDragging = false;

  // Update currentIndex when initialValue changes
  useEffect(() => {
    setCurrentIndex(initialValue);
  }, [initialValue]);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Function to go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle mouse down and touch start
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging = true;
    startX = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  // Handle mouse move and touch move
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;

    if (deltaX > 50) {
      prevSlide();
      isDragging = false;
    } else if (deltaX < -50) {
      nextSlide();
      isDragging = false;
    }
  };

  // Handle mouse up and touch end
  const handleEnd = () => {
    isDragging = false;
  };

  const handleClick = (v: number) => {
    if (onSelectSlider) {
      onSelectSlider(v);
    }
  };

  // Set up event listeners for drag events
  useEffect(() => {
    const slider = sliderRef.current;

    if (slider) {
      slider.addEventListener("mousedown", handleStart);
      slider.addEventListener("mousemove", handleMove);
      slider.addEventListener("mouseup", handleEnd);
      slider.addEventListener("mouseleave", handleEnd);
      slider.addEventListener("touchstart", handleStart);
      slider.addEventListener("touchmove", handleMove);
      slider.addEventListener("touchend", handleEnd);
    }

    return () => {
      if (slider) {
        slider.removeEventListener("mousedown", handleStart);
        slider.removeEventListener("mousemove", handleMove);
        slider.removeEventListener("mouseup", handleEnd);
        slider.removeEventListener("mouseleave", handleEnd);
        slider.removeEventListener("touchstart", handleStart);
        slider.removeEventListener("touchmove", handleMove);
        slider.removeEventListener("touchend", handleEnd);
      }
    };
  }, []);

  // Automatic slide change interval
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, autoSlideInterval);

    return () => {
      clearInterval(slideInterval);
    };
  }, [currentIndex, autoSlideInterval]);

  return (
    <div
      className="image-slider"
      ref={sliderRef}
      style={{ backgroundColor: defaultBackgroundColor }}
    >
      <div
        className="slides"
        style={{ transform: `translateX(${-currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            onClick={() => handleClick(index)}
            className="slides__image-item"
            key={index}
          >
            {currentIndex === index && (
              <div
                className="slides__image-img"
                aria-label={`Car image ${index}`}
                style={{ backgroundImage: `url(${image})` }}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div
        className={classNames("image-slider__number", showTotal && "--show")}
      >
        <Button
          onClick={() => onTotalClick(currentIndex)}
          leftIcon="FaPhotoVideo"
          size="small"
        >
          {images.length} Fotos
        </Button>
      </div>
      <button className="prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="next" onClick={nextSlide}>
        &#10095;
      </button>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              goToSlide(index);
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
