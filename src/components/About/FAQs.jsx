import React, { useState, useEffect } from "react";
import { faq_data } from "../../constants";
import styles from "../../style";

const FAQs = () => {
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
    <div
      className={`flex md:flex-col flex-col ${styles.paddingY} md:px-[7rem] px-[16px] bg-white`}
    >
      <div className={`flex flex-col gap-2 xl:px-0`}>
        <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
          <span className="font-inter font-[700] md:text-[50px] text-[30px] text-black leading-[51px]">
            FAQs
          </span>
        </div>

        <p className="font-inter md:w-[1136px] md:h-[28px] w-[328px] h-[34px] font-[400] text-gray-700 sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px] leading-[16px] sm:text-start mt-2 text-center">
          Dive into the expertise of our SEBI registered research analysts.
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
        <div className="w-[1204px] h-[556px] grid grid-cols-2 mt-[2rem] mb-[12rem] gap-[1rem]">
          {faq_data.map((faq) => (
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
          ))}
        </div>
      )}
      {/* <div className="flex items-center justify-center md:mt-[2rem] mt-[2rem]">
        <button className="md:w-[147px] md:h-[40px] w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px] md:mt-12 mt-[0rem]">
          Load All FAQ's
        </button>
      </div> */}
    </div>
  );
};

export default FAQs;
