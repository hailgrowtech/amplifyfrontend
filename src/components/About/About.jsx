import React, { useState, useEffect } from "react";
import styles from "../../style";
import { about_us } from "../../assets";
import { mission_vision, aboutUs_data, faq_data } from "../../constants";
import Testimonials from "../Home/Testimonials";
import { Link } from "react-router-dom";

const About = () => {
  const [expandedId, setExpandedId] = useState(1);

  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleAccordion = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className={`flex md:flex-col flex-col ${styles.paddingY} md:px-[7rem] px-[16px] bg-white`}>
      <div className="flex flex-col md:gap-[2rem] gap-[1rem]">
        <div className="flex md:flex-row items-center flex-col justify-center gap-[1rem]">
          <div className={`flex-col text-center md:gap-[2rem] gap-0`}>
            <div className="flex flex-col justify-between items-center">
              <span className="font-inter font-[700] md:text-[72px] text-[36px] text-black md:leading-[84px] leading-[48px]">
                Invest, Learn and Earn
              </span>

              <p className="md:w-[702px] md:h-[56px] w-[341px] h-[32px] font-inter font-[500] mt-4 text-gray-700 md:text-[18px] text-[14px] md:leading-[28px] leading-[16px]">
                Get partnered with our SEBI Registered Research Analysts to
                start your profitable trading journey.
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-center items-center md:mt-[0rem] mt-[-1rem]">
          <img
            src={about_us}
            alt="About_Us"
            className="md:w-[596px] md:h-[320px] w-[325px] h-[185px]"
          />
          <div className="md:w-[570px] md:h-[196px] flex flex-col justify-center items-center text-start">
            <span className="md:w-[570px] md:h-[72px] w-[380px] h-[30px] font-inter font-[600] md:text-[30px] md:text-[16px] text-[18px] text-black md:leading-[36px] leading-[20px] md:px-0 md:px-[8px] px-[20px]">
              WELCOME TO COPARTNER
            </span>
            <span className="md:w-[570px] md:h-[144px] w-[380px] h-[180px] font-inter font-[500] md:text-[16px] text-[14px] text-gray-700 md:leading-[24px] leading-[21px] md:px-0 md:px-[8px] px-[20px]">
              Welcome to Copartner, where traders and analysts unite to redefine
              the stock market experience. Whether you're a new trader seeking
              expert insights or an analyst looking to showcase your expertise,
              our platform is your gateway to success. Join our vibrant
              community, where collaboration, knowledge sharing and financial
              growth thrive. Get ready to embark on a journey of discovery,
              empowerment and endless possibilities.
            </span>
          </div>
        </div>

        <div className="flex flex-col md:gap-[2rem] md:py-[2rem] md:mt-0 mt-[2rem] md:px-0 px-2">
          <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
            <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
              <span
                className="font-inter font-[700] md:text-[50px] text-[30px]
                    text-black leading-[51px]"
              >
                Mission & Vision
              </span>
            </div>

            <span className="md:w-[1190px] md:h-[56px] w-[328px] h-[95px] font-[400] md:text-[18px] text-[14px] md:leading-[28px] leading-[20px] text-gray-700 text-start">
              We're dedicated to helping traders and analysts succeed through
              our platform, while also aiming to transform the stock market
              landscape by creating a supportive community focused on sharing
              knowledge and achieving financial goals.
            </span>
          </div>

          <div className="flex flex-col md:gap-0 gap-4 md:py-0 py-[2rem]">
            {mission_vision.map((mission) => {
              return (
                <div
                  key={mission.id}
                  className={`md:w-[1180px] md:h-[500px] flex`}
                >
                  <div
                    className={`flex items-center gap-[1rem] ${
                      mission.id % 2 === 0
                        ? "md:flex-row-reverse"
                        : "md:flex-row"
                    } flex-col`}
                  >
                    <img
                      src={mission.image}
                      alt="MISSION_IMAGE"
                      className="md:w-[505px] md:h-[450px] w-[340px] h-[240px]"
                    />
                    <div className="w-[1px] h-[180px] bg-gray-200 md:flex hidden"></div>
                    <div className="flex flex-col md:px-[1rem] text-start gap-2">
                      <span className="font-inter font-[500] md:text-[32px] text-[24px] text-black md:leading-[48px] leading-[24px] md:px-0 px-2">
                        {mission.title}
                      </span>
                      <span className=" font-inter font-[400] md:text-[15px] text-[14px] text-gray-700 md:leading-[28px] leading-[20px] md:px-0 px-[10px]">
                        {mission.des}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:px-0 sm:px-4">
          <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
            <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
              <span
                className="font-inter font-[700] md:text-[50px] text-[30px]
                    text-black leading-[51px]"
              >
                Features
              </span>
            </div>

            <p
              className="font-inter md:w-[1136px] md:h-[28px] w-[328px] h-[34px] font-[400] text-gray-700 sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px]
                 leading-[16px] sm:text-start mt-2 text-center"
            >
              Dive into the expertise of our SEBI registered research analysts.
            </p>
          </div>

          <div className="md:w-[1076px] md:max-h-[580px] sm:w-[337px] md:gap-[5rem] gap-[1rem] flex flex-col sm:flex-row md:mt-[3rem] md:py-0 py-[2rem] mx-auto">
            {aboutUs_data.map((aboutus) => (
              <div
                key={aboutus.id}
                className="flex flex-col gap-[1rem] py-[8px] items-center md:w-[337px] max-h-full rounded-[11px] hover:bg-gray-100 hover:opacity[50%] transition duration-150 ease-in-out"
              >
                <img
                  src={aboutus.img}
                  alt="STOCK_IMAGES"
                  className="md:w-[289px] w-[288px] h-[150px]"
                />
                <div className="flex flex-col md:gap-[0.5rem]">
                  <span className="text-black md:w-[190px] w-[164px] font-[600] md:text-[20px] text-[18px] md:leading-[27px] md:text-left">
                    {aboutus.title}
                  </span>
                  <span className="text-gray-700 w-[257px] max-h-full md:text-[16px] text-[14px] font-[400] md:leading-[24px] md:text-left">
                    {aboutus.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex md:pt-[4rem] flex-col justify-center">
          <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
            <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
              <span
                className="font-inter font-[700] md:text-[50px] text-[30px]
                    text-black leading-[51px]"
              >
                FAQs
              </span>
            </div>

            <p
              className="font-inter md:w-[1136px] md:h-[28px] w-[328px] h-[34px] font-[400] text-gray-700 sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px]
                 leading-[16px] sm:text-start mt-2 text-center"
            >
              Frequently Asked Questions
            </p>
          </div>

          {smallScreen ? (
            <div className="grid grid-cols-1 md:mt-8 mt-4 gap-4 px-[8px]">
              {faq_data.map((faq) => (
                <div
                  key={faq.id}
                  className="flex flex-col border py-6 gap-4 border-solid border-gray-300 p-4 items-center rounded-md"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="text-black font-semibold text-lg outline-none focus:outline-none"
                  >
                    {faq.title}
                  </button>
                  {expandedId === faq.id && (
                    <>
                      <div className="w-full h-0.5 bg-gray-300"></div>
                      <p className="text-gray-700 text-base">{faq.des}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-[1204px] h-[256px] grid grid-cols-2 mt-[2rem] mb-[12rem] gap-[1rem]">
              {faq_data.slice(0, 4).map((faq) => {
                return (
                  <div
                    key={faq.id}
                    className="w-[592px] h-[256px] flex flex-col border py-[3rem] gap-[1rem] border-solid border-gray-300 p-[4rem] items-center rounded-[8px]"
                  >
                    <span className="text-black w-[517px] h-[21px] font-[500] text-[17px] leading-[20px]">
                      {faq.title}
                    </span>
                    <div className="w-[517px] h-[0.9px] bg-gray-300"></div>
                    <span className="text-gray-700 w-[517px] h-[15px] font-[400] text-[15px] leading-[22px]">
                      {faq.des}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <Link to="/faqs">
            <div className="flex items-center justify-center md:mt-[4rem] mt-[2rem]">
              <button className="md:w-[147px] md:h-[40px] w-[110px] h-[30px] rounded-[6px] bg-black text-white md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px] md:mt-12 mt-[0rem]">
                Load All FAQ's
              </button>
            </div>
          </Link>
        </div>

        <Testimonials />
      </div>
    </div>
  );
};

export default About;
