import React, { useState } from "react";
import axios from "axios";
import { dropdown, closeIcon } from "../assets";
import api from "../api";

const SubscriptionEditService = ({ closeDialog, subscription, subTable, axiosServiceData }) => {
  const getSubscriptionTypeLabel = (type) => {
    switch (type) {
      case "3":
        return "Futures & Options";
      case "1":
        return "Commodity";
      case "2":
        return "Equity";
      default:
        return "Select Subscription Type";
    }
  };

  const [subscriptionType, setSubscriptionType] = useState(getSubscriptionTypeLabel(subTable?.serviceType));
  const [planType, setPlanType] = useState(subTable?.planType);
  const [durationType, setDurationType] = useState(subTable?.durationMonth);
  const [amount, setAmount] = useState(subTable?.amount);
  const [premiumTelegram, setPremiumTelegram] = useState(subTable?.premiumTelegramLink);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [customPlanName, setCustomPlanName] = useState(subTable?.planType === "Custom" ? subTable?.planType : "");
  const [isCustom, setIsCustom] = useState(subTable?.planType === "Custom");
  const [isDuration, setIsDuration] = useState(false);

  const inputClassName = subscriptionType === null ? "text-[#9BA3AF]" : "text-white";

  const handleSubClick = (option) => {
    setSubscriptionType(option);
    setIsSubscriptionOpen(false);
  };

  const handlePlanClick = (plan) => {
    setPlanType(plan);
    if (plan !== "Custom") {
      setDurationType(plan === "Monthly" ? 1 : plan === "Quarterly" ? 3 : plan === "Half-Yearly" ? 6 : plan === "Yearly" ? 12 : "");
    }
    setIsPlanOpen(false);
    setIsCustom(plan === "Custom");
    if (plan !== "Custom") {
      setCustomPlanName("");
    }
  };

  const handleDurationInputChange = (e) => {
    setDurationType(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
    setIsPlanOpen(false);
    setIsDuration(false);
  };

  const togglePlanDropdown = () => {
    setIsPlanOpen(!isPlanOpen);
    setIsSubscriptionOpen(false);
    setIsDuration(false);
  };

  const handleCustom = (e) => {
    setCustomPlanName(e.target.value);
  };

  const handleSaveChanges = async () => {
    const patchData = [
      {
        path: "amount",
        op: "replace",
        value: amount
      },
      {
        path: "planType",
        op: "replace",
        value: planType === "Custom" ? customPlanName : planType
      },
      {
        path: "durationMonth",
        op: "replace",
        value: durationType
      }
    ];

    try {
      const response = await api.patch(`/Subscription?Id=${subTable.id}`, patchData, {
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      });

      if (response.status === 200) {
        axiosServiceData();
        closeDialog();
      } else {
        console.error("Failed to update subscription, status:", response.status);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center">
      <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-full h-[600px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Edit Service
            </h2>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>
          <div className="flex flex-col md:mt-4 gap-2">
            <div className="flex justify-between">
              <label className="inline-flex items-center me-5 cursor-pointer md:ml-0 ml-[-0.8rem]">
                <span className="mr-3 text-sm font-medium text-white">
                  Active:
                </span>
                <input type="checkbox" value="" className="sr-only peer" checked />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          <div className="flex flex-col md:mt-0 mt-[1rem] gap-4 md:w-[1006px] md:h-[520px]">
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
                      value={subscriptionType}
                      disabled
                      onClick={toggleSubscriptionDropdown}
                      className="md:w-[482px] w-[345px] px-4 py-2 cursor-pointer rounded-md text-white border border-[#40495C] bg-[#282F3E]"
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
                          onClick={() => handleSubClick("Option")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Option
                        </li>
                        <li
                          onClick={() => handleSubClick("Commodity")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Commodity
                        </li>
                        <li
                          onClick={() => handleSubClick("Equity")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Equity
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
                    {planType === "Custom" ? (
                      <input
                        id="customPlanName"
                        value={customPlanName}
                        onChange={handleCustom}
                        className="md:w-[482px] w-[345px] px-4 py-2 cursor-pointer rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                      />
                    ) : (
                      <input
                        id="planType"
                        value={planType}
                        readOnly
                        onClick={togglePlanDropdown}
                        className={`md:w-[482px] w-[345px] md:px-4 px-2 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] ${inputClassName}`}
                      />
                    )}
                    <img
                      src={dropdown}
                      alt="DropDown"
                      className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                    />
                  </div>
                  {isPlanOpen && (
                    <div className="absolute z-10 mt-2 md:w-[482px] w-[345px] rounded-md bg-white shadow-lg">
                      <ul className="py-1">
                        <li
                          onClick={() => handlePlanClick("Monthly")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Monthly
                        </li>
                        <li
                          onClick={() => handlePlanClick("Quarterly")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Quarterly
                        </li>
                        <li
                          onClick={() => handlePlanClick("Half-Yearly")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Half-Yearly
                        </li>
                        <li
                          onClick={() => handlePlanClick("Yearly")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Yearly
                        </li>
                        <li
                          onClick={() => handlePlanClick("Custom")}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Custom
                        </li>
                      </ul>
                    </div>
                  )}
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
                    {planType === "Custom" ? (
                      <input
                        id="durationType"
                        value={durationType}
                        onChange={handleDurationInputChange}
                        className="md:w-[482px] w-[345px] px-4 py-2 cursor-pointer rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                      />
                    ) : (
                      <input
                        id="durationType"
                        value={durationType}
                        onChange={handleDurationInputChange}
                        className="md:w-[482px] w-[345px] px-4 py-2 cursor-pointer rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                      />
                    )}
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
                    onChange={handleAmountChange}
                    id="default-input"
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
            </div>

            <div className="relative md:ml-0 ml-[-16px]">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[232px] w-[210px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Premium Telegram Channel Link
                </label>
                <input
                  type="link"
                  id="default-input"
                  value={premiumTelegram}
                  onChange={(e) => setPremiumTelegram(e.target.value)}
                  className="md:w-[1012px] w-[345px] py-2 md:px-6 px-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>

            <div className="relative md:ml-0 ml-[-16px]">
              <label
                className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  w-[90px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[13px] text-center"
              >
                Description
              </label>
              <textarea
                id="des-input"
                rows="4"
                className="block p-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] md:w-full w-[105%]"
                placeholder="Write something here"
              ></textarea>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-2 justify-end md:mt-0 mt-4">
            <button
              onClick={handleSaveChanges}
              className="px-4 w-[100%] py-2 bg-blue-500 text-white md:text-[14px] text-[14px] rounded-lg hover:bg-blue-600"
            >
              Save Changes
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
    </div>
  );
};

export default SubscriptionEditService;
