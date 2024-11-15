import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserFriends, FaMedal, FaTimes } from "react-icons/fa";
import { useUserData } from "../../constants/context";
import { PiTelegramLogoFill } from "react-icons/pi";
import styles from "../../style";
import "./ChooseExpert.css";
import { telegram } from "../../assets";
import ChooseLogin from "./ChooseLogin"; // Import the login/signup component

// Popup Component
const ChooseExpertPopup = ({
  expert,
  onClose,
  handleTelegram,
  selectedType,
}) => {
  const navigate = useNavigate();

  const handleSubscriptionClick = () => {
    // Redirect to the subscription detail page with expertId and selectedType as query params
    navigate(`/ra-detail/${expert.id}?type=${selectedType}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-[90%] md:w-[50%] shadow-lg border-[2px] border-[#000] border-dashed">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Choose an Option
        </h2>

        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-6">
          <div
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg cursor-pointer transition hover:shadow-lg text-center w-full md:w-1/2 border-[1px] border-transparent hover:border-[#0000004c]"
            onClick={(e) => handleTelegram(e, expert.telegramChannel)} // Trigger handleTelegram on click
          >
            <div className="rounded-full p-4 mb-4 border-2 border-blue-500 flex items-center justify-center w-16 h-16 shadow-md hover:shadow-lg transition-all">
              <PiTelegramLogoFill className="text-blue-500 w-8 h-8" />
            </div>
            <span className="text-lg font-medium">
              Get Started with Free Calls
            </span>
          </div>
          <div
            onClick={handleSubscriptionClick}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg cursor-pointer transition-all hover:shadow-lg text-center w-full md:w-1/2 border-[1px] border-transparent hover:border-[#0000004c]"
          >
            <div className="rounded-full p-4 mb-4 border-2 border-purple-500 flex items-center justify-center w-16 h-16 shadow-md hover:shadow-lg transition-all">
              <FaUserFriends className="text-purple-500 w-8 h-8" />
            </div>
            <span className="text-lg font-medium">
              Know More about{" "}
              <span className="font-extrabold tracking-wide text-gray-900 underline underline-offset-4 decoration-dotted decoration-purple-500 mx-2">
                {expert?.name}'s
              </span>
              Subscriptions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChooseExpert = () => {
  const userData = useUserData(); // Get user data from context
  const token = localStorage.getItem("userId"); // Get the token to check if the user is signed in
  const [selectedType, setSelectedType] = useState(3); // Default to F&O type
  const [selectedExpert, setSelectedExpert] = useState(null); // State to hold the selected expert for popup
  const [showLoginSignupPopup, setShowLoginSignupPopup] = useState(false); // State to show the login/signup popup
  const navigate = useNavigate();
  const { expertId } = useParams(); // Get expert ID from URL

  useEffect(() => {
    // If expertId is in the URL, find the corresponding expert and show the popup
    if (expertId && userData) {
      const expert = userData.find((exp) => exp.id === expertId);
      if (expert) {
        setSelectedExpert(expert); // Set the expert from the URL
      }
    }
  }, [expertId, userData]);

  // Count the number of experts for each expertTypeId
  const hasCommodityExperts = userData?.some(
    (expert) => expert.expertTypeId === 1
  );
  const hasEquityExperts = userData?.some(
    (expert) => expert.expertTypeId === 2
  );
  const hasFandOExperts = userData?.some((expert) => expert.expertTypeId === 3);

  // Function to handle the tab click
  const handleTabClick = (typeId) => {
    setSelectedType(typeId);
  };

  const handleTelegram = (e, link) => {
    e.stopPropagation();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "join",
    });

    if (token) {
      window.open(link, "_blank");
    } else {
      setShowLoginSignupPopup(true); // Show the login/signup popup
    }
  };

  // Filter userData based on selected expertTypeId
  const filteredExperts = userData?.filter(
    (expert) => expert.expertTypeId === selectedType
  );

  // Function to open popup when clicking an expert
  const handleExpertClick = (expert) => {
    if (token) {
      navigate(`/choose-expert/${expert.id}`); // Redirect to the route with the expert ID
    } else {
      sessionStorage.setItem("selectedExpert", JSON.stringify(expert)); // Store expert in sessionStorage
      setShowLoginSignupPopup(true); // Show the login/signup popup if not signed in
    }
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setSelectedExpert(null); // Clear the selected expert and close the popup
    navigate("/choose-your-expert"); // Navigate back to the main expert route
  };

  // Function to handle sign up complete and show the expert popup after login/signup
  const handleSignUpComplete = () => {
    setShowLoginSignupPopup(false); // Close the login/signup popup
    const storedExpert = sessionStorage.getItem("selectedExpert");
    if (storedExpert) {
      const expert = JSON.parse(storedExpert);
      navigate(`/choose-expert/${expert.id}`); // Redirect to the route with the expert ID after login
    }
  };

  return (
    <div className={`flex flex-col ${styles.paddingX} ${styles.paddingY}`}>
      {/* Heading Area */}
      <div className="flex flex-col items-start pb-4">
        <span className="font-inter md:text-5xl text-3xl text-[#24243F] font-[700]">
          Get Daily Calls from SEBI Registered Research Analysts
        </span>
      </div>

      {/* Tabs for filtering */}
      <div className="expertTabs flex justify-evenly mb-4 p-2 bg-gray-100 rounded-lg shadow-lg">
        {hasFandOExperts && (
          <button
            onClick={() => handleTabClick(3)}
            className={`w-full py-2 mx-2 transition duration-300 ease-in-out transform hover:scale-105 text-[12px] ${
              selectedType === 3
                ? "bg-gradient-to-r text-gray-700 bg-gray-200 rounded-[5px] font-bold shadow-lg"
                : "text-black rounded-[5px]"
            }`}
          >
            F&O
          </button>
        )}
        {hasEquityExperts && (
          <button
            onClick={() => handleTabClick(2)}
            className={`w-full py-2 mx-2 transition duration-300 ease-in-out transform hover:scale-105 text-[12px] ${
              selectedType === 2
                ? "bg-gradient-to-r text-gray-700 bg-gray-200 rounded-[5px] font-bold shadow-lg"
                : "text-black rounded-[5px]"
            }`}
          >
            Equity
          </button>
        )}
        {hasCommodityExperts && (
          <button
            onClick={() => handleTabClick(1)}
            className={`w-full py-2 mx-2 transition duration-300 ease-in-out transform hover:scale-105 text-[12px] ${
              selectedType === 1
                ? "bg-gradient-to-r text-gray-700 bg-gray-200 rounded-[5px] font-bold shadow-lg"
                : "text-black rounded-[5px]"
            }`}
          >
            Commodity
          </button>
        )}
      </div>

      {/* Experts List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredExperts?.map((expert) => (
          <div key={expert.id} className="flex flex-col items-center">
            {/* Expert Card */}
            <div
              className="p-2 w-full flex flex-col shadow-lg rounded-xl bg-white cursor-pointer"
              onClick={() => handleExpertClick(expert)} // Open the popup when clicking the expert card
            >
              {/* Expert Image */}
              <div className="w-full flex justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md bg-[#ededed]">
                  <img
                    src={expert.expertImagePath}
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Expert Info */}
              <div className="text-center mt-2">
                <h3 className="text-base md:text-lg font-bold text-gray-800">
                  {expert.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  SEBI Reg: {expert.sebiRegNo}
                </p>
                <p className="text-xs text-gray-500">
                  Channel: {expert.channelName}
                </p>
              </div>

              {/* Experience & Followers */}
              <div className="mt-3 w-full flex justify-between items-center text-gray-600 border-t pt-3">
                <div className="flex items-center">
                  <FaMedal className="text-yellow-500 mr-1" />
                  <span className="text-xs font-semibold">
                    {expert.experience}+ yrs
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>
                <div className="flex items-center">
                  <FaUserFriends className="text-blue-500 mr-1" />
                  <span className="text-xs font-semibold">{`${
                    expert.telegramFollower / 1000
                  }k`}</span>
                </div>
              </div>
            </div>

            {/* Get Free Calls Button Outside of Expert Card */}
            <div className="flex justify-center mt-4 w-full">
              <button
                className="btn btn-3 w-full text-[12px] md:text-[20px] flex items-center justify-center py-1 md:py-2 rounded-md"
                onClick={(e) => handleTelegram(e, expert.telegramChannel)} // Trigger handleTelegram on button click
              >
                Get Free Calls
                <img src={telegram} className="w-4 md:w-8 ml-2" alt="" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Component */}
      {selectedExpert && (
        <ChooseExpertPopup
          expert={selectedExpert}
          onClose={handleClosePopup}
          handleTelegram={handleTelegram}
          selectedType={selectedType} // Pass the selectedType to ChooseExpertPopup
        />
      )}

      {/* LoginSignupPopup for handling sign-in */}
      {showLoginSignupPopup && (
        <ChooseLogin
          onComplete={handleSignUpComplete}
          onClose={() => setShowLoginSignupPopup(false)}
        />
      )}
    </div>
  );
};

export default ChooseExpert;
