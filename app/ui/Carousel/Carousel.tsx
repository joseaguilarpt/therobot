import "./Carousel.scss";

import Button from "../Button/Button";
import FadeInComponent from "../FadeIn/FadeIn";
import Heading, { HeadingProps } from "../Heading/Heading";
import Icon from "../Icon/Icon";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Breadcrumb, { BreadcrumbProps } from "../Breadcrumbs/Breadcrumbs";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export interface CarouselSlide {
  title?: string;
  titleSize?: HeadingProps['appearance'];
  hideUnderline?: boolean;
  description?: string;
  backgroundImage: string;
  buttonText?: string;
  buttonLink?: string;
  href?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  interval?: number;
  hideArrows?: boolean;
  breadcrumbs?: BreadcrumbProps['paths'];
  className?: string;
  children?: ReactNode;
  animation?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  interval = 10000,
  hideArrows,
  breadcrumbs,
  className = '',
  children,
  animation = 'fade-in'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const startAutoScroll = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
  };

  const stopAutoScroll = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [interval, slides.length]);


  return (
    <div className={classNames("carousel", className)}>
      <div
        className="carousel__inner"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel__slide ${
              index === currentSlide ? "carousel__slide--active" : ""
            }`}
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          >
            <div className="carousel__overlay">
              <FadeInComponent animation={animation}>
                <div className="carousel__content">
                  {slide.title && <Heading appearance={slide.titleSize} level={2} underline={slide.hideUnderline ? false : true}>
                    {t(slide.title)}
                  </Heading>}
                  {slide.description && (
                    <p className="carousel__description">
                      {t(slide.description)}
                    </p>
                  )}
                  {slide.href && slide.buttonText && (
                    <Button href={slide.href} appareance="primary">
                      {t(slide.buttonText)}
                    </Button>
                  )}
                  {breadcrumbs && (
                    <div className="u-pt5">
                      <Breadcrumb paths={breadcrumbs} />
                    </div>
                  )}
                  {children && children}
                </div>
              </FadeInComponent>
            </div>
          </div>
        ))}
      </div>
      {!hideArrows && (
        <div className="carousel__controls">
          <button
            className="carousel__control carousel__control--prev"
            onClick={goToPrevSlide}
          >
            <Icon icon="FaArrowLeft" color="white" />
          </button>
          <button
            className="carousel__control carousel__control--next"
            onClick={goToNextSlide}
          >
            <Icon icon="FaArrowRight" color="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
