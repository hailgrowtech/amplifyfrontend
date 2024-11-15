// import React, { useState, useRef, useEffect } from "react";
// import CourseCard from "./CourseCard";
// import { courses } from "../constants";
// import "./CourseList.css";

// const CourseCardsCarousel = () => {
//   const [startX, setStartX] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const carouselRef = useRef(null);

//   const carouselItems = courses.slice(0, 6);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         setCurrentIndex((prevIndex) =>
//           prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
//         );
//       }
//     }, 3000); 

//     return () => clearInterval(intervalId);
//   }, [currentIndex, isHovered, carouselItems.length]);

//   const handleTouchStart = (e) => {
//     setStartX(e.touches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     if (!startX) return;

//     const diff = e.touches[0].clientX - startX;

//     if (diff > 50) {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
//       );
//       setStartX(null);
//     } else if (diff < -50) {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
//       );
//       setStartX(null);
//     }
//   };

//   const handleTouchEnd = () => {
//     setStartX(null);
//   };

//   const handleHover = (hovering) => {
//     setIsHovered(hovering);
//   };

//   return (
//     <div
//       className="carousel-container"
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       ref={carouselRef}
//       onMouseEnter={() => handleHover(true)}
//       onMouseLeave={() => handleHover(false)}
//     >
//       <div className="carousel">
//         <div
//           className="carousel-inner"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//         >
//           {carouselItems.map((item, index) => (
//             <div key={index} className="carousel-slide">
//               <CourseCard courseData={item} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCardsCarousel;

import React, { useState, useRef, useEffect } from "react";
import CourseCard from "./CourseCard";
import { courses } from "../../constants";
import "./CourseList.css";

const CourseCardsCarousel = () => {
  const [startX, setStartX] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);

  const carouselItems = courses.slice(0, 5); // Limiting to 5 items

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) =>
          prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [currentIndex, isHovered, carouselItems.length]);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;

    const diff = e.touches[0].clientX - startX;

    if (diff > 50) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
      );
      setStartX(null);
    } else if (diff < -50) {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
      setStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const handleHover = (hovering) => {
    setIsHovered(hovering);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={carouselRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item, index) => (
            <div key={index} className="carousel-slide">
              <CourseCard courseData={item} />
            </div>
          ))}
        </div>
        <button className="carousel-btn prev" onClick={handlePrev}>
          &lt;
        </button>
        <button className="carousel-btn next" onClick={handleNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CourseCardsCarousel;

