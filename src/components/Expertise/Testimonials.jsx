import React, { useState, useEffect } from "react";
import { testimonialLeft, testimonialRight } from "../../assets";
import { testimonialsData } from "../../constants";

const Testimonials = () => {

  const [activeDot, setActiveDot] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setActiveDot(count);
  }, [count]);
  
  const handdlePrevious = () => {
    if (count === 0) {
      setCount(testimonialsData.length - 1);
    } else {
      setCount(count - 1);
    }
  };
  const handleNext = () => {
    if (count === testimonialsData.length - 1) {
      setCount(0);
    } else {
      setCount(count + 1);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center sm:py-[1rem] py-6">
      <div className="flex justify-between md:gap-[6rem] gap-0 items-center">
        <button onClick={handdlePrevious}>
          <img
            src={testimonialLeft}
            alt="LeftIcon"
            className="md:w-[58px] md:h-[58px] w-[44px] h-[44px]"
          />
        </button>
        <div className="flex-grow flex flex-col justify-center gap-[4rem] items-center">
          <div className="flex flex-col justify-center items-center text-white">
            <span className="md:w-[678px] md:h-[343px] w-[283px] h-[262px] font-[400] md:text-[26px] text-[14px] md:leading-[44px] leading-[23px] text-lightWhite text-center flex mb-4 items-center">
              {testimonialsData[count].text}
            </span>
            <div className="flex flex-col md:w-[252px] w-[150px] md:h-[56px] h-[30px] justify-center items-center">
              <div className="flex flex-row gap-[10px]">
                <img
                  src={testimonialsData[count].image}
                  alt="OUR_USERS"
                  className="md:w-[40px] w-[27px] md:h-[40px] h-[27px]"
                />
                <div className="flex flex-col">
                  <span className="md:h-[25px] h-[13px] font-[700] md:text-[18px] text-[10px] md:leading-[23px] leading-[12px] text-lightWhite">
                    {testimonialsData[count].author}
                  </span>
                  <span className="md:h-[19px] h-[10px] font-[300] md:text-[14px] text-[8px] md:leading-[18.4px] leading-[10px] text-dimWhite">
                    {testimonialsData[count].designation}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-[6px] mt-[1rem]">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  className={`w-[8px] h-[8px] rounded-[4px] ${
                    index === activeDot
                      ? "bg_three-dots_active"
                      : "bg_three-dots"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleNext}>
          <img
            src={testimonialRight}
            alt="RightIcon"
            className="md:w-[58px] md:h-[58px] w-[44px] h-[44px]"
          />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;