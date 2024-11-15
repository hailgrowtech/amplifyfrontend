import React from "react";
import styles from "../../style";
import { dollor, referearn, lorem, lorem2, lorem3 } from "../../assets";

const ReferEarn = () => {
  return (
    <div
      className={`flex md:flex-col ${styles.paddingY} ${styles.paddingX} flex-col bg-white`}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center items-center w-[328px] h-[143px]">
          <div className="flex justify-center md:gap-[1rem] gap-[0px]">
            <span className="md:w-[340px] md:h-[52px] w-[187px] h-[52px] font-inter font-[700] md:text-[50px] text-[30px] text-black md:leading-[51px] leading-[48px]">
              Refer & Earn
            </span>
            <img
              src={dollor}
              alt="Dollor_Img"
              className="md:w-[35.5px] w-[36px] md:h-[40px] h-[30px] md:mt-[-1rem]"
            />
          </div>
          <span className="text-gray-700 md:w-[555px] w-[328px] md:h-[112px] h-[85px] font-[400] font-inter text-[18px] leading-[28px] text-center">
            With Cobalt, managing your business finances is effortless,
            empowering, and anything but boring. Our intuitive platform brings
            clarity to your cash flow, simplifies your financial
            decision-making, and fingertips.{" "}
            <span className="text-black">
              Say no to spreadsheets and tools designed in the 80s.
            </span>
          </span>
        </div>

        <div className="flex md:flex-row flex-col-reverse justify-evenly items-center md:w-full md:h-full w-[450px] md:mt-[0rem] mt-[9rem]">
          <div className="flex flex-col md:ml-[0px] ml-[6rem] md:w-[343px] md:h-[66px] w-[343px] h-[198px]">
            <img src={lorem} alt="" />
            <img src={lorem2} alt="" />
            <img src={lorem3} alt="" />
          </div>

          <img
            src={referearn}
            alt=""
            className="md:w-[596px] md:h-[251px] w-[361px] h-[152px] md:mt-[5rem] mt-[0rem]"
          />
        </div>

        <div className="md:w-[520px] md:h-[50px] w-[358px] h-[50px] rounded-[12px] bg-gray-100 flex justify-center items-center md:p-0 p-[10px] mt-[5rem]">
          <input
            type="text"
            placeholder="Lorem ipsum dolor sit amet consectetur."
            className="text-black font-inter font-[500] text-[13px] leading-[16px] w-[382px] h-[16px]"
          />
          <button className="w-[118px] h-[42px] rounded-[12px] font-[500] text-[14px] bg-[#0081F1] text-white">
            Copy Link
          </button>
        </div>

        <button className="hidden w-[223px] h-[40px] rounded-[6px] bg-black text-white mt-[2rem] font-inter font-[500] text-[14px] leading-[16px]">
          Become an Affiliate Partner
        </button>
      </div>
    </div>
  );
};

export default ReferEarn;
