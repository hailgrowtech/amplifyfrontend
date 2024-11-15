import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { arrow, stars, telegram, userBck } from "../../assets";

const Expertise = ({ userData, token }) => {
  const handleTelegram = (link) => {
    token && window.open(link);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  return (
    <>
      <div className={`flex flex-col sm:py-[4rem]`}>
        <div className="flex p-[1rem] gap-[1rem] sm:p-[4rem] grid sm:grid-cols-3 grid-cols-2 sm:px-2 px-1 md:ml-0 ml-[-5px] md:mt-[-8rem]">
          {userData?.map((expert, id) => {
            return (
              <div key={expert.id} className="flex flex-col hover:bg-gray-200 transition duration-150 ease-in-out rounded-xl p-2 border-gray-300 border-[1px]">
                <Link
                  to={`/ra-detail/${expert.id}`}
                  onClick={scrollToTop}
                  className="md:w-[384px] md:h-[400px] w-[172px] h-[270px] rounded-[11px] md:mt-0 mt-[16px] p-2 relative flex flex-col items-center transition duration-150 ease-in-out"
                >
                  <div className="w-[72px] h-[98px] sm:w-[384px] sm:h-[219px] relative profile-image_1 mb-4">
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
                      <span className="sm:text-[18px] text-[12px] sm:leading-[18px] leading-[8px] font-[500] text-gray-900">
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
                      <span className="text-gray-900 font-[600] sm:text-[11.5px] sm:leading-[14px] text-[8px] leading-[10px]">
                        {expert.rating}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[256px] w-[143px] h-[34px] flex items-start md:mt-2 mt-4 justify-between">
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

                  <div className="md:w-[300px] md:h-[32px] md:mt-2 w-full md:pl-[5px]">
                    <div className="text-gray-700 md:text-[14px] flex md:flex-row flex-col text-[11px] md:leading-[18px] leading-[14px] md:pl-0 pl-[2px]">
                      <span>SEBI:</span>{" "}
                      <span className="text-gray-900 md:ml-2">{expert.sebiRegNo}</span>
                    </div>
                  </div>

                  <div className="md:w-[211px] bg-[#0081F1] md:h-[40px] w-[146px] h-[38px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0">
                    <div onClick={() => handleTelegram(expert.telegramChannel)} className="flex justify-center items-center gap-2">
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
          })}
        </div>
      </div>
    </>
  );
};

export default Expertise;
