import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../style";
import { FaCheckSquare } from "react-icons/fa";
import { demoImg, userBck, userImg } from "../../assets";
import FAQs2 from "../About/FAQs2";
import MinorSubFeatured from "./MinorSubFeatured";
import HowMinorWorks from "./HowMinorWorks";
import Loader from "./Loader";
import "./Minor.css";
import SubscriptionMinorPopup from "../Subscription RA/SubscriptionMinorPopup";
import { useUserSession } from "../../constants/userContext";
import SubscriptionExistsPopup from "./SubscriptionExistsPopup";
import LoginSignupPopup from "../LoginSignupPopup";

const MinorSub = () => {
  const { id } = useParams();
  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState(null);
  const [planMonthlyPrice, setPlanMonthlyPrice] = useState(0);
  const [chatID, setChatID] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isCustom, setIsCustom] = useState("");
  const [durationMonth, setDurationMonth] = useState("");
  const [signupPopup, setSignupPopup] = useState(false);
  const [setOneTimePopup, setSetOneTimePopup] = useState(false);
  const { userData } = useUserSession();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://copartners.in:5009/api/Subscription/${id}`
      );
      setExpertData(response.data.data);
    } catch (error) {
      console.error("Error fetching expert data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const checkSpecialSubscription = async () => {
    if (userData?.id) {
      try {
        const response = await axios.get(
          `https://copartners.in:5009/api/Subscriber/GetByUserId/${userData.id}`
        );

        const subscriptions = response.data.data;

        // Check for matching subscriptionId and isSpecialSubscription true
        return subscriptions.some(
          (subscription) =>
            subscription.subscriptionId === id &&
            subscription.subscription.isSpecialSubscription
        );
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const init = async () => {
      const hasSpecialSubscription = await checkSpecialSubscription();
      if (hasSpecialSubscription) {
        setSetOneTimePopup(true);
        return;
      }

      await fetchData(); // Ensure expertData is fetched and set

      // Check if expertData and userData are available after fetchData completes
      // if (userData && expertData) {
      //   handleBuyNowClick(
      //     expertData.id,
      //     expertData.planType,
      //     expertData.amount,
      //     expertData.isCustom,
      //     expertData.durationMonth,
      //     expertData.chatId
      //   );
      // }
    };

    init();
  }, [id, userData, expertData]); // Adding dependencies to re-run when userData or expertData changes

  // useEffect(() => {
  //   if (userData && expertData) {
  //     handleBuyNowClick(
  //       expertData.id,
  //       expertData.planType,
  //       expertData.amount,
  //       expertData.isCustom,
  //       expertData.durationMonth,
  //       expertData.chatId
  //     );
  //   }
  // }, [userData, expertData]);

  const handleBuyNowClick = (
    subscriptionId,
    plan,
    price,
    isCustom,
    durationMonth,
    chatId
  ) => {
    if (!userData) {
      setSignupPopup(true);
    } else {
      setSelectedMonthlyPlan(plan);
      setPlanMonthlyPrice(price);
      setShowMonthlyPopup(true);
      setSubscriptionId(subscriptionId);
      setIsCustom(isCustom);
      setDurationMonth(durationMonth);
      setChatID(chatId);
    }
  };

  const handleClosePopup = () => {
    setShowMonthlyPopup(false);
    setSignupPopup(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!expertData) {
    return <div>No data found</div>;
  }

  return (
    <div className="expertise-Bgn">
      <section
        className={`flex md:flex-row flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bgn`}
      >
        <div className={`flex-1 ${styles.flexStart} flex-col md:px-28 z-10`}>
          <div className="flex flex-col justify-between items-center w-full">
            <h1 className="font-inter text-center font-[700] md:w-[900px] md:text-[62px] text-[30px] text-black md:leading-[74px] leading-[40px]">
              Get {expertData.planType} Access to{" "}
              {expertData.experts.channelName} Premium
            </h1>
          </div>

          <div
            key={expertData.id}
            className="flex flex-col justify-center items-center w-full mt-5"
          >
            <div className="webinarProfile flex flex-row justify-around border-[1px] border-gray-300 rounded-[10px] items-center w-full relative p-4">
              <span className="bg-gray-200 border-[1px] border-gray-300 text-black text-sm font-medium me-2 px-2.5 py-0.5 rounded absolute top-2 right-2">
                Premium🌟
              </span>
              <div className="flex flex-col justify-between ">
                <h1 className="text-[20px] text-black font-bold">
                  {expertData.experts.channelName} Premium
                </h1>
                <h1 className="text-[14px] font-semibold text-black ">
                  {expertData.experts.name} -{" "}
                  {getExpertType(expertData.experts.expertTypeId)}
                </h1>
                <div className="border-gray-300 mt-2 pt-1 flex justify-start">
                  <div className="border-r border-gray-300 pr-7 lg:px-12 text-center">
                    <p className="text-gray-700">Experience</p>
                    <p className="mb-1 text-gray-700">
                      {expertData.experts.experience}+
                    </p>
                  </div>
                  <div className="pl-7 lg:px-12 text-center">
                    <p className="text-gray-700">Followers</p>
                    <p className="mb-1 text-gray-700">
                      {(expertData.experts.telegramFollower / 1000).toFixed(1)}k
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-[14px] text-black">
                  SEBI: <span>{expertData.experts.sebiRegNo}</span>
                </div>
              </div>
              <div className="relative flex-shrink-0 h-[150px] w-[150px] md:h-[150px] md:w-[150px] rounded-xl">
                <div className="relative h-full w-full">
                  <img
                    src={userBck}
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  <img
                    src={expertData.experts.expertImagePath}
                    alt="Expert"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      zIndex: 0,
                      maskImage:
                        "linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="w-full px-4 flex flex-col justify-center items-center mt-2">
              <button
                onClick={() =>
                  handleBuyNowClick(
                    expertData.id,
                    expertData.planType,
                    expertData.amount,
                    expertData.isCustom,
                    expertData.durationMonth,
                    expertData.chatId
                  )
                }
                className="w-full md:w-[1000px] text-white bg-[#006ADC] css-btn text-[15px] font-semibold md:py-3 py-4 rounded-md highlightBtnFadeIn"
              >
                Buy Now at ₹<span className="">{expertData.amount}</span>
              </button>
              <div className="inline-block bg-gradient-to-r mt-2 from-[#00c394] to-[#00a143] text-black py-1 px-3 rounded-lg md:text-sm text-[0.8rem] ">
                <i className="fas fa-clock"></i>
                Limited Time Offer
              </div>
            </div>
            <ul className="mt-4 text-left px-6 text-gray-700 md:text-[18px] text-[15px] md:block list-none space-y-2">
              <li className="flex items-center space-x-2 text-[18px]">
                <span className="inline-block text-green-500">
                  <FaCheckSquare />
                </span>
                <span>Daily 5-6 Premium Calls</span>
              </li>
              <li className="flex items-center space-x-2 text-[18px]">
                <span className="inline-block text-green-500">
                  <FaCheckSquare />
                </span>
                <span>Better Accuracy, Best Rates</span>
              </li>
              <li className="flex items-center space-x-2 text-[18px]">
                <span className="inline-block text-green-500">
                  <FaCheckSquare />
                </span>
                <span>Direct Access to SEBI Registered Analyst</span>
              </li>
            </ul>
          </div>

          <MinorSubFeatured />

          <div className="flex md:flex-row sm:flex-col flex-col">
            <HowMinorWorks
              handleBuyNowClick={handleBuyNowClick}
              expertData={expertData}
            />
          </div>
          <div className="md:mt-8 mt-10">
            <FAQs2 />
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-transparent shadow-lg z-40">
        <div className="flex flex-col items-center bg-[#f7f7f7] px-4 py-2 gap-4">
          <div className="flex-1 text-[#000] text-left w-full">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-md font-semibold opacity-50">
                    Amount:
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="text-lg text-[#000] font-bold opacity-50">
                      <del>₹{(expertData.amount * 1.5).toFixed(0)}</del>
                    </span>
                    <span className="text-2xl font-bold text-[#000]">
                      ₹{expertData.amount}
                    </span>
                  </div>
                </div>
                <p className="text-[#000] text-sm pt-1 font-bold">
                  {expertData.planType} Access
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#00c394] to-[#00a143] text-[#fff] py-1 px-3 rounded-lg font-bold text-sm flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Limited Time Offer
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              handleBuyNowClick(
                expertData.id,
                expertData.planType,
                expertData.amount,
                expertData.isCustom,
                expertData.durationMonth,
                expertData.chatId
              )
            }
            className="text-lg px-5 rounded-lg w-full font-semibold css-btn flex items-center justify-center py-3 bg-[#006ADC] hover:bg-[#0049dc] text-[#fff] hover:text-white"
          >
            Buy Now
          </button>
        </div>
      </div>
      {showMonthlyPopup && (
        <SubscriptionMinorPopup
          onClose={handleClosePopup}
          selectedMonthlyPlan={selectedMonthlyPlan}
          planMonthlyPrice={planMonthlyPrice}
          expertName={expertData.experts.channelName}
          mobileNumber={userData.mobileNumber}
          chatId={chatID}
          subscriptionId={subscriptionId}
          userId={userData.id}
          isCustom={isCustom}
          durationMonth={durationMonth}
        />
      )}
      {signupPopup && (
        <LoginSignupPopup
          onClose={handleClosePopup}
          subscriptionIdParams={id}
          planMonthlyPrice={expertData.amount}
        />
      )}
      {setOneTimePopup && <SubscriptionExistsPopup />}
    </div>
  );
};

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

export default MinorSub;
