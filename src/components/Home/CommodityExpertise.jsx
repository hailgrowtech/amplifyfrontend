import React, { useState } from "react";
import EquityExpertise from "./EquityExpertise";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../../constants/context";
import { arrow, stars, telegram, userBck } from "../../assets";
import SignUp from "../SignUp";

const CommodityExpertise = ({ token }) => {
  const userData = useUserData();
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

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

  const filterAndMapUserData = (data, expertTypeId) => {
    return data
      .filter((user) => user.expertTypeId === expertTypeId)
      .map((user) => ({
        ...user,
        expertType: getExpertType(user.expertTypeId),
      }));
  };

  const filteredData = filterAndMapUserData(userData, 1);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTelegram = (link) => {
    if (token) {
      window.open(link);
    } else {
      setShowSignUp(true);
    }
  };

  const handleAuthSuccess = (link) => {
    setShowSignUp(false);
    window.open(link);
  };

  const handleExpertClick = (expert) => {
    navigate(`/ra-detail/${expert.id}`, { state: { filterTab: "commodity" } });
  };

  return (
    <>
       {/* <div className={`flex ${filteredData.length === 0 ? "hidden" : ""} flex-col sm:py-[4rem] md:mt-0 mt-20`}>
        <div className="flex flex-row justify-between xl:px-0">
          <div className="flex flex-col md:h-[52px] h-[34px] justify-center md:justify-between pb-[2rem] md:items-start">
            <div className="flex flex-row md:h-[52px] h-[34px] justify-center md:justify-between items-center">
              <span
                className="font-inter font-[700] md:text-[50px] text-[30px]
            text-gradient-2 leading-[51px] text-center"
              >
                Commodity Expertise
              </span>
            </div>

            <p
              className="font-inter md:w-[615px] md:h-[28px] w-[328px] h-[34px] font-[400] text-dimWhite md:text-[18px] text-[11px] md:leading-[28px] md:leading-[17px]
          text-[10px] leading-[16px] md:text-start mt-2 text-center md:flex hidden"
            >
              Unlock insights to excel in commodity markets.
            </p>
          </div>

          <Link onClick={scrollToTop} to="expertise/explore-expertise">
            <button className="md:w-[147px] md:h-[40px] md:flex items-center justify-center hidden flex w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px]">
              Explore More
            </button>
          </Link>
        </div>

        <div className="flex p-[1rem] gap-[1rem] sm:p-[4rem] grid sm:grid-cols-3 grid-cols-2 sm:px-2 px-1 md:ml-0 ml-[-5px] md:mt-0 mt-[-2rem]">
          {filteredData &&
            filteredData.slice(0, 3).map((expert, id) => {
              return (
                <div className="flex flex-col hover:bg-[#18181B] hover:opacity[50%] transition duration-150 ease-in-out rounded-[11px] p-2">
                  <div
                    onClick={() => handleExpertClick(expert)}
                    key={expert.id}
                    className="md:w-[auto] md:h-[295px] sm:w-[172px] h-[230px] gap-[3px] relative flex flex-col items-center"
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
                  </div>
                  <div
                    onClick={() => handleTelegram(expert.telegramChannel)}
                    className="md:w-[211px] mx-auto bg-[#0081F1] md:h-[40px] w-[146px] h-[38px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0"
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
                    {showSignUp && (
                      <SignUp
                        onAuthSuccess={() =>
                          handleAuthSuccess(expert.telegramChannel)
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}
          <div className="md:hidden flex flex-col w-[171px] h-[150px] justify-evenly px-[0.5rem]">
            <p
              className="font-inter md:w-[737px] md:h-[28px] w-[171px] h-[66px] font-[400] text-dimWhite md:text-[18px] text-[14px] md:leading-[28px]
            leading-[22px] md:text-start text-center md:hidden flex items-start text-start"
            >
              Dive into the expertise of our SEBI registered research analysts
            </p>
            <Link onClick={scrollToTop} to="expertise/explore-expertise">
              <button className="md:flex items-center justify-center md:hidden flex w-[110px] h-[30px] rounded-[4.5px] bg-lightWhite text-[10px] font-[500] leading-[12px] md:ml-0">
                Explore More
              </button>
            </Link>
          </div>
        </div>
      </div>  */}
      <EquityExpertise token={token} />
    </>
  );
};

export default CommodityExpertise;
