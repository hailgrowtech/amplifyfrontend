import React, { useState, useEffect } from "react";
import ExpertiseCourse from "./ExpertiseCourse";
import { courseExpertise_data } from "../../constants";
import "./CourseList.css";

const CourseCardsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchMoveX, setTouchMoveX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const carouselItems = courseExpertise_data.slice(0, 5);

  useEffect(() => {
    let intervalId;

    const nextSlide = () => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) =>
          prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
      }
    };

    intervalId = setInterval(nextSlide, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, isPaused, carouselItems.length]);

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 1000); // Pause for 1 second before sliding to the next card
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 1000); // Pause for 1 second before sliding to the previous card
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsTouching(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    setTouchMoveX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchMoveX - touchStartX > 50) {
      handlePrevSlide();
    } else if (touchStartX - touchMoveX > 50) {
      handleNextSlide();
    }
    setTouchStartX(0);
    setTouchMoveX(0);
    setIsTouching(false);
    setTimeout(() => setIsPaused(false), 1000); // Resume hover animation after touch end
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="carousel-inner"
          style={{
            transform: `translateX(-${currentIndex * (390 + 1)}px)` // Adjusted the translation to include card width and margin
          }}
        >
          {carouselItems.map((item, index) => (
            <div key={index} className="carousel-slide">
              <ExpertiseCourse courseData={item} />
            </div>
          ))}
        </div>
        <div className="flex gap-[10px] px-[7rem]">
          {courseExpertise_data.map((_, index) => (
            <button
              key={index}
              className={`w-[8px] h-[8px] rounded-[4px] ${
                index === currentIndex
                  ? "bg_three-dots_active"
                  : "bg_three-dots"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default CourseCardsCarousel;
