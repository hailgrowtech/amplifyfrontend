import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUserData } from '../../constants/context';

const LiveWebinar = () => {
  const userData = useUserData();
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

  const handleCardClick = (id) => {
    navigate(`/webinar/expert/${id}`);
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto">
      <Slider {...settings}>
        {userData &&
          userData.map((expert, id) => (
            <div key={expert.id} className="p-2" onClick={() => handleCardClick(expert.id)}>
              <div className="box-border md:h-[310px] xl:h-auto flex flex-col justify-start items-center w-full md:p-1 p-3 bg-[#18181B] border-[#ffffff21] border-[1px] rounded-xl relative cursor-pointer">
                <div className="md:p-4 relative z-10 w-full">
                  <div className="flex flex-row justify-between">
                    <span>Friday - 10 July | 10:00AM </span>
                    <span>3hrs</span>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="md:h-18 h-14 md:w-18 w-14 rounded-full border-2 bg-[#000] border-[#006adc40] overflow-hidden mr18">
                        <img
                          src={expert.expertImagePath}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="md:text-[20px] font-semibold text-lightWhite text-left">
                          {expert.name}
                        </h3>
                        <p className="text-[18px] font-medium text-dimWhite">
                          {getExpertType(expert.expertTypeId)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-white mt-2 pt-1 flex justify-start">
                    <h3 className="text-gradient text-[28px] font-bold">Option Treading Tips Earn More</h3>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button className="bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 w-full rounded-xl hover:bg-gray-200 hover:text-[#000] text-base text-white py-2 px-8">
                      Buy Now at ₹1,999
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default LiveWebinar;
