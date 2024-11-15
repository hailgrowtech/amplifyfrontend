import React, { useEffect, useState } from "react";
import styles from "../../style";
import "./SubscriptionRA.css";
import { ToastContainer, toast } from "react-toastify";
import {
  arrow,
  bookmark,
  bookmarkFill,
  duration,
  stars,
  empty,
  verifiedCheck,
} from "../../assets";
import SubscriptionPaymentPopup from "./SubscriptionPaymentPopup";
import FAQs2 from "../About/FAQs2";
import CoursePaymentPopup from "./CoursePaymentPopup";
import MobileCourse from "./MobileCourse";
import { useLocation, useParams } from "react-router-dom";
import { useUserSession } from "../../constants/userContext";
import { motion, AnimatePresence } from "framer-motion";
// import KYCPopup from "./KYCPopup";
// import LinkPopup from "../InviteLink/LinkPopup";
import SignUp2 from "../Signup2";
import Stock from "../Stock";
import SignUp3 from "../MinorSubscription/SignUp3";
import { MdDiscount } from "react-icons/md";
import SubscriptionMinorPopup from "../Subscription RA/SubscriptionMinorPopup";
import LoginSignupPopup from "../LoginSignupPopup";
import { FiCheck } from "react-icons/fi";

const SubscriptionRA = ({ userId }) => {
  const { id } = useParams();
  const location = useLocation();
  const [isCardSaved, setIsCardSaved] = useState(false);
  const [expertData, setExpertData] = useState(null);
  const [activeHoverIndex, setActiveHoverIndex] = useState(0);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState(null);
  const [planMonthlyPrice, setPlanMonthlyPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planPrice, setPlanPrice] = useState(2999);
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [mobileNum, setMobileNum] = useState("");
  const [chatID, setChatID] = useState("");
  const { userData, loading } = useUserSession();
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isCustom, setIsCustom] = useState("");
  const [durationMonth, setDurationMonth] = useState("");
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedType = queryParams.get("type");
    setFilterTab(selectedType);
  }, [location.search]);

  useEffect(() => {
    if (!loading && userData) {
      setMobileNum(userData.mobileNumber);
    }
    if (expertData) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const threshold = 50;
        if (scrollPosition > threshold) {
          setShowMobilePopup(true);
        } else {
          setShowMobilePopup(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [expertData, loading, userData]);

  const handleSelectPlan = (
    subscriptionId,
    plan,
    amount,
    isCustom,
    durationMonth,
    chatId
  ) => {
    setSelectedPlan(plan);
    setPlanPrice(amount);
    setSubscriptionId(subscriptionId);
    setIsCustom(isCustom);
    setDurationMonth(durationMonth);
    setChatID(chatId);
  };

  const getExpertType = (typeId) => {
    switch (typeId) {
      case "1":
        return "Commodity";
      case "2":
        return "Equity";
      case "3":
        return "F&O";
      default:
        return "Unknown";
    }
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
      const isSpecialCourse = data.data.filter((data) => {
        return !data.isSpecialSubscription;
      });
      setSubscriptions(isSpecialCourse);
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://copartners.in:5132/api/Experts/${id}`
        );
        if (!response.ok) {
          throw new Error("Error in fetching API");
        }
        const data = await response.json();
        // setChatID(data.data.chatId);
        fetchSubscriptions(data.data.id);
        setExpertData(data.data);
      } catch (error) {
        console.error("Error fetching expert data:", error);
        toast.error("Failed to fetch expert data", {
          position: "top-right",
        });
      }
    };

    fetchData();
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = () => {
    setShowSignupPopup(false);
  };

  const handleSaveCard = () => {
    // Toggle the isCardSaved state
    setIsCardSaved(!isCardSaved);

    // Show toast notification based on the new state
    if (!isCardSaved) {
      toast.success("RA has been saved", {
        position: "top-right",
      });
    } else {
      toast.info("RA has been unsaved", {
        position: "top-right",
      });
    }
  };

  const handleSelectSubscription = (
    subscriptionId,
    planType,
    amount,
    isCustom,
    durationMonth,
    chatId
  ) => {
    setShowMobilePopup(true);
    setSelectedSubscription({
      subscriptionId,
      planType,
      amount,
      isCustom,
      durationMonth,
      chatId,
    });
  };

  const handleBuyNowClick = (
    subscriptionId,
    planType,
    amount,
    isCustom,
    durationMonth,
    chatId
  ) => {
    console.log(subscriptionId);
    if (!userData) {
      setSubscriptionId(subscriptionId);
      setPlanMonthlyPrice(amount);
      setShowSignupPopup(true);
    } else {
      setSelectedSubscription({
        subscriptionId,
        planType,
        amount,
        isCustom,
        durationMonth,
        chatId,
      });
      setSelectedMonthlyPlan(planType);
      setPlanMonthlyPrice(amount);
      setShowMonthlyPopup(true);
      setSubscriptionId(subscriptionId);
      setIsCustom(isCustom);
      setDurationMonth(durationMonth);
      setChatID(chatId);
    }
  };

  const handleMouseEnter = (index) => {
    setActiveHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveHoverIndex(0);
  };

  const handleClosePopup = () => {
    setShowMonthlyPopup(false);
  };

  const handleTelegram = (link) => {
    window.open(link);
  };

  const calculateRemainingTime = (discountValidTo) => {
    const now = new Date();
    const validTo = new Date(discountValidTo);

    const timeDifference = validTo - now;

    if (timeDifference <= 0) {
      return "Expired";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (days > 0) {
      return `${days} days ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    } else if (minutes > 0) {
      return `${minutes} minutes`;
    } else {
      return "Less than a minute";
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const [filterTab, setFilterTab] = useState("");
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    const types = subscriptions.reduce((acc, subscription) => {
      if (!acc.includes(subscription.serviceType)) {
        acc.push(subscription.serviceType);
      }
      return acc;
    }, []);

    setAvailableTypes(types);

    if (!filterTab && types.length > 0) {
      setFilterTab(types[0]); // Default to the first available type if none selected
    }
  }, [subscriptions]);

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    filterTab === "all" ? true : subscription.serviceType === filterTab
  );

  useEffect(() => {
    if (!selectedSubscription) {
      const recommendedOrDiscountedSubscription = filteredSubscriptions
        .slice()
        .sort((a, b) => a.amount - b.amount)
        .find((subscription, index) => {
          const isDiscounted =
            subscription.discountedAmount < subscription.amount;
          const isRecommended =
            filteredSubscriptions.every(
              (sub) => sub.discountedAmount >= sub.amount
            ) && index === 1;
          return isRecommended || isDiscounted;
        });

      if (recommendedOrDiscountedSubscription) {
        setSelectedSubscription({
          subscriptionId: recommendedOrDiscountedSubscription.id,
          planType: recommendedOrDiscountedSubscription.planType,
          amount:
            recommendedOrDiscountedSubscription.discountedAmount <
            recommendedOrDiscountedSubscription.amount
              ? recommendedOrDiscountedSubscription.discountedAmount
              : recommendedOrDiscountedSubscription.amount,
          isCustom: recommendedOrDiscountedSubscription.isCustom,
          durationMonth: recommendedOrDiscountedSubscription.durationMonth,
          chatId: recommendedOrDiscountedSubscription.chatId,
        });
      }
    }
  }, [filteredSubscriptions, selectedSubscription]);

  const shouldHideTabs = availableTypes.length <= 1;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!expertData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <section
      className={`flex md:flex-row flex-col md:px-0 px-3 sm:pt-32 sm:pb-16 pt-[4rem] pb-12 expertise-Bgn`}
    >
      <div
        key={expertData.id}
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 md:px-28 md:bottom-[10rem] font-inter`}
      >
        {/* <section className="subscription-RA-bg flex flex-row justify-between bg-white relative w-full md:p-[30px] p-[16px] md:pb-0 border-2 border-gray-200 rounded-xl md:mb-8">
          <div className="text-black">
            <div className="flex flex-col md:mb-6 mb-1">
              <div className="flex justify-between items-center w-full">
                <span
                  className="flex-1 font-bold md:text-[72px] text-[26px]
          text-gradient md:leading-[88px] leading-[30px] md:pb-3"
                >
                  {expertData.channelName}
                </span>
              </div>
              <span className="font-normal md:text-[22px] text-[12px]">
                {expertData.name} - {getExpertType(expertData.expertTypeId)}
              </span>
            </div>
            <div className="flex justify-between md:w-[350px] w-[176px] md:h-16 h-10 md:mb-6 mb-3">
              <div className="flex flex-col items-center justify-around">
                <div className="text-[15px] text-gray-500">Experience</div>
                <div className="md:text-xl text-xs font-semibold">
                  {expertData.experience}+
                </div>
              </div>
              <div className="w-[1px] md:h-16 h-10 bg-black"></div>
              <div className="flex flex-col items-center justify-around">
                <div className="text-[15px] text-gray-500">Followers</div>
                <div className="md:text-xl text-xs font-semibold">
                  {`${expertData.telegramFollower / 1000}k`}
                </div>
              </div>
            </div>
            <div className="md:text-lg text-sm md:font-semibold md:w-[508px] md:mb-4 mb-2">
              <span className="text-gray-500">SEBI:</span>{" "}
              {expertData.sebiRegNo}
            </div>
            <div
              onClick={() => handleTelegram(expertData.telegramChannel)}
              className="bg-blue-500 md:block hidden md:rounded-3xl rounded-2xl md:w-44 w-32 md:mb-6"
            >
              <button className="flex mx-auto md:py-2 py-1 items-center text-white">
                <span className="md:text-base text-xs">Get Free Calls</span>
                <img className="w-4 ms-3" src={arrow} alt="arrow icon" />
              </button>
            </div>
          </div>
          <div className="flex mx-auto">
            <img
              className="subscription-RA-img md:w-[400px] md:h-[350px] h-[132] w-[470px] my-auto"
              src={expertData.expertImagePath}
              style={{
                maskImage: "linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)",
              }}
              alt=""
            />
          </div>
          <div className="flex text-black items-end absolute top-6 right-6">
            <img
              className="md:w-8 w-4 md:h-8 h-4 me-1"
              src={stars}
              alt="star icon"
            />
            <span className="md:text-3xl text-sm">{expertData.rating}</span>
          </div>
        </section> */}
        <section className="flex flex-row justify-between bg-white md:w-full w-screen md:ml-0 -ml-3 md:mb-8 md:mt-0 mt-4 mb-2 px-6 py-3 md:py-6 shadow-md rounded-lg">
          <div className="flex items-center">
            <div className="w-16 h-16">
              <img
                className="rounded-full w-full h-full object-cover"
                src={expertData.expertImagePath}
                alt=""
              />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <h1 className="font-semibold text-lg md:text-xl">
                {expertData.channelName}
              </h1>
              <p className="text-[#9C9C9C] text-sm md:text-base">
                {expertData.name}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <img className="w-6 h-6 md:w-8 md:h-8" src={verifiedCheck} alt="" />
            <h1 className="ml-2 text-sm md:text-base font-medium">SEBI Reg.</h1>
          </div>
        </section>
        {/* <section className="w-full md:block hidden">
          <div className="w-full flex flex-row bg-white rounded-2xl">
            <div className="md:flex-col-6 md:text-[16px] text-[12px] flex flex-row md:mx-px mx-auto">
              <button
                onClick={() => handleTabClick("subscriptions")}
                className={`hover:text-black text-gray-500 md:flex-col-3 rounded-full p-2 md:px-6 md:py-5 mx-2 md:text-[1rem] text-[9.5px] ${
                  activeTab === "subscriptions" ? "bg-gray-300" : ""
                }`}
              >
                Subscription Plans
              </button>
              <button
                onClick={() => handleTabClick("highlights")}
                className={`md:flex-col-3 md:px-6 md:py-5 mx-2 rounded-full p-2 md:text-[1rem] text-[9.5px] text-gray-500 hover:text-black ${
                  activeTab === "highlights" ? "bg-gray-300" : ""
                }`}
              >
                Key Highlights
              </button>
              <button
                onClick={() => handleTabClick("about")}
                className={`md:flex-col-3 md:px-6 md:py-5 mx-2 rounded-full p-2 md:text-[1rem] text-[9.5px] text-gray-500 hover:text-black ${
                  activeTab === "about" ? "bg-gray-300" : ""
                }`}
              >
                About Subscriptions
              </button>
            </div>
          </div>
        </section> */}
        <section
          id="subscriptions"
          className="w-full flex flex-col md:my-14 my-3"
        >
          <div className="text-black md:text-left text-center md:flex md:justify-between w-full md:mb-8">
            <div className="flex gap-2 items-center text-black md:text-5xl text-lg font-bold pb-4 w-full">
              <MdDiscount />
              {getExpertType(filterTab)} -{" "}
              <span className="font-semibold text-[#24243F80]">
                Subscription Plan
              </span>
            </div>
          </div>
          {/* <div className="expertTabs flex justify-evenly mb-4 p-2 bg-gray-100 rounded-lg shadow-lg border-2">
            {getExpertType(filterTab)}
          </div> */}
          {!shouldHideTabs && !filterTab && (
            <div className="w-full flex justify-evenly flex-row bg-white rounded-2xl p-3 mb-4">
              <div className="activeOptions md:flex-col-6 md:text-[16px] text-[10px] flex flex-row my-auto">
                {availableTypes.includes("3") && (
                  <>
                    <motion.button
                      onClick={() => setFilterTab("3")}
                      className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[15px] px-3 py-1 ${
                        filterTab === "3"
                          ? "text-white bg-black rounded-[5px]"
                          : "text-black"
                      } hover:text-white hover:bg-black rounded-[5px]`}
                      initial={false}
                      animate={filterTab === "3" ? "active" : "inactive"}
                      whileHover={{ scale: 1.05 }}
                    >
                      F&O
                    </motion.button>
                    {availableTypes.includes("2") ||
                    availableTypes.includes("1") ? (
                      <div className="border-[1px]"></div>
                    ) : null}
                  </>
                )}
                {availableTypes.includes("2") && (
                  <>
                    <motion.button
                      onClick={() => setFilterTab("2")}
                      className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[15px] px-3 py-1 ${
                        filterTab === "2"
                          ? "text-white bg-black rounded-[5px]"
                          : "text-black"
                      } hover:text-white hover:bg-black rounded-[5px]`}
                      initial={false}
                      animate={filterTab === "2" ? "active" : "inactive"}
                      whileHover={{ scale: 1.05 }}
                    >
                      Equity
                    </motion.button>
                    {availableTypes.includes("1") ? (
                      <div className="border-[1px]"></div>
                    ) : null}
                  </>
                )}
                {availableTypes.includes("1") && (
                  <>
                    <motion.button
                      onClick={() => setFilterTab("1")}
                      className={`md:flex-col-3 md:mx-2 mx-2 md:text-[1rem] text-[15px] px-3 py-1 ${
                        filterTab === "1"
                          ? "text-white bg-black rounded-[5px]"
                          : "text-black"
                      } hover:text-white hover:bg-black rounded-[5px]`}
                      initial={false}
                      animate={filterTab === "1" ? "active" : "inactive"}
                      whileHover={{ scale: 1.05 }}
                    >
                      Commodity
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={filterTab}
              className="text-black md:grid flex md:grid-cols-2 flex-col justify-center gap-4 w-full subscription-cards"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.5 }}
            >
              {filteredSubscriptions
                .slice()
                .sort((a, b) => a.amount - b.amount)
                .map((subscription, index) => {
                  const isDiscounted =
                    subscription.discountedAmount < subscription.amount;
                  const isRecommended =
                    subscriptions.every(
                      (sub) => sub.discountedAmount >= sub.amount
                    ) && index === 1;
                  const showBorder = isDiscounted || isRecommended;

                  const remainingTime = subscription.discountValidTo
                    ? calculateRemainingTime(subscription.discountValidTo)
                    : null;

                  return (
                    <div
                      key={subscription.id}
                      onClick={() =>
                        handleBuyNowClick(
                          subscription.id,
                          subscription.planType,
                          isDiscounted
                            ? subscription.discountedAmount
                            : subscription.amount,
                          subscription.isCustom,
                          subscription.durationMonth,
                          subscription.chatId
                        )
                      }
                      className={`flex flex-row items-center rounded-3xl px-6 py-4 justify-between max-w-[400px] relative ${
                        selectedSubscription?.subscriptionId === subscription.id
                          ? "border-blue-400 bg-blue-50"
                          : ""
                      } ${
                        isDiscounted
                          ? "border-2 #0081F10D"
                          : "border-2 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* {selectedSubscription?.subscriptionId ===
                        subscription.id ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#54B848] flex items-center justify-center bg-green-500">
                            <div className="w-3 h-3 rounded-full border-[1px] border-white flex items-center justify-center bg-green-500">
                              <FiCheck className="text-white w-3 h-3" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-300 text-white"></div>
                        )} */}
                        <div className="flex flex-col">
                          <div
                            className={`flex text-left ${
                              isDiscounted ? "text-black" : ""
                            } font-medium md:text-3xl md:mb-2`}
                          >
                            {subscription.planType}
                            {isDiscounted && (
                              <span className="text-[#54B848] my-auto border-[#54B84833] border-2 bg-[#54B8481A] rounded-xl px-1 text-xs md:text-lg ml-2">
                                {subscription.discountPercentage}% OFF
                              </span>
                            )}
                          </div>
                          <div className="text-left md:text-lg text-xs mt-auto md:mb-2 mb-1">
                            {isDiscounted ? (
                              <div className="flex gap-2 items-center">
                                <span className="line-through text-gray-950 md:text-xl text-sm">
                                  ₹{subscription.amount}
                                </span>
                                <span className="text-xl text-black font-semibold">
                                  ₹{subscription.discountedAmount.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-semibold">
                                ₹{subscription.amount}
                              </span>
                            )}{" "}
                            /
                            <span
                              className={`text-base ${
                                isDiscounted ? "text-black" : ""
                              } ml-1`}
                            >
                              {subscription.durationMonth}{" "}
                              {subscription.isCustom ? "days" : "month"}
                            </span>
                          </div>
                        </div>
                        {isRecommended && (
                          <div className="md:hidden block absolute md:top-1 top-3 md:right-1 right-[40%] md:text-md text-xs border-2 border-gray-400 text-gray-400 px-2 py-0 rounded-xl">
                            Recommended
                          </div>
                        )}
                        {isRecommended && (
                          <div className="md:block hidden absolute md:top-1 top-3 md:right-1 right-[40%] md:text-md text-xs bg-black text-white px-3 py-1 font-semibold rounded-lg">
                            Recommended
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        {remainingTime && isDiscounted ? (
                          <button className="md:px-12 px-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 font-semibold md:text-base text-sm py-3 rounded-lg border-2 text-white mb-2">
                            Buy Now
                          </button>
                        ) : (
                          <button
                            className={`md:px-12 px-6 w-full  ${
                              selectedSubscription?.subscriptionId ===
                              subscription.id
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                : "bg-blue-50 text-blue-500 border-blue-300"
                            } font-semibold md:text-base text-sm py-3 rounded-lg border-2 mb-2`}
                          >
                            Buy Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              {showMonthlyPopup && (
                <SubscriptionMinorPopup
                  onClose={handleClosePopup}
                  selectedMonthlyPlan={selectedMonthlyPlan}
                  planMonthlyPrice={planMonthlyPrice}
                  expertName={expertData.channelName}
                  mobileNumber={mobileNum}
                  chatId={chatID}
                  subscriptionId={subscriptionId}
                  userId={userData.id}
                  isCustom={isCustom}
                  durationMonth={durationMonth}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
        <section className="w-full md:my-8 my-2 flex gap-20 md:mb-24 mb-16">
          <FAQs2 />
        </section>

        <section
          id="highlights"
          className="w-full md:my-8 my-2 flex gap-20 md:mb-24 mb-16"
        >
          <div className="flex flex-col md:w-2/3 w-full text-black">
            <div className="text-black md:text-5xl text-3xl font-bold pb-4 md:text-left text-center">
              Key highlights to join this subscription
            </div>
            <div className="text-gray-600 md:mb-9 mb-4 md:text-base text-xs md:text-left text-center">
              Experience the power of our subscription. Gain exclusive access to
              expert insights, advanced trading tools, and personalised support.
            </div>
            <div className="flex md:flex-row flex-col md:gap-8 gap-3">
              <div className="flex-1 flex flex-col md:gap-6 gap-3">
                <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200">
                  <div className="w-28 h-14 border-2 rounded-xl border-gray-200 flex items-center justify-center">
                    1.
                  </div>
                  <div>
                    <p className="text-gray-800 md:text-lg text-base">
                      Expert Insights
                    </p>
                    <p className="text-gray-600 md:text-sm text-xs">
                      Gain exclusive access to expert analysis and insights from
                      SEBI Registered Research Analysts.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200">
                  <div className="w-28 h-14 border-2 rounded-xl border-gray-200 flex items-center justify-center">
                    2.
                  </div>
                  <div>
                    <p className="text-gray-800 md:text-lg text-base">
                      Risk Management
                    </p>
                    <p className="text-gray-600 md:text-sm text-xs">
                      Learn essential risk management techniques and gain access
                      to tools to help protect your investments.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col md:gap-6 gap-3">
                <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200">
                  <div className="w-28 h-14 border-2 rounded-xl border-gray-200 flex items-center justify-center">
                    3.
                  </div>
                  <div>
                    <p className="text-gray-800 md:text-lg text-base">
                      Performance Tracking
                    </p>
                    <p className="text-gray-600 md:text-sm text-xs">
                      Monitor your trading performance with detailed analytics
                      and reports to identify strengths and areas for
                      improvement.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200">
                  <div className="w-28 h-14 border-2 rounded-xl border-gray-200 flex items-center justify-center">
                    4.
                  </div>
                  <div>
                    <p className="text-gray-800 md:text-lg text-base">
                      Market Alerts
                    </p>
                    <p className="text-gray-600 md:text-sm text-xs">
                      Stay informed with real-time market alerts and
                      notifications to capitalise on opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-1/3 text-white md:block hidden">
            <div className="rounded-2xl flex flex-col gap-4 bg-[#18181B80] p-8 text-center">
              <div className="text-3xl font-bold subheading-gradient mb-4">
                Subscription Plan
              </div>
              {subscriptions
                .slice()
                .sort((a, b) => a.amount - b.amount)
                .map((subscription, index) => {
                  const isDiscounted =
                    subscription.discountedAmount < subscription.amount;
                  const remainingTime = subscription.discountValidTo
                    ? calculateRemainingTime(subscription.discountValidTo)
                    : null;

                  return (
                    <div
                      key={subscription.id}
                      onClick={() =>
                        handleSelectPlan(
                          subscription.id,
                          subscription.planType,
                          isDiscounted
                            ? subscription.discountedAmount
                            : subscription.amount,
                          subscription.isCustom,
                          subscription.durationMonth,
                          subscription.chatId
                        )
                      }
                      className={`flex rounded-2xl p-4 ${
                        selectedPlan === subscription.planType
                          ? "bg-[#18181B80] border-2 border-[#F4F4F51A]"
                          : "hover:bg-[#18181B80]"
                      }`}
                      onMouseEnter={() => handleMouseEnter(1)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex-1 text-left my-auto">
                        <p className="text-lg subheading-gradient">
                          {subscription.planType}
                        </p>
                        <p className="text-[#C6CDD5] text-sm">
                          {subscription.durationMonth}{" "}
                          {subscription.isCustom ? "Days" : "Month"} Access
                        </p>
                      </div>
                      <div className="flex-1 text-3xl font-bold">
                        {isDiscounted ? (
                          <div className="flex flex-col">
                            <span className="line-through text-gray-500 text-xl">
                              ₹{subscription.amount}
                            </span>
                            <span>₹{subscription.discountedAmount}</span>
                          </div>
                        ) : (
                          <span>₹{subscription.amount}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className="text-center">
                <button
                  className="bg-white text-black md:px-12 px-6 md:text-base text-xs py-2 md:rounded-lg rounded border-2"
                  onClick={() => setShowPopup(true)}
                >
                  Buy Now
                </button>
                {showPopup && (
                  <CoursePaymentPopup
                    onClose={handleClose}
                    selectedPlan={selectedPlan}
                    planPrice={planPrice}
                    expertName={expertData.channelName}
                    mobileNumber={mobileNum}
                    chatId={chatID}
                    subscriptionId={subscriptionId}
                    userId={userData.id}
                    isCustom={isCustom}
                    durationMonth={durationMonth}
                  />
                )}
              </div>
            </div>
          </div> */}
        </section>
        <section
          id="about"
          className="border-2 rounded-2xl border-gray-200 md:p-8 px-4 py-6 md:mb-24 mb-12"
        >
          <p className="text-black md:text-5xl text-3xl font-bold pb-8">
            Subscriptions Details
          </p>
          <div className="text-gray-600">
            <p>
              Welcome to our subscription plans, tailored to cater to traders of
              all levels. Our plans are designed to provide you with the tools,
              resources, and support you need to thrive in this dynamic world of
              trading. Whether you're a new trader, looking to learn the basics
              or an experienced trader seeking advanced analytics, there's a
              plan that's right for you. Each of our subscription plans offers a
              unique set of benefits. With our basic plan, you'll gain access to
              essential features such as market news updates and basic analytics
              tools. Our intermediate plan takes it a step further, offering
              access to expert insights and more advanced trading tools and
              exclusive access to in-depth market analysis and priority customer
              support. No matter which plan you choose, you'll also become part
              of our vibrant community of traders. Here, you can connect with
              fellow traders, share ideas and learn from each other's
              experiences. Our community is a valuable resource for support,
              inspiration, and collaboration.
            </p>
          </div>
        </section>
        <div className={`md:mt-[5rem] mt-[1.9rem] ${styles.boxWidth}`}>
          <Stock />
        </div>
        <ToastContainer />
        <div className="md:hidden block">
          {subscriptions.length !== 0 && (
            <MobileCourse
              filterTab={filterTab}
              handleBuyNowClick={handleBuyNowClick}
              showMobilePopup={showMobilePopup}
              subscriptions={filteredSubscriptions}
              selectedSubscription={selectedSubscription}
            />
          )}
        </div>
        {/* {showKYCPopup && (
          <KYCPopup inviteLink={inviteLink} onClose={handleClose} />
        )}
        {showLinkPopup && (
          <LinkPopup
            chatID={chatID}
            onClose={handleClose}
            inviteLink={inviteLink}
          />
        )} */}
      </div>
      {showSignupPopup && (
        <LoginSignupPopup
          onClose={handleClose}
          planMonthlyPrice={planMonthlyPrice}
          subscriptionIdParams={subscriptionId}
        />
      )}
    </section>
  );
};

export default SubscriptionRA;
