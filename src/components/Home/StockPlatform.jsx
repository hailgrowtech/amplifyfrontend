import React, { useRef } from "react";
import { logo } from "../../assets";
import { stock_data } from "../../constants";
import OptionExpertise from "./OptionExpertise";
import { motion, useInView } from "framer-motion";

const StockPlatform = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.3 },
    },
  };

  return (
    <>
      {/* <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={stockVariants}
        className="flex flex-col items-center justify-center sm:mt-[4rem] mt-[60px]"
      >
        <div className="flex flex-col justify-between items-center md:w-[557px] md:h-[103px] w-[340px] h-[197px] md:mb-16 mb-2">
          <span
            className="font-[700] md:text-[50px] text-[30px] md:w-[1114px] md:h-[120px] w-full h-full
          text-gradient-2 md:leading-[60px] leading-[30px] text-center mb-3"
          >
            Bridge the Gap between Traders & Analysts with Copartner and Unite
            for Success!
          </span>

          <img
            src={logo}
            alt="LOGO"
            className="md:w-[225px] w-[199px] md:h-[64px] h-[54px] mb-3"
          />

          <span className="text-dimWhite md:w-[505px] w-[328px] text-center md:h-[56px] h-[34px] font-[400] md:text-[18px] text-[13px] md:leading-[28px] leading-[17px]">
            Dive into the expertise of our SEBI registered research analysts.
          </span>
        </div>

        <div className="md:gap-[5rem] gap-[1rem] md:flex grid grid-cols-2 md:mt-[6rem] md:py-0 py-[2rem] mx-auto">
          {stock_data.map((stock) => (
            <motion.div
              key={stock.id}
              variants={stockVariants}
              className={`mx-auto md:p-4 p-3 gap-[1rem] ${
                stock.id === "3" ? "col-span-2" : ""
              } py-[8px] items-center md:w-[337px] max-h-full rounded-[11px] hover:bg-[#18181B] hover:opacity[50%] transition duration-150 ease-in-out`}
            >
              <img src={stock.img} alt="STOCK_IMAGES" />
              <div className="flex flex-col gap-[0.4rem]">
                <span className="text-lightWhite md:px-4 md:w-[190px] font-[600] md:text-[20px] text-[18px] leading-[27px] text-left">
                  {stock.title}
                </span>
                <span className="text-dimWhite md:px-4 max-h-full md:text-base text-sm text-left">
                  {stock.content}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}
      <OptionExpertise />
    </>
  );
};

export default StockPlatform;
