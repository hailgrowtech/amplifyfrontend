import React, { useState, useRef, useEffect } from "react";
import { continueCoursesData } from "../../constants";
import starImage from "../../assets/Stars Minimalistic.png";
import telegramImage from "../../assets/telegram.png";
import { arrow } from "../../assets";

const ContinueCardsCarousel = () => {
  const [startX, setStartX] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);

  const carouselItems = continueCoursesData.slice(0, 3);

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

  return (
    <div
      className="flex items-center justify-center mt-[20px]"
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
          {carouselItems.map((item) => (
            <div key={item.title} className="carousel-slide">
              <div className="w-full md:w-1/3 p-3 rounded-md mb-8 md:mb-0">
                <div className="w-full overflow-hidden relative rounded-lg bg-[#18181ba6] border border-solid border-[#f4f4f51d]">
                  <img
                    src={item.imageUrl}
                    alt="Course_Image"
                    className="w-full h-60 object-cover rounded-md"
                    style={{
                      maskImage:
                        "linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)",
                    }}
                  />
                  <div className="absolute top-0 right-0 m-2 flex items-center justify-center rounded-full bg-opacity-50 text-white">
                    <img
                      src={starImage}
                      alt="Star"
                      className="w-4 h-4 mr-1"
                    />
                    <span className="mr-1">4.4</span>
                  </div>

                  <div className="px-4">
                    <div className="mt-4 custom-progress-bar">
                      <div className="progress"></div>
                    </div>
                  </div>

                  <div className="p-4 relative z-10">
                    <h3 className="text-2xl text-left">{item.title}</h3>
                    <div className="flex items-center mt-4">
                      <div className="flex-1 flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                          <img
                            src={item.image}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-dimWhite">
                          {item.instructor}
                        </p>
                        <div className="flex-1 flex justify-end">
                          <span className="join-Telegram flex text-dimWhite">
                            Join <img src={telegramImage} alt="Telegram" className="w-4 h-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-white mt-2 pt-1 flex justify-center">
                      <div className="border-r border-white px-[80px] text-center">
                        <p className="mb-1 text-[#eeeef8cc]">Experience</p>
                        <p>{item.experience}+</p>
                      </div>
                      <div className="px-[80px] text-center">
                        <p className="mb-1 text-dimWhite">Followers</p>
                        <p>{item.followers}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-3 flex justify-between">
                      <div className="pl-1">
                        <p className="mb-1 text-dimWhite">
                          Duration: <span className="text-white">{item.duration}</span>{" "}
                        </p>
                      </div>
                      <div className="px-4">
                        <p className="mb-1 text-dimWhite text-right">
                          Session: <span className="text-white">{item.session}</span>
                        </p>
                      </div>
                    </div>
                    <div className="pl-1">
                      <p className="mb-1 text-dimWhite">
                        Completed Session: <span className="text-white">{item.completedSession}</span>{" "}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 flex justify-center items-center">
                      <button className="bg-transparent border rounded-3xl border-[#ffffff6b] text-base text-white py-2 px-8 flex items-center">
                        Continue Course
                        <div className="w-5 h-5">
                        <img src={arrow} alt="" className='w-5' style={{ marginLeft: '5px' }} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContinueCardsCarousel;