import React, { useState } from "react";
import copartnerBlack from "../../assets/LandingPages/copartner-black.png";
import verify from "../../assets/LandingPages/image 30.png";
import copartner from "../../assets/LandingPages/IMG_4367.png";
import { arrow, stars, telegram } from "../../assets/LandingPages";
import Ad1Popup from "./Ad1Popup";
import { useUserData } from "../../constants/context";

const Ad1 = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const userData = useUserData();

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // const navigate = useNavigate();

  const handleClickLink = (link) => {
    // if (!token) {
    //   navigate("/login", { state: { link } });
    // } else {
    window.open(link);
    // }
  };

  return (
    <div className="bg-white">
      <div className="flex">
        {/* <img className="w-12 h-12 mr-4" src={option} alt="logo" /> */}
        <div>
          <img className="w-32" src={copartnerBlack} alt="" />
          {/* <h1 className="font-bold">Copartner.in</h1> */}
          {/* <p className="opacity-50 text-xs">Welcome To The Rich Club</p> */}
        </div>
      </div>
      {userData.map((expert, id) => {
        return (
          <section className="ad1-section" key={expert.id}>
            <div className="content w-full border-2 rounded-2xl ad1-bg">
              <div className="flex justify-between">
                <div className="text-center ml-4">
                  <p className=" text-gray-500 text-base">Followers</p>
                  <p className="text-base font-bold">
                    {expert.telegramFollower / 1000}k
                  </p>
                </div>
                <div className="mr-4">
                  <p className="flex text-base font-bold">
                    <img className="w-4 h-4" src={stars} alt="stars" />
                    {expert.rating}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <img
                    className="w-28 h-28 rounded-full"
                    src={expert.expertImagePath}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <p className="font-bold text-xl">{expert.channelName}</p>
                  <p className="text-gray-500 text-base font-semibold">
                    SEBI: {expert.sebiRegNo}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-5 h-5" src={verify} alt="" />
                    <span className="text-gray-500 text-base">Verify By</span>
                    <button>
                      <img
                        className="w-16 h-4"
                        src={copartner}
                        alt="copartner"
                      />
                    </button>
                  </div>
                  <button className="flex w-3/4 mx-auto gap-2 bg-[#0081F1] rounded-full text-white justify-center items-center">
                    <img className="w-4 h-4" src={telegram} alt="" />
                    <span
                      onClick={() => handleClickLink(expert.link)}
                      className="py-2 text-base"
                    >
                      Get Free Calls
                    </span>
                    <img className="w-4 h-4" src={arrow} alt="" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <hr />
      <section className="ad1-section text-center font-bold text-base">
        <p className="text-base opacity-80">Don’t Have Demat Account ?</p>
        <button
          onClick={openPopup}
          className="text-white bg-[black] rounded mb-4 px-6 py-1 mt-4"
        >
          <span className="text-base font-normal">Open Now</span>
        </button>
        <Ad1Popup isOpen={isPopupOpen} onClose={closePopup} />
      </section>
      <section className="ad1-section text-center pt-0">
        <p className="text-xl">Disclaimer</p>
        <p className="opacity-80 text-base">
          Investments in securities market are subject to market risks, read all
          the related documents carefully before investing. For further
          disclosures visit our website
        </p>
      </section>
    </div>
  );
};

export default Ad1;
