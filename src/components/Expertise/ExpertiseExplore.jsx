import React from "react";
import styles from "../../style";
import Card from "./Profile_Component";
import { useUserData } from "../../constants/context";

const ExpertiseExplore = ({ token }) => {
  const userData = useUserData();

  return (
    <section
      className={`flex md:flex-row flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bgn`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 md:px-28 z-10 md:bottom-[10rem]`}
      >
        <section className="w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <span
              className="flex-1 font-inter font-bold md:text-[72px] text-[36px]
      text-gray-900 md:leading-[78px] leading-[44px] text-center md:mb-8 mb-2 pb-3"
            >
              Analyst Expertise Across <br /> Market Segments
            </span>
          </div>
          <div className="flex flex-row justify-between items-center w-full mb-8">
            <span
              className="flex-1 font-inter font-medium md:text-[18px] text-[12px]
      text-gray-700 md:leading-[28px] leading-[16px] text-center"
            >
              Meet our team of SEBI Registered experts, dedicated to providing
              you with valuable insights and strategies to navigate the markets
              with confidence and success.
            </span>
          </div>
        </section>
        <section className="top-expertise w-full">
          <div className="mt-16 mb-8 md:text-left text-center">
            <div className="font-inter font-bold md:text-[50px] text-[30px] md:leading-[50px] leading-[51px] text-gray-900 md:mb-6">
              Top Expertise
            </div>
            <div className="font-normal text-gray-700 md:text-[18px] text-[11px] md:leading-[28px] leading-[17px]">
              Gain an edge in the market with our finest SEBI Registered experts
              for unparalleled trading guidance.
            </div>
          </div>
          <div>
            <Card token={token} userData={userData} />
          </div>
        </section>
        <section className="similar-interest w-full">
          <div className="mt-16 mb-8 md:text-left text-center">
            <div className="font-inter font-bold md:text-[50px] text-[30px] md:leading-[50px] leading-[51px] text-gray-900 md:mb-6">
              Similar To Your Interest
            </div>
            <div className="font-normal text-gray-700 md:text-[18px] text-[11px] md:leading-[28px] leading-[17px]">
              Empower your teams to build better processes, for a better
              workplace.
            </div>
          </div>
          <div>
            <Card token={token} userData={userData} />
          </div>
        </section>
      </div>
    </section>
  );
};

export default ExpertiseExplore;
