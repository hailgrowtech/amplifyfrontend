import React from "react";
import { Link } from "react-router-dom";
import { expertise_data } from "../../constants";

const SavedProfile = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`bg-transparent mt-10 md:p-8 p-0 rounded-lg border-[#ffffff34] md:ml-[2rem]`}>
      <div className="mt-6 md:text-left text-center">
        <div className="font-inter font-bold md:text-[50px] text-[30px] subheading-gradient md:leading-[50px] leading-[51px] text-white md:mb-2">
          Favorite Expertise
        </div>
        <div className="font-normal text-dimWhite md:text-[18px] text-[13px] md:leading-[28px] leading-[17px]">
          Guiding Your Investments to Greatness: Our Expertise, Your Financial
          Advantage!
        </div>
      </div>
      
      <div className="flex p-[1rem] gap-[1rem] sm:p-[4rem] grid sm:grid-cols-3 grid-cols-2 sm:px-2 px-1 md:ml-0 ml-[-5px] md:mt-[-2rem]">
          {/* {expertise_data.map((expert, id) => {
            return (
              <Link
                onClick={scrollToTop}
                to={`/ra-detail/${expert.id}`}
                key={expert.id}
                className="md:w-[384px] md:h-[400px] w-full h-[270px] rounded-[11px] md:mt-0 mt-[16px] p-2 relative flex flex-col items-center hover:bg-[#18181B] hover:opacity[50%] transition duration-150 ease-in-out"
                >
                  <div className="w-[72px] h-[98px] sm:w-[384px] sm:h-[219px]  relative profile-image_1 mb-4">
                    <img
                      src={expert.icon}
                      alt="background"
                      className="absolute top-0 left-0 w-full h-full object-contain rounded-t-[11px]"
                    />
                    <img
                      src={expert.userImg}
                      alt="User"
                      className="absolute top-0 left-0 w-full h-full object-contain rounded-t-[11px]"
                    />
                  </div>

                  <div className="w-[154px] h-[22px] sm:w-[319px] sm:h-[40px] flex justify-between px-[5px] sm:px-[1rem]">
                    <div className="flex flex-col h-[22px] w-full md:h-[40px] gap-2">
                      <span className="sm:text-[18px] text-[12px] sm:leading-[18px] leading-[8px] font-[500] text-lightWhite">
                        {expert.name}
                      </span>
                      <span className="sm:text-[13px] text-[10px] sm:leading-[16px] leading-[9.6px] font-[400] text-dimWhite">
                        {expert.title}
                      </span>
                    </div>
                    <div className="sm:w-[48px] sm:h-[22px] w-[21px] h-[10px] flex">
                      <img
                        src={expert.ratingIcon}
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
                        {expert.experience}
                      </span>
                      <span className="text-lightWhite font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                        {expert.totalExp}
                      </span>
                    </div>
                    <div className="sm:w-[1.4px] sm:h-[40px] w-[0.4px] h-[16px] bg-lightWhite"></div>
                    <div className="flex">
                      <div className="flex flex-col sm:w-[78px] sm:h-[50px] w-[43px] h-[22px] items-center">
                        <span className="text-dimWhite font-[400] sm:text-[13px] sm:leading-[16px] text-[9px] leading-[10px]">
                          {expert.followers}
                        </span>
                        <span className="text-lightWhite font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                          {expert.totalFollowers}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-[300px] md:h-[32px] md:mt-2 w-full md:pl-[5px]">
                    <div className="text-dimWhite md:text-[14px] flex md:flex-row flex-col text-[11px] md:leading-[18px] leading-[14px] md:pl-0 pl-[2px]">
                      <span>SEBI:</span> <span className="text-white md:ml-2">{expert.content}</span>
                    </div>
                  </div>

                  <div className="md:w-[211px] md:h-[40px] bg-[#0081F1] w-[146px] h-[38px] flex items-center justify-center rounded-[21.5px] mt-2 md:mt-0">
                    <div className="flex justify-center items-center gap-2">
                      <img
                        src={expert.telegram}
                        alt="Telegram"
                        className="md:w-[24px] md:h-[24px] w-[16px] h-[16px]"
                      />
                      <button className="text-white font-[400] md:text-[15px] text-[12px] leading-[19px]">
                        {expert.greet}
                      </button>
                      <img
                        src={expert.arrowIcon}
                        alt="arrow"
                        className="md:w-[16px] md:h-[16px] w-[11px] h-[11px]"
                      />
                    </div>
                  </div>
              </Link>
            );
          })} */}
          
        </div>
    </div>
  );
};

export default SavedProfile;
