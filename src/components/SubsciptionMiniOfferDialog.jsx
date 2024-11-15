import React, { useState, useEffect } from "react";
import { closeIcon, dropdown } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api";

const SubsciptionMiniOfferDialog = ({
  closeDialog,
  axiosServiceData,
  subTable,
}) => {
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [planType, setPlanType] = useState("Select Plan Type");
  const [customPlanName, setCustomPlanName] = useState("");
  const [durationType, setDurationType] = useState("");
  const [des, setDes] = useState("");

  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isDuration, setIsDuration] = useState(false);
  const [isKeyPointsOpen, setIsKeyPointsOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const [premiumTelegram, setPremiumTelegram] = useState("");
  const [changes, setChanges] = useState({});
  const [chatID, setChatID] = useState("");
  const [miniSub, setMiniSub] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  const [isCustom, setIsCustom] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClassName =
    subscriptionType === null ? "text-[#9BA3AF]" : "text-white";

  const stackholderId = sessionStorage.getItem("stackholderId");

  const handleSuccess = () => {
    toast.success("Subscription saved!", {
      position: "top-right",
    });
  };

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
    });
  };

  useEffect(() => {
    axios
      .get(`https://copartners.in:5132/api/Experts/${stackholderId}`)
      .then((res) => {
        setChanges(res.data.data);
        setSubscriptionType(res.data.data.expertTypeId);
        updatePremiumTelegramLink(res.data.data.expertTypeId, res.data.data);
      })
      .catch((err) => {
        console.error(err);
        handleError("Failed to fetch data: " + err.message);
      });
  }, [stackholderId]);

  const updatePremiumTelegramLink = (type, data) => {
    let link = "";
    let chatId = "";
    switch (type) {
      case 1:
        link = data.premiumTelegramChannel1;
        chatId = data.chatId1;
        break;
      case 2:
        link = data.premiumTelegramChannel2;
        chatId = data.chatId2;
        break;
      case 3:
        link = data.premiumTelegramChannel3;
        chatId = data.chatId3;
        break;
      default:
        link = "";
        chatId = "";
    }
    setPremiumTelegram(link);
    setChatID(chatId);
  };

  const handleConfirm = async (e) => {
    setError("");
    setLoading(true);

    const postData = {
      expertsId: stackholderId,
      imagePath: "www.google.com/userjkdjfa",
      serviceType: subscriptionType,
      planType: isCustom ? customPlanName : planType,
      durationMonth: durationType,
      amount: parseInt(amount, 10),
      premiumTelegramLink: premiumTelegram,
      description: des || "",
      discountPercentage: 0, // Add your discount percentage here
      discountValidFrom: new Date().toISOString(),
      discountValidTo: new Date().toISOString(),
      isSpecialSubscription: true, // Set to true
      isCustom: isCustom,
      isActive: true,
      chatId: chatID,
    };

    console.log("Post Data:", postData);

    if (
      !amount ||
      !subscriptionType ||
      !planType ||
      !durationType ||
      !premiumTelegram ||
      !chatID
    ) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/Subscription",
        postData
      );
      console.log("Response:", response);
      if (response.status !== 200) {
        handleError("Something went wrong! " + response.status);
      } else {
        handleSuccess();
        closeDialog();
        axiosServiceData();
      }
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      handleError("Failed to submit data. Please try again. " + error.message);
      setError("Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubClick = (option) => {
    setSubscriptionType(option);
    updatePremiumTelegramLink(option, changes);
    setIsSubscriptionOpen(false);
  };

  const handlePlanClick = (plan) => {
    setPlanType(plan);
    setIsCustom(plan === "Custom");
    if (plan !== "Custom") {
      setDurationType(
        plan === "Monthly"
          ? 1
          : plan === "Quarterly"
          ? 3
          : plan === "Half-Yearly"
          ? 6
          : plan === "Yearly"
          ? 12
          : ""
      );
    }
    setIsPlanOpen(false);
  };

  const handleDurationInputChange = (e) => {
    setDurationType(e.target.value);
  };

  const getSubscriptionTypeLabel = (type) => {
    switch (type) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Futures & Options";
      default:
        return "Select Subscription Type";
    }
  };

  const handleCustom = (e) => {
    setCustomPlanName(e.target.value);
    setIsCustom(true);
  };

  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
    setIsPlanOpen(false);
    setIsDuration(false);
    setIsKeyPointsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center py-[2rem] justify-center">
      <div className="fixed inset-0 z-[999] flex items-center py-[2rem] justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-auto h-[600px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Mini Subscription
            </h2>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          <div className="flex flex-col md:mt-0 mt-[1rem] gap-4 md:w-[1006px] md:h-auto">
            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:mt-6 md:ml-0 ml-[-16px]">
              <div className="relative">
                <label
                  htmlFor="subscriptionType"
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[140px] w-[134px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Subscription Type
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      id="subscriptionType"
                      value={getSubscriptionTypeLabel(subscriptionType)}
                      onClick={toggleSubscriptionDropdown}
                      className={`md:w-[482px] w-[345px] md:px-4 px-2 py-2 cursor-pointer rounded-md border border-[#40495C] bg-[#282F3E] ${inputClassName}`}
                    />
                    <img
                      src={dropdown}
                      alt="DropDown"
                      className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                    />
                  </div>
                  {isSubscriptionOpen && (
                    <div className="absolute z-10 mt-2 md:w-[482px] w-[345px] rounded-md bg-white shadow-lg">
                      <ul className="py-1">
                        <li
                          onClick={() => handleSubClick(1)}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Commodity
                        </li>
                        <li
                          onClick={() => handleSubClick(2)}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Equity
                        </li>
                        <li
                          onClick={() => handleSubClick(3)}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Futures & Options
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="planType"
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[90px] w-[88px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Plan Name
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      id="customPlanName"
                      value={customPlanName}
                      onChange={handleCustom}
                      className="md:w-[482px] w-[345px] px-4 py-2 cursor-pointer rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                    />
                    <img
                      src={dropdown}
                      alt="DropDown"
                      className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
              <div className="relative">
                <label
                  htmlFor="durationType"
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[80px] w-[78px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Duration
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      id="durationType"
                      value={durationType}
                      onChange={handleDurationInputChange}
                      className="md:w-[482px] w-[345px] px-4 py-2 cursor-pointer rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                    />

                    <img
                      src={dropdown}
                      alt="DropDown"
                      className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="mb-0">
                  <label
                    className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[70px] w-[68px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    id="default-input"
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
            </div>

            <div className="relative md:ml-0 ml-[-16px]">
              <div className="mb-0">
                <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] md:w-[232px] w-[210px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center">
                  Premium Telegram Channel Link
                </label>
                <input
                  value={premiumTelegram}
                  readOnly
                  type="link"
                  id="default-input"
                  className="md:w-[1012px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-2 justify-end mt-4">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 w-[100%] py-2 bg-blue-500 text-white md:text-[14px] text-[14px] rounded-lg hover:bg-blue-600"
            >
              Confirm
            </button>
            <button
              onClick={closeDialog}
              className="px-4 w-[100%] py-2 mr-2 bg-gray-300 md:text-[14px] text-[14px] text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SubsciptionMiniOfferDialog;
