import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  testimonialLeft,
  testimonialRight,
  testimonialProfile,
  paridhi,
  samay,
  ritik,
  rohitKashyap,
  priyaMahajan,
  amitRao,
} from "../../assets";

const Testimonials = () => {
  const [count, setCount] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  const handlePrevious = () => {
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
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    setActiveDot(count);
  }, [count]);

  const testimonialsData = [
    {
      id: 1,
      text: "Thanks to the Copartner platform, I got connected with knowledgeable research analysts who have truly transformed my trading approach. Their insights and guidance have been invaluable in navigating the markets more confidently. The platform's user-friendly interface and responsive support team have made the experience even better.",
      author: "Paridhi Tripathi",
      image: paridhi,
    },
    {
      id: 2,
      text: "Since joining the Copartner platform, my trading experience has been transformed. Connecting with research analysts has provided invaluable insights that have significantly improved my trading strategies. The personalised guidance and expertise have helped me navigate the markets with confidence.",
      author: "Samay Trivedi",
      image: samay,
    },
    {
      id: 3,
      text: "Copartner has been a game-changer for me as a trader. It's easy to use and the expert advice has helped me make better decisions. The community is supportive and the tools are simple and effective Thanks to Copartner, my portfolio has grown and I'm excited for what's next!",
      author: "Ritik Goswami",
      image: ritik,
    },
    {
      id: 4,
      text: "With Copartner, I feel secure knowing I'm getting advice from trusted, SEBI-registered analysts. It's my go-to platform for trading.",
      author: "Rohan Srivastava",
      image: rohitKashyap,
    },
    {
      id: 5,
      text: "I've learned so much from Copartner’s experts. The free access to Telegram channels is a fantastic resource for any trader.",
      author: "Priya Mahajan",
      image: priyaMahajan,
    },
    {
      id: 6,
      text: "With Copartner, I’m not just trading, I’m growing. The expert insights have helped me navigate the stock market with ease.",
      author: "Amit Rao",
      image: amitRao,
    },
  ];

  const fadeInOut = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="flex flex-col items-center justify-center sm:mt-[2rem] mt-12">
      <div className="flex flex-col justify-between items-center md:w-[557px] md:h-[103px] w-[330px] h-[110px] gap-[4px] md:mb-16 mb-2">
        <span
          className="font-[700] md:text-[50px] text-[30px] md:h-[103px] h-[70px]
          md:leading-[51px] leading-[35px] text-center"
        >
          What Our Users Say About Us
        </span>

        <span className="text-gray-700 md:w-[596px] w-[328px] text-center md:h-[56px] h-[34px] font-[400] md:text-[18px] text-[13px] md:leading-[28px] leading-[17px]">
          Our users love our platform for its easy-to-use features, helpful
          insights, and friendly community.
        </span>
      </div>

      <div className="flex justify-between md:gap-[6rem] gap-0 items-center">
        <button onClick={handlePrevious}>
          <img
            src={testimonialLeft}
            alt="LeftIcon"
            className="md:w-[58px] w-[100px]"
          />
        </button>

        <div className="flex-grow flex flex-col justify-center gap-[4rem] items-center">
          <motion.div
            key={count}
            className="flex flex-col justify-center items-center"
            variants={fadeInOut}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.6 }}
          >
            <span className="md:w-[678px] md:h-[343px] w-[283px] h-[262px] font-[400] md:text-[26px] text-[14px] md:leading-[44px] leading-[23px] text-gray-900 text-center flex items-center">
              {testimonialsData[count].text}
            </span>

            <div className="flex flex-col md:w-[252px] w-[150px] md:h-[56px] h-[30px] justify-center items-center">
              <div className="flex flex-row gap-[10px]">
                <img
                  src={testimonialsData[count].image}
                  alt="OUR_USERS"
                  className="md:w-[40px] rounded-full w-[27px] md:h-[40px] h-[27px]"
                />
                <div className="flex flex-col justify-center">
                  <span className="md:w-[202px] w-[117px] md:h-[25px] h-[13px] font-[700] md:text-[18px] text-[10px] md:leading-[23px] leading-[12px] text-gray-900">
                    {testimonialsData[count].author}
                  </span>
                  {/* <span className="md:w-[184px] w-[105px] md:h-[19px] h-[10px] font-[300] md:text-[14px] text-[8px] md:leading-[18.4px] leading-[10px] text-gray-700">
                    {testimonialsData[count].designation}
                  </span> */}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-[6px] mt-[1rem]">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  className={`w-[8px] h-[8px] rounded-[4px] ${
                    index === activeDot ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></button>
              ))}
            </div>
          </motion.div>
        </div>

        <button onClick={handleNext}>
          <img
            src={testimonialRight}
            alt="RightIcon"
            className="md:w-[58px] w-[100px]"
          />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
