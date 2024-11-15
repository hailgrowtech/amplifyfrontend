import React, { useEffect, useState } from "react";
import styles from "../../style";
import "./SubscriptionRA.css";
import { useParams } from "react-router-dom";
import { arrow, bookmark, bookmarkFill, stars } from "../../assets";
import CoursePaymentPopup from "./CoursePaymentPopup";
import SubscriptionPaymentPopup from "./SubscriptionPaymentPopup";
import { ToastContainer, toast } from "react-toastify";
import FAQs2 from "../About/FAQs2";
import KYCPopup from "./KYCPopup";
import LinkPopup from "../InviteLink/LinkPopup";
import { useUserSession } from "../../constants/userContext";

const SubscriptionRA = () => {
  const { id } = useParams();
  const [expertData, setExpertData] = useState(null);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState(null);
  const [planMonthlyPrice, setPlanMonthlyPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planPrice, setPlanPrice] = useState(2999);
  const [isCardSaved, setIsCardSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [subscriptions, setSubscriptions] = useState([]);
  const [mobileNum, setMobileNum] = useState("");
  const [showKYCPopup, setShowKYCPopup] = useState(false);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [chatID, setChatID] = useState("");
  const { userData, loading } = useUserSession();
  const [inviteLink, setInviteLink] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
  };

  const handleSaveCard = () => {
    setIsCardSaved(!isCardSaved);

    if (!isCardSaved) {
      toast.success("Your card has been saved", {
        position: "top-right",
      });
    } else {
      toast.info("Your card has been unsaved", {
        position: "top-right",
      });
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
      setSubscriptions(data.data);
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://copartners.in:5009/api/Subscription/${id}`
        );
        if (!response.ok) {
          throw new Error("Error in fetching API");
        }
        const data = await response.json();
        setExpertData(data.data);
        fetchSubscriptions(data.data.expertsId);
        setChatID(data.data.chatId);
      } catch (error) {
        console.error("Error fetching expert data:", error);
        toast.error("Failed to fetch expert data", {
          position: "top-right",
        });
      }
    };

    fetchData();
  }, [id]);

  const handleSelectPlan = (plan, price) => {
    setSelectedPlan(plan);
    setPlanPrice(price);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowMonthlyPopup(false);
  };

  const handleBuyNowClick = (plan, price) => {
    setSelectedMonthlyPlan(plan);
    setPlanMonthlyPrice(price);
    setShowMonthlyPopup(true);
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

  useEffect(() => {
    if (!loading && userData) {
      setMobileNum(userData.mobileNumber);
      const paymentSuccess = checkPaymentStatus();
      handlePaymentSuccess(paymentSuccess);
    }
  }, [loading, userData?.isKYC, inviteLink]);

  const handlePaymentSuccess = (paymentSuccess) => {
    if (paymentSuccess) {
      const detailsComplete = checkKYCDetails(userData);
      if (detailsComplete) {
        console.log("KYC complete.");
        if (inviteLink) {
          setShowLinkPopup(true);
          clearURLParams();
        }
      } else {
        console.log("KYC not complete, showing KYC popup.");
        setShowKYCPopup(true);
      }
    }
  };

  const checkKYCDetails = (data) => {
    const isComplete = data?.isKYC;
    console.log("KYC Details Complete:", isComplete);
    return isComplete;
  };

  const checkPaymentStatus = () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const transactionId = params.get("transactionId");
    const inviteLink = params.get("inviteLink");

    setInviteLink(inviteLink);

    if (status === "success") {
      toast.success(`Payment Success: ${transactionId}`);
      return true;
    } else if (status === "failure") {
      toast.error(`Payment Failed: ${transactionId}`);
      return false;
    }

    return null;
  };

  const clearURLParams = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const matchingSubscription = subscriptions.find((sub) => sub.id === id);

  if (!matchingSubscription) {
    return <div className="text-white">No matching subscription found.</div>;
  }

  if (!expertData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <section
      className={`flex md:flex-col flex-col md:px-0 px-3 ${styles.paddingY} expertise-Bg`}
    >
      <div
        key={expertData.id}
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 md:px-28 z-10 md:bottom-[10rem] font-inter`}
      >
        <section className="subscription-RA-bg flex flex-row justify-between bg-[#18181B80] relative w-full md:p-[30px] p-[16px] border-2 border-[#f4f4f50e] rounded-xl mb-8">
          <div className="text-white">
            <div className="flex flex-col md:mb-6 mb-1">
              <div className="flex justify-between items-center w-full">
                <span
                  className="flex-1 font-bold md:text-[72px] text-[26px]
      text-gradient md:leading-[88px] leading-[30px] md:pb-3"
                >
                  {matchingSubscription.experts?.channelName}
                </span>
              </div>
              <span className="font-normal md:leading-[28px] md:text-[22px] text-[12px]">
                {matchingSubscription.experts?.name} -{" "}
                {getExpertType(matchingSubscription.experts?.expertTypeId)}
              </span>
            </div>
            <div className="flex justify-between md:w-[350px] w-[176px] md:h-16 h-10 md:mb-6 mb-3">
              <div className="flex flex-col items-center justify-around">
                <div className="text-[15px] text-[#C6CDD5]">Experience</div>
                <div className="md:text-xl text-xs font-semibold">
                  {matchingSubscription.experts?.experience}+
                </div>
              </div>
              <div className="w-[1px] md:h-16 h-10 bg-white"></div>
              <div className="flex flex-col items-center justify-around">
                <div className="text-[15px] text-[#C6CDD5]">Followers</div>
                <div className="md:text-xl text-xs font-semibold">
                  {`${matchingSubscription.experts?.telegramFollower / 1000}k`}
                </div>
              </div>
            </div>
            <div className="md:text-lg text-sm md:font-semibold md:w-[508px] md:mb-4 mb-2">
              <span className="text-dimWhite">SEBI:</span>{" "}
              {matchingSubscription.experts?.sebiRegNo}
            </div>
            <div className="text-white flex items-center md:w-[400px] md:justify-between md:gap-2 gap-4 md:mb-5 mb-3">
              <div className="subheading-gradient md:text-3xl text-base font-bold">
                {matchingSubscription.planType}
              </div>
              <div className="flex">
                <span className="md:text-5xl text-2xl font-bold">
                  ₹{matchingSubscription.amount}/
                </span>
                <span className="text-lg mt-auto opacity-60 md:inline hidden">
                  {matchingSubscription.durationMonth} Months Access
                </span>
              </div>
            </div>
            <div className="bg-[#0081F1] md:rounded-3xl rounded-2xl md:w-44 w-32 md:mb-6">
              <button className="flex mx-auto md:py-2 py-1 items-center">
                <span className="md:text-base text-xs">Get Free Calls</span>
                <img className="w-4 ms-3" src={arrow} alt="arrow icon" />
              </button>
            </div>
          </div>
          <div className="flex mx-auto">
            <img
              className="subscription-RA-img md:w-[400px] w-[470px] my-auto"
              src={matchingSubscription.experts?.expertImagePath}
              style={{
                maskImage: "linear-gradient(rgba(0, 0, 0, 1) 70%, transparent)",
              }}
              alt=""
            />
          </div>
          <div className="flex text-white items-end absolute top-6 right-6">
            <img
              className="md:w-8 w-4 md:h-8 h-4 me-1"
              src={stars}
              alt="star icon"
            />
            <span className="md:text-3xl text-sm">
              {matchingSubscription.experts?.rating}
            </span>
          </div>
          {/* <div
            onClick={handleSaveCard}
            className={`absolute md:bottom-6 bottom-12 md:right-8 right-3 rounded-full cursor-pointer transition duration-300 hover:scale-110 hover:bg-[#ffffff5e] hover:rounded-full p-2`}
          >
            {!isCardSaved ? (
              <img src={bookmark} alt="Save icon" className="w-6 h-6" />
            ) : (
              <img
                src={bookmarkFill}
                alt="Save fill icon"
                className="w-6 h-6"
              />
            )}
          </div> */}
          <div className="md:hidden block absolute bottom-3 right-4 text-white">
            <button className="flex items-center md:text-base text-xs">
              Explore More <img className="w-4 ms-3" src={arrow} alt="arrow" />
            </button>
          </div>
        </section>
        <section className="w-full md:block hidden">
          <div className="w-full flex flex-row bg-[#18181B80] rounded-2xl">
            <div className="md:flex-col-6 md:text-[16px] text-[12px] flex flex-row md:mx-px mx-auto">
              <button
                onClick={() => handleTabClick("subscriptions")}
                className={`hover:text-white text-dimWhite md:flex-col-3 rounded-full p-2 md:px-6 md:py-5 mx-2 md:text-[1rem] text-[9.5px] ${activeTab === "subscriptions" ? "bg-[#ffffff5e]" : ""
                  }`}
              >
                Subscriptions Plans
              </button>
              <button
                onClick={() => handleTabClick("highlights")}
                className={`md:flex-col-3 md:px-6 md:py-5 mx-2 rounded-full p-2 md:text-[1rem] text-[9.5px] text-dimWhite hover:text-white ${activeTab === "highlights" ? "bg-[#ffffff5e]" : ""
                  }`}
              >
                Key Highlights
              </button>
              <button
                onClick={() => handleTabClick("about")}
                className={`md:flex-col-3 md:px-6 md:py-5 mx-2 rounded-full p-2 md:text-[1rem] text-[9.5px] text-dimWhite hover:text-white ${activeTab === "about" ? "bg-[#ffffff5e]" : ""
                  }`}
              >
                About Subscriptions
              </button>
            </div>
          </div>
        </section>
        <section
          id="subscriptions"
          className="w-full flex flex-col md:my-14 my-10"
        >
          <div className="text-white md:text-left text-center md:flex md:justify-between w-full md:mb-8">
            <div className="text-white md:text-5xl text-3xl font-bold pb-4 md:w-1/2">
              Subscriptions Plans
            </div>
            <div className="text-[#A1A1AACC] md:text-lg text-xs md:mb-0 mb-4 md:w-1/2">
              <span className="text-white">
                Choose the plan that suits your needs and start trading with
                confidence today.
              </span>
            </div>
          </div>
          <div className="text-white flex flex-wrap justify-center md:gap-8 gap-2 w-full subscription-cards">
            {subscriptions
              .slice()
              .sort((a, b) => a.amount - b.amount)
              .map((subscription, index) => (
                <div
                  key={subscription.id}
                  onClick={() =>
                    handleBuyNowClick(
                      subscription.planType,
                      subscription.amount
                    )
                  }
                  className={`flex-1 rounded-2xl p-5 basic-div max-w-[400px] ${0 ? "hover:bg-[#18181B80]" : ""
                    } relative`}
                >
                  <div className="text-center opacity-60 hidden">
                    21 Days Left
                  </div>
                  <div className="text-center md:text-3xl text-lg font-bold subheading-gradient md:mb-4 mb-1">
                    {subscription.planType}
                  </div>
                  <div className="text-center md:text-5xl text-2xl font-bold md:mb-3 mb-1 flex justify-center">
                    ₹{subscription.amount}
                  </div>
                  <div className="text-center md:text-lg text-xs mt-auto opacity-60 mb-6">
                    {subscription.durationMonth} {subscription.isCustom ? "Days" : "Month"} Access
                  </div>
                  <div className="text-center">
                    <button className="bg-white text-black md:px-12 px-6 md:text-base text-xs py-2 md:rounded-lg rounded border-2">
                      {subscription.planType === matchingSubscription.planType
                        ? "Renew"
                        : "Buy"}
                    </button>
                  </div>
                  {index === 1 && (
                    <div className="absolute top-1 md:left-[6.5rem] left-[6.8rem] md:text-md text-xs transform -translate-x-2/3 -translate-y-2/3 bg-[#ffffff] text-[#000] px-3 py-1 font-semibold rounded-lg">
                      Recommended
                    </div>
                  )}
                </div>
              ))}
            {showMonthlyPopup && (
              <SubscriptionPaymentPopup
                onClose={handleClosePopup}
                selectedMonthlyPlan={selectedMonthlyPlan}
                planMonthlyPrice={planMonthlyPrice}
                expertName={matchingSubscription.experts?.channelName}
              />
            )}
          </div>

          <section className="w-full md:my-8 my-2 flex gap-20 md:mb-24 mb-16">
            <FAQs2 />
          </section>
          <section
            id="highlights"
            className="w-full md:my-8 my-2 flex gap-20 md:mb-24 mb-16"
          >
            <div className="flex flex-col md:w-2/3 w-full text-white">
              <div className="text-white md:text-5xl text-3xl font-bold pb-4 md:text-left text-center">
                Key highlights to join this subscription
              </div>
              <div className="text-[#A1A1AACC] md:mb-9 mb-4 md:text-base text-xs md:text-left text-center">
                Experience the power of our subscription. Gain exclusive access
                to expert insights, advanced trading tools and personalised
                support.
              </div>
              <div className="flex md:flex-row flex-col md:gap-8 gap-3">
                <div className="flex-1 flex flex-col md:gap-6 gap-3">
                  <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-[#18181B80] border-2 border-transparent hover:border-[#F4F4F51A]">
                    <div className="w-28 h-14 border-2 rounded-xl border-[#F4F4F51A] flex items-center justify-center">
                      1.
                    </div>
                    <div>
                      <p className="text-[#E4E4E7] md:text-lg text-base">
                        Expert Insights
                      </p>
                      <p className="text-[#A1A1AACC] md:text-sm text-xs">
                        Gain exclusive access to expert analysis and insights
                        from SEBI Registered Research Analysts.{" "}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-[#18181B80] border-2 border-transparent hover:border-[#F4F4F51A]">
                    <div className="w-28 h-14 border-2 rounded-xl border-[#F4F4F51A] flex items-center justify-center">
                      2.
                    </div>
                    <div>
                      <p className="text-[#E4E4E7] md:text-lg text-base">
                        Risk Management
                      </p>
                      <p className="text-[#A1A1AACC] md:text-sm text-xs">
                        Learn essential risk management techniques and gain
                        access to tools to help protect your investments.{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col md:gap-6 gap-3">
                  <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-[#18181B80] border-2 border-transparent hover:border-[#F4F4F51A]">
                    <div className="w-28 h-14 border-2 rounded-xl border-[#F4F4F51A] flex items-center justify-center">
                      3.
                    </div>
                    <div>
                      <p className="text-[#E4E4E7] md:text-lg text-base">
                        Performance Tracking
                      </p>
                      <p className="text-[#A1A1AACC] md:text-sm text-xs">
                        Monitor your trading performance with detailed analytics
                        and reports to identify strengths and areas for
                        improvement.{" "}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl flex md:py-6 py-4 px-5 items-center gap-5 hover:bg-[#18181B80] border-2 border-transparent hover:border-[#F4F4F51A]">
                    <div className="w-28 h-14 border-2 rounded-xl border-[#F4F4F51A] flex items-center justify-center">
                      4.
                    </div>
                    <div>
                      <p className="text-[#E4E4E7] md:text-lg text-base">
                        Market Alerts
                      </p>
                      <p className="text-[#A1A1AACC] md:text-sm text-xs">
                        Stay informed with real-time market alerts and
                        notifications to capitalise on opportunities. {" "}
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
                  .map((subscription) => (
                    <div
                      key={subscription.id}
                      onClick={() =>
                        handleSelectPlan(
                          subscription.planType,
                          subscription.amount
                        )
                      }
                      className={`flex rounded-2xl p-4 ${selectedPlan === subscription.planType
                        ? "bg-[#18181B80] border-2 border-[#F4F4F51A]"
                        : "hover:bg-[#18181B80]"
                        }`}
                    >
                      <div className="flex-1 text-left">
                        <p className="text-lg subheading-gradient">
                          {subscription.planType}
                        </p>
                        <p className="text-[#C6CDD5] text-sm">
                          {subscription.durationMonth} {subscription.isCustom ? "Days" : "Month"} Access
                        </p>
                      </div>
                      <p className="flex-1 text-3xl font-bold">
                        ₹{subscription.amount}
                      </p>
                    </div>
                  ))}
                <div className="text-center">
                  <button
                    className="bg-white text-black md:px-12 px-6 md:text-base text-xs py-2 md:rounded-lg rounded border-2"
                    onClick={() => setShowPopup(true)}
                  >
                    {selectedPlan === matchingSubscription.planType
                      ? "Renew"
                      : "Buy"}
                  </button>
                  {showPopup && (
                    <CoursePaymentPopup
                      onClose={handleClose}
                      selectedPlan={selectedPlan}
                      planPrice={planPrice}
                      expertName={expertData.channelName}
                      mobileNumber={mobileNum}
                      chatId={chatID}
                    />
                  )}
                </div>
              </div>
            </div> */}
          </section>
          <section
            id="about"
            className="border-2 rounded-2xl border-[#f4f4f50e] md:p-8 px-4 py-6 md:mb-12 mb-12"
          >
            <p className="subheading-gradient md:text-5xl text-3xl font-bold pb-8">
              Subscriptions Details
            </p>
            <div className="text-[#A1A1AACC]">
              <p>
                Welcome to our subscription plans, tailored to cater to traders
                of all levels. Our plans are designed to provide you with the
                tools, resources and support you need to thrive in this dynamic
                world of trading. Whether you're a new trader, looking to learn
                the basics or an experienced trader seeking advanced analytics,
                there's a plan that's right for you. Each of our subscription
                plans offers a unique set of benefits. With our basic plan,
                you'll gain access to essential features such as market news
                updates and basic analytics tools. Our intermediate plan takes
                it a step further, offering access to expert insights and more
                advanced trading tools and exclusive access to in-depth market
                analysis and priority customer support. No matter which plan you
                choose, you'll also become part of our vibrant community of
                traders. Here, you can connect with fellow traders, share ideas
                and learn from each other's experiences. Our community is a
                valuable resource for support, inspiration and collaboration.
              </p>
            </div>
          </section>
        </section>
        <ToastContainer />
        {showKYCPopup && <KYCPopup onClose={handleClose} />}
        {showLinkPopup && (
          <LinkPopup
            chatID={chatID}
            onClose={handleClose}
            inviteLink={inviteLink}
          />
        )}
      </div>
    </section>
  );
};

export default SubscriptionRA;
