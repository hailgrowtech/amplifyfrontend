import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../style";
import Stock from "../Stock";
import { arrow, telegram, userBck, stars } from "../../assets";
import { useUserData } from "../../constants/context";
import BuyNowCards from "../BuyNow/BuyNowCards";

const Expertise = ({ userId }) => {
  const userData = useUserData();
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(location.state?.filterTab || null);

  const getExpertType = (typeId) => {
    switch (typeId) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Futures & Options";
      default:
        return "Unknown";
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filterAndMapUserData = (data, expertTypeId) => {
    if (expertTypeId === null)
      return data.map((user) => ({
        ...user,
        expertType: getExpertType(user.expertTypeId),
      }));

    return data
      .filter((user) => user.expertTypeId === expertTypeId)
      .map((user) => ({
        ...user,
        expertType: getExpertType(user.expertTypeId),
      }));
  };

  const handleFilter = (id) => {
    setFilter(id);
  };

  const handleTelegram = (link) => {
    userId && window.open(link);
  };

  const filteredData = useMemo(
    () => filterAndMapUserData(userData, filter),
    [userData, filter]
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabChange = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const buttonVariants = {
    active: {
      scale: 1.1,
      backgroundColor: "#fff",
      color: "#000",
      transition: {
        duration: 0.3,
      },
    },
    inactive: {
      scale: 1,
      backgroundColor: "transparent",
      color: "#000",
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleExpertClick = (expert) => {
    const expertTypeId = expert.expertTypeId;
    let filterTab = "all";
    switch (expertTypeId) {
      case 1:
        filterTab = "commodity";
        break;
      case 2:
        filterTab = "equity";
        break;
      case 3:
        filterTab = "futures";
        break;
      default:
        filterTab = "all";
    }
    navigate(`/ra-detail/${expert.id}`, { state: { filterTab } });
  };

  return (
    <motion.section
      className={`flex md:flex-row flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bgn`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      variants={fadeInUp}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 md:px-28 z-10 md:bottom-[10rem]`}
      >
        {/* <section className="w-full md:block hidden">
          <div className="flex flex-col items-center w-full md:mb-0">
            <span
              className="font-inter font-[700] md:text-[72px] text-[36px]
              text-gray-900 md:leading-[88px] leading-[44px] text-center md:pb-8 pb-2"
            >
              Analyst Expertise Across <br /> Market Segments
            </span>

            <span
              className="font-inter md:text-xl text-[13px]
              text-gray-700 md:leading-[28px] leading-[16px] text-center"
            >
              Meet our team of SEBI Registered experts, dedicated to providing
              you with valuable <br /> insights and strategies to navigate the
              markets with confidence and success.
            </span>
          </div>
          <div className="md:pt-[2rem] pt-[1rem] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:flex">
            {userData &&
              userData.slice(0, 3).map((expert, id) => {
                return (
                  <div
                    key={expert.id}
                    className="flex flex-col hover:bg-gray-100 hover:opacity[50%] transition duration-150 ease-in-out rounded-xl p-2 border-gray-300 border-[1px]"
                  >
                    <div
                      onClick={() => handleExpertClick(expert)}
                      className="md:w-[256px] md:h-[265px] sm:w-[172px] h-[200px] gap-[3px] relative flex flex-col items-center"
                    >
                      <div className="w-[80px] h-[98px] md:w-[256px] md:h-[146px] relative profile-image_1 mb-1">
                        <img
                          src={userBck}
                          alt="background"
                          className="absolute top-0 left-0 w-full h-full object-contain rounded-t-[11px]"
                        />
                        <img
                          src={expert.expertImagePath}
                          alt="User"
                          className="absolute top-0 left-0 w-full h-full md:object-contain object-cover rounded-t-[11px]"
                        />
                      </div>

                      <div className="flex md:w-[212px] md:h-[26px] w-full sm:h-[22px] justify-between md:gap-0">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] leading-[12px] font-[500] text-gray-900">
                            {expert.channelName}
                          </span>
                          <span className="text-[12px] leading-[12px] font-[400] text-gray-700">
                            {expert.channelName} -{" "}
                            {getExpertType(expert.expertTypeId)}
                          </span>
                        </div>
                        <div className="w-[40px] h-[15px] flex justify-end">
                          <img
                            src={stars}
                            className="w-[11.5px] h-[11.5px]"
                            alt="rating"
                          />
                          <span className="text-gray-900 font-[600] text-[11.5px] leading-[14px]">
                            {expert.rating}
                          </span>
                        </div>
                      </div>

                      <div className="md:w-[171px] md:h-[33px] w-[125px] h-[23px] flex justify-between mr-[1rem] md:mt-4 mt-2">
                        <div className="flex flex-col w-[52px] h-[33px] items-center">
                          <span className="text-gray-700 font-[400] text-[8.6px] leading-[10px]">
                            Experience
                          </span>
                          <span className="text-gray-900 font-[600] text-[10px] leading-[12px]">
                            {expert.experience}+
                          </span>
                        </div>
                        <div className="md:w-[1.4px] md:h-[25px] w-[1px] h-[22px] bg-gray-900"></div>
                        <div className="flex">
                          <div className="flex flex-col w-[52px] h-[33px] items-center">
                            <span className="text-gray-700 font-[400] text-[8.6px] leading-[10px]">
                              Followers
                            </span>
                            <span className="text-gray-900 font-[600] text-[10px] leading-[12px]">
                              {`${expert.telegramFollower / 1000}k`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-[211px] bg-[#0081F1] md:h-[40px] w-[146px] h-[38px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0">
                        <div
                          onClick={() => handleTelegram(expert.telegramChannel)}
                          className="flex justify-center items-center gap-2 btn-animate"
                        >
                          <img
                            src={telegram}
                            alt="Telegram"
                            className="md:w-[24px] md:h-[24px] w-[16px] h-[16px]"
                          />
                          <button className="text-white font-[400] md:text-[15px] text-[12px] leading-[19px]">
                            Get Free Calls
                          </button>
                          <img
                            src={arrow}
                            alt="arrow"
                            className="md:w-[16px] md:h-[16px] w-[11px] h-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="md:w-[365px] md:h-[226px] w-[171px] h-auto md:px-[3rem] flex flex-col md:gap-2">
              <span className="md:w-[365px] md:h-[36px] w-[171px] h-[36px] font-[600] md:text-[30px] text-[18px] leading-[36px] text-gray-900">
                Experience Matters
              </span>

              <span className="text-gray-700 md:w-[365px] md:h-[86px] w-[171px] h-[80px] font-[400] md:text-[16px] text-[14px] md:leading-[28px] md:leading-[21px] leading-[18px]">
                Connect with India’s SEBI registered Research Analysts, guiding
                you thoroughly to maximising profits in the dynamic world of
                stock trading.
              </span>
              <Link onClick={scrollToTop} to="explore-expertise">
                <button className="md:w-[147px] md:h-[40px] w-[110px] h-[30px] rounded-[6px] bg-gray-900 text-white md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px] md:mt-12 mt-[4rem]">
                  Explore More
                </button>
              </Link>
            </div>
          </div>
        </section> */}
        {/* <section className="w-full md:py-[4rem] py-[5px]">
          <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
            <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
              <span
                className="font-inter font-[700] md:text-[50px] text-[40px]
                    text-gray-900 leading-[51px]"
              >
                Our Expertise
              </span>
            </div>

            <p
              className="font-inter md:w-[1136px] md:h-[28px] sm:w-[328px] h-[34px] font-[400] text-gray-700 sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px]
                 leading-[16px] sm:text-start mt-2 text-center"
            >
              Dive into the expertise of our SEBI registered research analysts,
              guiding you towards trading success with precision and insight.
            </p>
          </div>
          <div className="w-full flex flex-row bg-[#e7e7e7] rounded-2xl p-3 mt-6">
            <div className="md:flex-col-6 md:text-[16px] text-[10px] flex flex-row my-auto ">
              <motion.button
                onClick={() => handleFilter(null)}
                className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[15px] md:px-3 px-1 py-[0.2rem] md:py-1 ${
                  filter === null ? "text-[#000] px-6 bg-[#fff] shadow-md rounded-[5px]" : "text-[#000]"
                }`}
                variants={buttonVariants}
                initial={false}
                animate={filter === null ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
              >
                All
              </motion.button>
              <motion.button
                onClick={() => handleFilter(3)}
                className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[14px] md:px-3 px-1 py-[0.2rem] md:py-1 ${
                  filter === 3 ? "text-[#000] bg-[#fff] shadow-md rounded-[5px]" : "text-[#000]"
                }`}
                variants={buttonVariants}
                initial={false}
                animate={filter === 3 ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
              >
                Futures & Options
              </motion.button>
              <motion.button
                onClick={() => handleFilter(1)}
                className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[14px] md:px-3 px-1 py-[0.2rem] md:py-1 ${
                  filter === 1 ? "text-[#000] bg-[#fff] shadow-md rounded-[5px]" : "text-[#000]"
                }`}
                variants={buttonVariants}
                initial={false}
                animate={filter === 1 ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
              >
                Commodity
              </motion.button>
              <motion.button
                onClick={() => handleFilter(2)}
                className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[14px] md:px-3 px-1 py-[0.2rem] md:py-1 ${
                  filter === 2 ? "text-[#000] bg-[#fff] rounded-[5px] shadow-md" : "text-[#000]"
                }`}
                variants={buttonVariants}
                initial={false}
                animate={filter === 2 ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
              >
                Equity
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="flex p-[1rem] gap-[1rem] sm:p-[4rem] grid sm:grid-cols-3 grid-cols-2 sm:px-2 px-1 md:ml-0 ml-[-5px] md:mt-[-2rem]"
              key={filter}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabChange}
              transition={{ duration: 0.5 }}
            >
              {filteredData?.map((expert, id) => (
                <div
                  onClick={() => handleExpertClick(expert)}
                  key={expert.id}
                  className="md:w-[384px] md:h-[400px] sm:w-[172px] h-[220px] rounded-[11px] md:mt-0 mt-[16px] p-2 relative flex flex-col items-center hover:bg-gray-100 hover:opacity[50%] transition duration-150 ease-in-out border-gray-300 border-[1px]"
                >
                  <div className="w-[72px] h-[98px] sm:w-[384px] sm:h-[219px]  relative profile-image_1 mb-4">
                    <img
                      src={userBck}
                      alt="background"
                      className="absolute top-0 left-0 w-full h-full object-contain rounded-t-[11px]"
                    />
                    <img
                      src={expert.expertImagePath}
                      alt="User"
                      className="absolute top-0 left-0 w-full h-full md:object-contain object-cover rounded-t-[11px]"
                    />
                  </div>

                  <div className="w-[154px] h-[22px] sm:w-[319px] sm:h-[40px] flex justify-between px-[5px] sm:px-[1rem]">
                    <div className="flex flex-col h-[22px] w-full md:h-[40px] gap-2">
                      <span className="sm:text-[18px] text-[12px] sm:leading-[18px] leading-[8px] font-[500] text-gray-900">
                        {expert.channelName}
                      </span>
                      <span className="sm:text-[13px] text-[10px] sm:leading-[16px] leading-[9.6px] font-[400] text-gray-700">
                        {expert.name} - {getExpertType(expert.expertTypeId)}
                      </span>
                    </div>
                    <div className="w-[40px] h-[15px] flex justify-end">
                      <img
                        src={stars}
                        className="sm:w-[12.3px] sm:h-[12.3px] w-[8px] h-[8px]"
                        alt="rating"
                      />
                      <span className="text-gray-900 font-[600] sm:text-[11.5px] sm:leading-[14px] text-[10px] leading-[10px]">
                        {expert.rating}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[256px] w-[143px] h-[34px] flex items-start md:mt-4 mt-4 justify-between">
                    <div className="flex flex-col md:w-[78px] w-[43px] h-[22px] items-center justify-between">
                      <span className="text-gray-700 font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                        Experience
                      </span>
                      <span className="text-gray-900 font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                        {expert.experience}+
                      </span>
                    </div>
                    <div className="sm:w-[1.4px] sm:h-[40px] w-[0.4px] h-[16px] bg-gray-900"></div>
                    <div className="flex">
                      <div className="flex flex-col sm:w-[78px] sm:h-[50px] w-[43px] h-[22px] items-center">
                        <span className="text-gray-700 font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                          Followers
                        </span>
                        <span className="text-gray-900 font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                          {`${expert.telegramFollower / 1000}k`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-[300px] md:h-[32px] md:mt-2 w-full md:pl-[5px] pl-[5px]">
                    <div className="text-gray-700 md:text-[14px] flex md:flex-row flex-col text-[11px] md:leading-[18px] leading-[14px] md:pl-0 pl-[2px]">
                      <span>SEBI:</span>{" "}
                      <span className="text-gray-900 md:ml-2">
                        {expert.sebiRegNo}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[211px] bg-[#0081F1] md:h-[40px] w-[146px] h-[38px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0">
                    <div
                      onClick={() => handleTelegram(expert.telegramChannel)}
                      className="flex justify-center items-center gap-2"
                    >
                      <img
                        src={telegram}
                        alt="Telegram"
                        className="md:w-[24px] md:h-[24px] w-[16px] h-[16px]"
                      />
                      <button className="text-white font-[400] md:text-[15px] text-[12px] leading-[19px]">
                        Get Free Calls
                      </button>
                      <img
                        src={arrow}
                        alt="arrow"
                        className="md:w-[16px] md:h-[16px] w-[11px] h-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section> */}
        <section className="w-full md:py-0 py-[5px]">
          <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
            <div className="flex flex-row justify-center md:justify-between items-center mb-8">
              <span
                className="font-inter font-[700] md:text-[50px] text-[40px]
                    text-[#24243F] leading-[51px]"
              >
                Our Expertise
              </span>
            </div>
            <BuyNowCards />
          </div>
        </section>
        <div className={`md:mt-[5rem] mt-[1.9rem] ${styles.boxWidth}`}>
          <Stock />
        </div>
      </div>
    </motion.section>
  );
};

export default Expertise;
