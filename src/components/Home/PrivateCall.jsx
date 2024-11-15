import React, { useState, useEffect, useRef } from "react";
import { mobBanner, webBanner } from "../../assets";
import StockPlatform from "./StockPlatform";
import { motion, useInView } from "framer-motion";

const PrivateCall = () => {
  const [smallScreen, setSmallScreen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const bannerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {/* <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={bannerVariants}
        className="flex flex-col items-center md:py-0"
      > */}
        {/* <div className="flex sm:justify-between justify-center items-center flex-col sm:flex-row gap-2">
        <span className="font-poppins h-[52px] font-[700] md:text-[50px] text-[30px] sm:text-start text-center text-gradient-2 leading-[51px]">
          Private Calls Availability
        </span>
        <span className="w-[419px] h-[56px] text-[18px] leading-[28px] text-dimWhite sm:text-start text-center">
          With Cobalt, managing your business finances is effortless,
          empowering.
        </span>
      </div> */}
        {/* {smallScreen ? (
          <div className="flex justify-center items-center w-full md:mb-[4rem] mb-[0]">
            <img
              src={mobBanner}
              alt="Advertisement"
              className="max-w-full max-h-full rounded-md"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full md:mb-[4rem] mb-[0]">
            <img
              src={webBanner}
              alt="Advertisement"
              className="max-w-full max-h-full rounded-md"
            />
          </div>
        )}
      </motion.div> */}
      <StockPlatform />
    </>
  );
};

export default PrivateCall;
