// src/components/ThumbnailSlider.js

import React from "react";
import "./ThumbnailSlider.scss";
import ImageComponent from "../Image/Image";

const ThumbnailSlider = ({ images, onSelect }) => {
  return (
    <div className="thumbnail-slider">
      <ul className="thumbnail-slider__list">
        {images.map((image, index) => (
          <li key={index} className="thumbnail-slider__item">
            <div
              onClick={() => onSelect(index)}
              className="thumbnail-slider__image-container"
            >
              <ImageComponent
                src={image}
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThumbnailSlider;
