import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useUserData } from "../../constants/context";
import { telegram, userBck } from "../../assets/index";
import SubscriptionPaymentPopup from "../Subscription RA/SubscriptionPaymentPopup";
import { useUserSession } from "../../constants/userContext";
import SignUp2 from "../Signup2";
import SignUp3 from "../MinorSubscription/SignUp3";
import SubscriptionMinorPopup from "../Subscription RA/SubscriptionMinorPopup";
import LoginSignupPopup from "../LoginSignupPopup";

const BuyNowCards = () => {
  const products = useUserData();
  const [selectedType, setSelectedType] = useState(3); // Default to "Futures & Options"
  const [subscriptions, setSubscriptions] = useState({}); // Store subscriptions per expert
  const sliderRefs = useRef({}); // To store references to each slider
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState(null);
  const [planMonthlyPrice, setPlanMonthlyPrice] = useState(0);
  const [chatID, setChatID] = useState("");
  const [isCustom, setIsCustom] = useState("");
  const [durationMonth, setDurationMonth] = useState("");
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [subscriptionId, setsubscriptionId] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [freeCalls, setFreeCalls] = useState(false);
  const [openLink, setOpenLink] = useState(null);
  const { userData } = useUserSession();

  const token = localStorage.getItem("userId");

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

  const handleTelegram = (e, link) => {
    e.stopPropagation();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "join",
    });

    setOpenLink(link);
    if (token) {
      window.open(link);
    } else {
      setFreeCalls(true);
      setShowSignUp(true);
    }
  };

  const handleSignUpComplete = (link) => {
    setShowSignUp(false);
    if (link) {
      window.open(link, "_blank");
    }
    window.location.reload();
  };

  const handleTabClick = (typeId) => {
    setSelectedType(typeId);
  };

  const fetchSubscriptions = async (expertId) => {
    try {
      const response = await fetch(
        `https://copartners.in:5009/api/Subscription/GetByExpertsId/${expertId}`
      );
      if (!response.ok) {
        throw new Error("Error in fetching subscriptions");
      }
      const data = await response.json();
      setSubscriptions((prevSubscriptions) => ({
        ...prevSubscriptions,
        [expertId]: data.data && data.data.filter(
          (subscription) =>
            !subscription.isSpecialSubscription &&
            parseInt(subscription.serviceType) === selectedType
        ),
      }));
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
    }
  };

  useEffect(() => {
    products.forEach((product) => {
      fetchSubscriptions(product.id);
    });
  }, [products, selectedType]); // Fetch subscriptions again when selectedType changes

  const sliderSettings = (subscriptionCount) => ({
    infinite: subscriptionCount > 1, // Enable infinite scroll only if there's more than one subscription
    speed: 500,
    slidesToShow: subscriptionCount > 1 ? 3 : 1, // Show 1 slide if there's only one subscription
    slidesToScroll: subscriptionCount > 1 ? 1 : 1,
    arrows: false,
    autoplay: subscriptionCount > 1, // Enable autoplay only if there's more than one subscription
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: subscriptionCount > 1 ? 2 : 1, // Adjust for mobile
          slidesToScroll: 1,
        },
      },
    ],
  });

  useEffect(() => {
    // Scroll to discounted subscription cards
    Object.keys(sliderRefs.current).forEach((expertId) => {
      const slider = sliderRefs.current[expertId];
      const discountedIndex = subscriptions[expertId]?.findIndex(
        (sub) => sub.discountedAmount < sub.amount
      );

      if (discountedIndex !== -1 && slider) {
        slider.slickGoTo(discountedIndex);
        slider.slickPause(); // Stop auto-scroll when there is a discounted subscription
      }
    });
  }, [subscriptions]);

  const handleBuyNowClick = (
    subscriptionId,
    plan,
    price,
    isCustom,
    durationMonth,
    chatId,
    channelName
  ) => {
    if (!userData) {
      setsubscriptionId(subscriptionId);
      setPlanMonthlyPrice(price);
      setShowSignupPopup(true);
    } else {
      setChannelName(channelName);
      setsubscriptionId(subscriptionId);
      setSelectedMonthlyPlan(plan);
      setPlanMonthlyPrice(price);
      setShowMonthlyPopup(true);
      setIsCustom(isCustom);
      setDurationMonth(durationMonth);
      setChatID(chatId);
    }
  };

  const handleClosePopup = () => {
    setShowSignUp(false);
    setShowMonthlyPopup(false);
    setShowSignupPopup(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      subscriptions[product.id] && subscriptions[product.id].length > 0
  );

  return (
    <div className="container mx-auto">
      <div className="expertTabs flex justify-evenly mb-4 p-2 bg-gray-100 rounded-lg shadow-lg">
        <button
          onClick={() => handleTabClick(3)}
          className={`w-full py-2 mx-2 transition duration-300 ease-in-out transform hover:scale-105 md:text-[10px] text-[12px] ${
            selectedType === 3
              ? "bg-gradient-to-r text-gray-700 bg-gray-200 rounded-[5px] font-bold shadow-lg"
              : "text-black rounded-[5px]"
          }`}
        >
          F&O
        </button>
        <div className="border-[1px]"></div>
        <button
          onClick={() => handleTabClick(2)}
          className={`w-full py-2 mx-2 transition duration-300 ease-in-out transform hover:scale-105 md:text-[10px] text-[12px] ${
            selectedType === 2
              ? "bg-gradient-to-r text-gray-700 bg-gray-200 rounded-[5px] font-bold shadow-lg"
              : "text-black rounded-[5px]"
          }`}
        >
          Equity
        </button>
        <div className="border-[1px]"></div>
        <button
          onClick={() => handleTabClick(1)}
          className={`w-full py-2 mx-2 transition duration-300 ease-in-out transform hover:scale-105 md:text-[10px] text-[12px] ${
            selectedType === 1
              ? "bg-gradient-to-r text-gray-700 bg-gray-200 rounded-[5px] font-bold shadow-lg"
              : "text-black rounded-[5px]"
          }`}
        >
          Commodity
        </button>
      </div>

      <div className="">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="p-2 text-gray-900 flex flex-col gap-2"
          >
            <div className="ExpertChannel text-center font-semibold text-gray-900 md:mb-6 mb-3 flex flex-row justify-between items-center uppercase">
              <span className="flex justify-center items-center gap-1">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <div className="flex flex-col">
                  <h1 className="text-[18px] text-left">
                    {product.channelName}
                  </h1>
                  <span className="md:hidden block text-left">{product.sebiRegNo}</span>
                </div>
                <span className="gap-1 md:block hidden">
                  - {product.sebiRegNo}
                </span>
              </span>
              <button
                className="text-[12px] bg-gray-50 px-1 py-2 font-medium border-[1px] border-black border-opacity-30 rounded-[30px] flex flex-row justify-center items-center w-[120px]"
                onClick={(e) => handleTelegram(e, product.telegramChannel)}
              >
                Get Free Calls{" "}
                <img src={telegram} alt="" className="w-5 ml-1" />
              </button>
            </div>
            {showSignUp && (
              <LoginSignupPopup
                onComplete={() => handleSignUpComplete(openLink)}
                onClose={handleClosePopup}
                freeCalls={freeCalls}
              />
            )}

            <div className="flex flex-row gap-1 relative">
              <Link
                to={`/ra-detail/${product.id}?type=${selectedType}`}
                className="transition duration-150 ease-in-out expertCard mr-3 relative z-10 rounded-2xl flex flex-col justify-end"
              >
                <div className="absolute bg-white inset-0 w-full h-full z-0 rounded-2xl">
                  <img
                    src={userBck}
                    alt="Background"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 w-full h-full z-1">
                  <img
                    src={product.expertImagePath}
                    alt={product.name}
                    className="w-full h-[90%] object-cover rounded-2xl"
                    // style={{
                    //   maskImage:
                    //     "linear-gradient(rgba(0, 0, 0, 8) 40%, transparent)",
                    // }}
                  />
                </div>
                {/* <div className="absolute inset-0 bg-glass z-2"></div> */}
                <div className="relative z-3 p-1 flex flex-col items-start justify-end border-[1px] border-black border-opacity-60 md:w-[180px] md:h-[80px] w-[130px] h-[55px] bg-white rounded-2xl shadow-lg custom-gradient">
                  <h3 className="md:text-lg text-[12px] font-medium text-black text-left mx-auto">
                    {product.name}
                  </h3>
                  {/* <h3 className="text-gray-700 font-[600] sm:text-[15px] text-left sm:leading-[18px] text-[10px] leading-[10px]">
                    {getExpertType(product.expertTypeId)}
                  </h3> */}
                  <div className="flex items-center mt-[0.5px] justify-around w-full">
                    <div className="flex flex-col items-center justify-between">
                      <span className="text-gray-500 font-[400] text-[13px] md:block hidden">
                        Experience
                      </span>
                      <span className="text-gray-500 font-[400] text-[9px] md:hidden sm:hidden lg:hidden">
                        Experience
                      </span>
                      <span className="text-gray-700 font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                        {product.experience}+
                      </span>
                    </div>
                    <div className="w-[1px] h-[20px] bg-gray-300"></div>
                    <div className="flex">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-500 font-[400] text-[13px] md:block hidden">
                          Followers
                        </span>
                        <span className="text-gray-500 font-[400] text-[9px] md:hidden sm:hidden lg:hidden">
                          Followers
                        </span>
                        <span className="text-gray-700 font-[600] sm:text-[15px] sm:leading-[18px] text-[10px] leading-[10px]">
                          {`${product.telegramFollower / 1000}k`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="subs-cards container md:w-[60rem]">
                {subscriptions[product.id]?.length > 1 ? (
                  <Slider
                    {...sliderSettings(subscriptions[product.id].length)}
                    ref={(el) => (sliderRefs.current[product.id] = el)}
                  >
                    {subscriptions[product.id]
                      ?.sort((a, b) => a.discountedAmount - b.discountedAmount)
                      .map((subscription) => (
                        <div className="slide" key={subscription.id}>
                          <div
                            className={`relative flex flex-col h-[170px] md:h-[200px] justify-center items-start p-2 rounded-2xl bg-gray-200 ${
                              subscription.discountedAmount <
                              subscription.amount
                                ? "bg-[#ebf1f7]"
                                : ""
                            }`}
                          >
                            {subscription.discountedAmount <
                              subscription.amount && (
                              <span className="discount-badge text-yellow-500 bg-yellow-200">
                                {subscription.discountPercentage}%
                              </span>
                            )}
                            <div className="text-lg mb-1 font-bold">
                              {subscription.planType}
                            </div>
                            {subscription.discountedAmount <
                              subscription.amount && (
                              <>
                                <div className="text-[12px] line-through mb-1 text-gray-500">
                                  ₹{subscription.amount}
                                </div>
                              </>
                            )}
                            <div className="text-3xl font-bold mb-1 text-gray-900">
                              ₹
                              {subscription.discountedAmount <
                              subscription.amount
                                ? subscription.discountedAmount
                                : subscription.amount}
                            </div>
                            <div className="text-[12px] mb-2 opacity-70 text-gray-700">
                              {subscription.durationMonth}{" "}
                              {subscription.isCustom ? "Days" : "Months"} Access
                            </div>
                            <button
                              onClick={() =>
                                handleBuyNowClick(
                                  subscription.id,
                                  subscription.planType,
                                  subscription.discountedAmount,
                                  subscription.isCustom,
                                  subscription.durationMonth,
                                  subscription.chatId,
                                  subscription.experts.channelName
                                )
                              }
                              className={`my-1 w-full md:px-4 md:py-2 py-2 text-white text-[14px] rounded-lg font-semibold ${
                                subscription.discountedAmount <
                                subscription.amount
                                  ? "animate-pulse bg-gradient-to-r from-purple-500 to-blue-500"
                                  : "bg-gradient-to-r from-purple-500 to-blue-500"
                              }`}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      ))}
                  </Slider>
                ) : (
                  // Render the single subscription without using the Slider
                  subscriptions[product.id]?.map((subscription) => (
                    <div className="slide" key={subscription.id}>
                      <div
                        className={`relative flex flex-col h-[170px] md:h-[200px] justify-center items-start p-2 rounded-2xl bg-gray-200 ${
                          subscription.discountedAmount < subscription.amount
                            ? "bg-[#ebf1f7]"
                            : ""
                        }`}
                      >
                        {subscription.discountedAmount <
                          subscription.amount && (
                          <span className="discount-badge text-yellow-500 bg-yellow-200">
                            {subscription.discountPercentage}%
                          </span>
                        )}
                        <div className="text-lg mb-1 font-bold">
                          {subscription.planType}
                        </div>
                        {subscription.discountedAmount <
                          subscription.amount && (
                          <>
                            <div className="text-[12px] line-through mb-1 text-gray-500">
                              ₹{subscription.amount}
                            </div>
                          </>
                        )}
                        <div className="text-3xl font-bold mb-1 text-gray-900">
                          ₹
                          {subscription.discountedAmount < subscription.amount
                            ? subscription.discountedAmount
                            : subscription.amount}
                        </div>
                        <div className="text-[12px] mb-2 opacity-70 text-gray-700">
                          {subscription.durationMonth}{" "}
                          {subscription.isCustom ? "Days" : "Months"} Access
                        </div>
                        <button
                          onClick={() =>
                            handleBuyNowClick(
                              subscription.id,
                              subscription.planType,
                              subscription.discountedAmount,
                              subscription.isCustom,
                              subscription.durationMonth,
                              subscription.chatId,
                              subscription.experts.channelName
                            )
                          }
                          className={`my-1 w-full md:px-4 md:py-2 py-2 text-white text-[14px] rounded-lg font-semibold ${
                            subscription.discountedAmount < subscription.amount
                              ? "animate-pulse bg-gradient-to-r from-purple-500 to-blue-500"
                              : "bg-gradient-to-r from-purple-500 to-blue-500"
                          }`}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {showMonthlyPopup && (
                <SubscriptionMinorPopup
                  onClose={handleClosePopup}
                  selectedMonthlyPlan={selectedMonthlyPlan}
                  planMonthlyPrice={planMonthlyPrice}
                  expertName={channelName}
                  mobileNumber={userData.mobileNumber}
                  chatId={chatID}
                  subscriptionId={subscriptionId}
                  userId={userData.id}
                  isCustom={isCustom}
                  durationMonth={durationMonth}
                />
              )}
              {showSignupPopup && (
                <LoginSignupPopup
                  subscriptionIdParams={subscriptionId}
                  onClose={handleClosePopup}
                  planMonthlyPrice={planMonthlyPrice}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyNowCards;
