import React, { useState, useEffect } from "react";
import StockPlatform from "./StockPlatform";
import ExpertiseCourse from "./ExpertiseCourse";
import { courseExpertise_data } from "../../constants";
import "./CourseList.css";
import CourseCardsCarousel from "./CourseCardsCarousel";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* <div className="md:flex md:flex-row md:justify-between text-center w-full md:mt-16 mt-10 md:mb-8 mb-1 md:px-[10px]">
        <div className="flex-col-6 font-inter font-bold md:text-[50px] text-[30px] subheading-color md:leading-[50px] leading-[51px] md:mb-6">
          Course By Expertise
        </div>
        <span className="md:w-[600px] md:h-[56px] w-[328px] h-[34px] font-[400] md:text-[18px] text-[12px] md:leading-[28px] leading-[17px] text-dimWhite sm:text-start text-center">
          Unlock the Secrets of Success:{" "}
          <span className="text-lightWhite">
            Enroll in Our Strategic Stock Market Expertise Courses.
          </span>
        </span>
      </div>

      <div>
        {isSmallScreen ? (
          <div className="md:hidden flex">
            {courseExpertise_data.map((course, index) => (
              <CourseCardsCarousel key={index} courseData={course} />
            ))}
          </div>
        ) : (
          <div className="md:flex hidden flex-wrap justify-center courseCard">
            {courseExpertise_data.map((course, index) => (
              <ExpertiseCourse key={index} courseData={course} />
            ))}
          </div>
        )}
      </div>

      <button className="md:w-[147px] md:h-[40px] hidden md:flex items-center justify-center flex w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px] mx-[34rem]">
        Explore More
      </button> */}

      {/* <StockPlatform /> */}
    </>
  );
};
export default CourseList;
