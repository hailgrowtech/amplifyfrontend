import React, { useState, useEffect } from "react";
import { expertise_data, expertise_type } from "../../constants";
import { arrow, stars, telegram, userBck } from "../../assets";
import PrivateCall from "./PrivateCall";
import { Link } from "react-router-dom";
import { useUserData } from "../../constants/context";
import SignUp from "../SignUp";

const Expertise = ({ userId }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const userData = useUserData();
  const [showSignUp, setShowSignUp] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTelegram = (link) => {
    if (userId) {
      window.open(link);
    } else {
      setShowSignUp(true);
    }
  };

  const handleAuthSuccess = (link) => {
    setShowSignUp(false);
    window.open(link);
  };

  return (
    <>
      {/* <div className={`flex flex-col sm:py-[4rem] py-[30px]`}> */}
        {/* <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
          <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
            <span
              className="font-inter font-[700] md:text-[50px] text-[30px]
                    text-gradient-2 leading-[51px]"
            >
              Our Expertise
            </span>
          </div>

          <p
            className="font-inter md:w-[1136px] md:h-[28px] sm:w-[328px] h-[34px] font-[400] text-dimWhite sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px]
                 leading-[16px] sm:text-start mt-2 text-center"
          >
            Dive into the expertise of our SEBI registered research analysts,
            guiding you towards trading success with precision and insight.
          </p>
        </div> */}

        {/* <div className="p-[1rem] gap-[1rem] sm:p-[4rem] grid sm:grid-cols-3 grid-cols-2 sm:px-2 px-1 md:ml-0 ml-[-5px] md:mt-[-2rem]">
          {userData &&
            userData.slice(0, 6).map((expert, id) => {
              return (
                <div className="flex flex-col hover:bg-[#18181B] hover:opacity[50%] transition duration-150 ease-in-out rounded-[11px] p-2">
                  <Link
                    to={`/ra-detail/${expert.id}`}
                    onClick={scrollToTop}
                    key={expert.id}
                    className="md:w-[auto] md:h-[285px] sm:w-[172px] h-[230px] gap-[3px] relative flex flex-col items-center"
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
                        className="absolute top-0 left-0 w-full h-full object-contain rounded-t-[11px]"
                      />
                    </div>

                    <div className="w-[154px] h-[22px] sm:w-[319px] sm:h-[40px] flex justify-between px-[5px] sm:px-[1rem]">
                      <div className="flex flex-col h-[22px] w-full md:h-[40px] gap-2">
                        <span className="sm:text-[18px] text-[12px] sm:leading-[18px] leading-[8px] font-[500] text-lightWhite">
                          {expert.channelName}
                        </span>
                        <span className="sm:text-[13px] text-[10px] sm:leading-[16px] leading-[9.6px] font-[400] text-dimWhite">
                          {expert.name} - {getExpertType(expert.expertTypeId)}
                        </span>
                      </div>
                      <div className="sm:w-[48px] sm:h-[22px] w-[21px] h-[10px] flex">
                        <img
                          src={stars}
                          className="sm:w-[12.3px] sm:h-[12.3px] w-[8px] h-[8px]"
                          alt="rating"
                        />
                        <span className="text-lightWhite font-[600] sm:text-[11.5px] sm:leading-[14px] text-[10px] leading-[10px]">
                          {expert.rating}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-[256px] w-[143px] h-[34px] flex items-start md:mt-2 mt-4 justify-between">
                      <div className="flex flex-col md:w-[78px] w-[43px] h-[22px] items-center justify-between">
                        <span className="text-dimWhite font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                          Experience
                        </span>
                        <span className="text-lightWhite font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                          {expert.experience}+
                        </span>
                      </div>
                      <div className="sm:w-[1.4px] sm:h-[40px] w-[0.4px] h-[16px] bg-lightWhite"></div>
                      <div className="flex">
                        <div className="flex flex-col sm:w-[78px] sm:h-[50px] w-[43px] h-[22px] items-center">
                          <span className="text-dimWhite font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                            Followers
                          </span>
                          <span className="text-lightWhite font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                            {`${expert.telegramFollower / 1000}k`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-[300px] md:h-[32px] md:mt-2 w-full md:pl-[5px]">
                      <div className="text-dimWhite md:text-[14px] flex md:flex-row flex-col text-[11px] md:leading-[18px] leading-[14px] md:pl-0 pl-[2px]">
                        <span>SEBI:</span>{" "}
                        <span className="text-white md:ml-2">
                          {expert.sebiRegNo}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div
                    onClick={() => handleTelegram(expert.telegramChannel)}
                    className="md:w-[211px] mx-auto md:h-[40px] w-[146px] h-[38px] bg-[#0081F1] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0"
                  >
                    <div className="flex justify-center items-center gap-2">
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
                    {showSignUp && <SignUp onAuthSuccess={() => handleAuthSuccess(expert.telegramChannel)} />}
                  </div>
                </div>
              );
            })}
        </div> */}

        {/* <div
          className={`sm:flex grid-cols-1 sm:items-center sm:gap-6 gap-3 xl:px-0 md:py-0 py-[30px]`}
        >
          <div className="flex flex-col md:gap-[2rem] gap-[5px] md:py-0 mb-4">
            <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
              <span
                className="font-poppins font-[700] md:text-[50px] text-[30px]
                     text-gradient-2 leading-[51px]"
              >
                Expertise Type
              </span>
            </div>

            <p
              className="font-poppins md:w-[349px] md:h-[84px] sm:w-[328px] h-[34px] font-[400] text-dimWhite sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px]
                   text-[10px] leading-[16px] sm:text-start text-center"
            >
              In Expert Hands, Your Wealth Thrives: Redefining Investment
              Success in the Stock Market Arena
            </p>
          </div>

          <div className="sm:flex gap-3 grid grid-cols-2">
            {expertise_type.map((type) => (
              <div
                key={type.id}
                className={`flex flex-col items-baseline p-4
                rounded-[11px] hover:bg-[#18181B] hover:opacity[50%] transition duration-150 ease-in-out
                justify-evenly sm:my-4 ${
                  type.id === 3 && isSmallScreen
                    ? "md:w-[290px] md:h-[386px] w-[340px] h-[238px]"
                    : "w-[165px] h-[300px] md:w-[290px] md:h-[386px]"
                }`}
              >
                <img
                  alt="Expertise_Type"
                  className={`${
                    type.id === 3 && isSmallScreen
                      ? "sm:w-[290px] sm:h-[164px] w-[361px] h-[99.5px]"
                      : ""
                  } bg-expertise_type`}
                  src={
                    type.id === 3 && isSmallScreen ? type.image2 : type.image
                  }
                />
                <div
                  className={`flex justify-between ${
                    isSmallScreen && type.id === 3
                      ? "flex-row sm:flex-col"
                      : "flex-col sm:flex-row"
                  } ${isSmallScreen && type.id === 3 ? "gap-[6rem]" : "gap-0"}`}
                >
                  <span className="text-lightWhite sm:w-[139px] md:h-[16px] w-[162px] h-[18px] font-[600] sm:text-[18px] text-[16px] sm:leading-[25px] leading-[15px]">
                    {type.title}
                  </span>
                  <span className="text-dimWhite md:w-[120px] md:h-[18px] w-[55px] h-[16px] font-[600] sm:text-[13px] text-[10px] sm:leading-[25px] leading-[15px]">
                    {type.followers}
                  </span>
                </div>
                <div className="sm:block contents">
                  <span
                    className={`text-dimWhite font-[400] ${
                      isSmallScreen && type.id === 3
                        ? "w-[320px] h-[56px]"
                        : "md:w-[147px] md:h-[55px]"
                    } sm:text-[15px] text-[11px] sm:leading-[23px] leading-[13.7px]`}
                  >
                    {type.describe}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link onClick={scrollToTop} to="expertise/explore-expertise">
                    <button className="text-lightWhite gap-1 flex items-center sm:h-[27px] h-[17px] font-normal sm:text-[14px] text-[12.6px] sm:leading-[26px] leading-[16px]">
                      {type.button}
                      <img
                        src={type.arrowIcon}
                        alt="arrow"
                        className="w-[15px] h-[15px]"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}
      <PrivateCall userData={userData} />
    </>
  );
};

export default Expertise;
