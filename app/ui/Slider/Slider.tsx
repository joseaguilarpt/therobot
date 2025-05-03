import React, { useRef, useState, useEffect, Children, ReactNode } from "react";
import "./Slider.scss";
import Card from "../Card/Card";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import RatingStar from "../RatingStar/RatingStar";
import { useTranslation } from "react-i18next";

interface Slide {
  imageUrl?: string;
  title: string;
  content?: string;
  rating?: string;
  custom?: ReactNode;
}

interface SliderProps {
  slides: Slide[];
  slidesToShow: number; // Number of slides to show at a time
  autoSlideInterval?: number; // Interval for automatic sliding in milliseconds
}

const Slider: React.FC<SliderProps> = ({
  slides,
  slidesToShow,
  autoSlideInterval = 15000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedSlidesToShow, setUpdatedSlidesToShow] = useState(slidesToShow);
  const slideRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < slides.length - slidesToShow) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [currentIndex, slides.length, slidesToShow, autoSlideInterval]);

  const nextSlide = () => {
    if (currentIndex < slides.length - slidesToShow) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const size = typeof window !== "undefined" ? window.innerWidth : null;

  React.useEffect(() => {
    if (size) {
      if (size > 992){
        setUpdatedSlidesToShow(slidesToShow);
        setCurrentIndex(0);
      }
      else if (size >= 768 && size <= 992) {
        setUpdatedSlidesToShow(slidesToShow > 2 ? 2 : slidesToShow);
        setCurrentIndex(0);
      } else {
        setUpdatedSlidesToShow(1);
        setCurrentIndex(0);
      }
    }
  }, [size]);

  const slideWidth = 100 / updatedSlidesToShow;

  const translateValue = -currentIndex * slideWidth;

  const sliderStyles = {
    transform: `translateX(${translateValue}%)`,
    transition: "transform 0.5s ease",
  };

  return (
    <div className="slider__container">
      <div className="slider__button-left">
        <Button onClick={prevSlide} appareance="link">
          <Icon icon="FaArrowLeft" />
        </Button>
      </div>
      <div className="slider">
        <div className="slider__wrapper" style={sliderStyles} ref={slideRef}>
          {slides.map((slide, index) => (
            <div
              id={slide.title}
              key={index}
              className={`slider__slide slider__slide--${slidesToShow}`}
            >
              {slide.custom && slide.custom}
              {!slide.custom && (
                <Card shadow className="slider__card">
                  <GridContainer alignItems="flex-start">
                    {slide.imageUrl && (
                      <GridItem xs={3}>
                        <div className="slider__image">
                          <img src={t(slide.imageUrl)} alt={t(slide.title)} />
                        </div>
                      </GridItem>
                    )}
                    <GridItem xs={8} className="u-pb2">
                      <Heading appearance={6} level={6}>
                        {t(slide.title)}
                      </Heading>
                      {slide.rating && (
                        <div className="">
                          <RatingStar initialRating={t(slide.rating)} />
                        </div>
                      )}
                      {slide.content && (
                        <div className="u-pb2">
                          <Text fontStyle="italic">{t(slide.content)}</Text>
                        </div>
                      )}
                    </GridItem>
                  </GridContainer>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="slider__button-right">
        <Button onClick={nextSlide} appareance="link">
          <Icon icon="FaArrowRight" />
        </Button>
      </div>
    </div>
  );
};

export default Slider;
