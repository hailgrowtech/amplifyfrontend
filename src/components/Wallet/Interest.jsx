import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { arrow, stars, telegram, userBck } from "../../assets";

const Interest = ({ userData }) => {
  const [smallScreen, setSmallScreen] = useState(false);

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
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col md:w-[1204px] w-full md:px-[7rem] px-[1rem] py-5">
      <div className={`{styles.flexStart} flex-col gap-2 xl:px-0`}>
        <div className="flex flex-row md:h-[52px] h-[34px] md:justify-between items-center">
          <span
            className="font-inter font-[700] md:text-[50px] text-[30px]
                    text-black leading-[51px]"
          >
            Similar To Your Interest
          </span>
        </div>

        <p
          className="font-inter md:w-[1136px] md:h-[28px] w-[328px] h-[34px] font-[400] text-gray-700 sm:text-[18px] text-[13px] md:leading-[28px] sm:leading-[17px]
                 leading-[16px] text-start"
        >
          Discover related analysts with similar expertise to enhance your
          trading decisions and broaden your market insights.
        </p>
      </div>

      <div className="md:gap-[18rem] gap-2 md:p-0 md:p-[1.5rem] p-[0.5rem] grid sm:grid-cols-3 grid-cols-2 md:px-6 px-0 mt-3">
        {smallScreen
          ? userData.slice(0, 4).map((expert, id) => {
              return (
                <div
                  className="flex flex-col hover:bg-gray-100 hover:opacity[50%] transition duration-150 ease-in-out rounded-xl p-2 border-gray-300 border-[1px]"
                  key={expert.id}
                >
                  <Link
                    to={`/ra-detail/${expert.id}`}
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
                      <div className="flex flex-col h-[22px] w-full md:h-[40px] gap-2">
                        <span className="sm:text-[18px] text-[12px] sm:leading-[18px] leading-[8px] font-[500] text-black">
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
                        <span className="text-black font-[600] sm:text-[11.5px] sm:leading-[14px] text-[10px] leading-[10px]">
                          {expert.rating}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-[256px] w-[143px] h-[44px] flex items-start md:mt-2 mt-4 justify-between">
                      <div className="flex flex-col md:w-[78px] w-[43px] h-[22px] items-center justify-between">
                        <span className="text-gray-700 font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                          Experience
                        </span>
                        <span className="text-black font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                          {expert.experience}+
                        </span>
                      </div>
                      <div className="sm:w-[1.4px] sm:h-[40px] w-[0.4px] h-[16px] bg-black"></div>
                      <div className="flex">
                        <div className="flex flex-col sm:w-[78px] sm:h-[50px] w-[43px] h-[22px] items-center">
                          <span className="text-gray-700 font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                            Followers
                          </span>
                          <span className="text-black font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                            {`${expert.telegramFollower / 1000}k`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-[300px] md:h-[32px] md:mt-2 w-full md:pl-[5px]">
                      <div className="text-gray-700 md:text-[14px] flex md:flex-row flex-col text-[11px] md:leading-[18px] leading-[14px] md:pl-0 pl-[2px]">
                        <span>SEBI:</span>{" "}
                        <span className="text-black md:ml-2">
                          {expert.sebiRegNo}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-[211px] md:h-[40px] bg-black w-[146px] h-[38px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0">
                      <div className="flex justify-center items-center gap-2 btn-animate">
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
                  </Link>
                </div>
              );
            })
          : userData.slice(0, 3).map((expert, id) => {
              return (
                <Link
                  to={`/ra-detail/${expert.id}`}
                  key={expert.id}
                  className="md:w-[384px] md:h-[400px] w-[172px] h-[250px] md:mt-0 mt-[16px] relative flex flex-col items-center hover:bg-gray-100 hover:opacity[50%] transition duration-150 ease-in-out rounded-xl p-2 border-gray-300 border-[1px]"
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
                      <span className="sm:text-[18px] text-[12px] sm:leading-[18px] leading-[8px] font-[500] text-black">
                        {expert.channelName}
                      </span>
                      <span className="sm:text-[13px] text-[10px] sm:leading-[16px] leading-[9.6px] font-[400] text-gray-700">
                        {expert.name} - {getExpertType(expert.expertTypeId)}
                      </span>
                    </div>
                    <div className="sm:w-[48px] sm:h-[22px] w-[21px] h-[10px] flex">
                      <img
                        src={stars}
                        className="sm:w-[12.3px] sm:h-[12.3px] w-[8px] h-[8px]"
                        alt="rating"
                      />
                      <span className="text-black font-[600] sm:text-[11.5px] sm:leading-[14px] text-[10px] leading-[10px]">
                        {expert.rating}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[256px] md:h-[50px] w-[143px] h-[44px] flex items-start md:mt-2 mt-4 justify-around">
                    <div className="flex flex-col md:w-[78px] w-[43px] h-[22px] items-center justify-between">
                      <span className="text-gray-700 font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                        Experience
                      </span>
                      <span className="text-black font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                        {expert.experience}+
                      </span>
                    </div>
                    <div className="sm:w-[1.4px] sm:h-[40px] w-[0.4px] h-[16px] bg-black"></div>
                    <div className="flex">
                      <div className="flex flex-col sm:w-[78px] sm:h-[50px] w-[43px] h-[22px] items-center">
                        <span className="text-gray-700 font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                          Followers
                        </span>
                        <span className="text-black font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                          {`${expert.telegramFollower / 1000}k`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-[300px] md:h-[32px] md:mt-2 w-full md:pl-[5px]">
                    <div className="text-gray-700 md:text-[14px] flex md:flex-row flex-col text-[11px] md:leading-[18px] leading-[14px] md:pl-0 pl-[2px]">
                      <span>SEBI:</span>{" "}
                      <span className="text-black md:ml-2">
                        {expert.sebiRegNo}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[211px] md:h-[40px] bg-[#0081F1] w-[146px] h-[32px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0">
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
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default Interest;
