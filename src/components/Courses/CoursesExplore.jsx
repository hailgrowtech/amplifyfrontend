import React from "react";
import styles from "../../style";
import Card from "../Expertise/Profile_Component";
import RecommendCourse from "../Subscription/RecommendCourse";
import CourseCardsCarousel from "../Subscription/CourseCardsCarousel";

const CoursesExplore = () => {
  return (
    <section
      className={`flex md:flex-row flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bg`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 md:px-28 z-10 md:bottom-[10rem]`}
      >
        <section className="w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <span
              className="flex-1 font-inter font-bold md:text-[72px] text-[36px]
      text-gradient md:leading-[88px] leading-[44px] text-center md:mb-8 mb-2 pb-3"
            >
              Your team, <br /> reimagined.
            </span>
          </div>
          <div className="flex flex-row justify-between items-center w-full mb-8">
            <span
              className="flex-1 font-inter font-medium md:text-[18px] text-[12px]
      text-[#FFFFFF] md:leading-[28px] leading-[16px] text-balance text-center"
            >
              Take your team up a level with easy-to-use tools, effortless
              templates and efficient workflows.
            </span>
          </div>
        </section>
        <section>
          <div className="md:flex md:flex-row md:justify-between text-center w-full md:mt-16 mt-10 md:mb-8 mb-1 md:px-[10px]">
            <div className="flex-col-6 font-inter font-bold md:text-[50px] text-[30px] subheading-color md:leading-[50px] leading-[51px] my-auto">
              Course By Expertise
            </div>
            <div className="flex-col-6 font-normal md:text-left text-center my-auto text-dimWhite md:text-[18px] text-[11px] md:leading-[28px] leading-[17px]">
              Unlock the Secrets of Success:{" "}
              <span className="text-white">
                Enroll in Our Strategic Stock Market Expertise Courses.
              </span>
            </div>
          </div>
          <div className="md:block hidden">
            <RecommendCourse />
          </div>
          <div className="md:hidden">
            <CourseCardsCarousel />
          </div>
        </section>
        <section className="similar-interest w-full">
          <div className="mt-16 mb-8 md:text-left text-center">
            <div className="font-inter font-bold md:text-[50px] text-[30px] subheading-gradient md:leading-[50px] leading-[51px] text-white md:mb-6">
              Similar To Your Interest
            </div>
            <div className="font-normal text-dimWhite md:text-[18px] text-[11px] md:leading-[28px] leading-[17px]">
              Empower your teams to build better processes, for a better
              workplace.
            </div>
          </div>
          <div>
            <Card />
          </div>
        </section>
      </div>
    </section>
  );
};

export default CoursesExplore;
