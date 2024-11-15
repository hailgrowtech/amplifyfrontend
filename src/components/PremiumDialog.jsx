import React, { useState } from "react";
import axios from "axios";
import { closeIcon, dropdown } from "../assets";
import { toast } from "react-toastify";
import api from "../api";

const PremiumDialog = ({
  isFreeCallsDialogOpen,
  closeDialog,
  stackholderId,
  chatId,
  fetchCallData,
  sendTelegramMessage,
}) => {
  const [name, setName] = useState("");
  const [above, setAbove] = useState("");
  const [targets, setTargets] = useState(["", "", "", ""]);
  const [SL, setSL] = useState("");
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [methodType, setMethodType] = useState(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [showInFreeCalls, setShowInFreeCalls] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputClassName =
    subscriptionType || methodType === null ? "text-[#9BA3AF]" : "text-white";

  const getSubscriptionTypeLabel = (type) => {
    switch (type) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Options";
      default:
        return "Select Subscription Type";
    }
  };

  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
  };

  const handleSubClick = (option) => {
    setSubscriptionType(option);
    setIsSubscriptionOpen(false);
  };

  const getMethodTypeLabel = (type) => {
    switch (type) {
      case 1:
        return "BUY";
      case 2:
        return "SELL";
      case 3:
        return "HOLD";
      default:
        return "Select Method Type";
    }
  };

  const toggleMethodDropdown = () => {
    setIsMethodOpen(!isMethodOpen);
  };

  const handleMethodClick = (option) => {
    setMethodType(option);
    setIsMethodOpen(false);
  };

  const handleTargetChange = (index, value) => {
    const newTargets = [...targets];
    const aboveValue = parseFloat(above);
    const targetValue = parseFloat(value);

    newTargets[index] = value;
    setTargets(newTargets);

    if (targetValue <= aboveValue) {
      setErrorMessage(
        `Target ${index + 1} must be greater than the Above value.`
      );
    } else if (index > 0 && targetValue <= parseFloat(newTargets[index - 1])) {
      setErrorMessage(
        `Target ${index + 1} must be greater than Target ${index}.`
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleShowInFreeCalls = (e) => {
    setShowInFreeCalls(e.target.checked);
  };

  // Function to send data to the API
  const handleSendClick = async () => {
    if (!targets[0]) {
      toast.error("Target 1 value is required.");
      setErrorMessage("Target 1 is required.");
      return;
    }

    if (errorMessage) {
      toast.error("Check the target values.");
      return;
    }

    if (!name || !subscriptionType || !methodType || !chatId) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const postData = {
      expertsId: stackholderId,
      callMode: "P", // Free (F) or Premium (P)
      callType: getSubscriptionTypeLabel(subscriptionType),
      action: getMethodTypeLabel(methodType),
      name: name,
      above: parseFloat(above),
      target1: parseFloat(targets[0]),
      target2: parseFloat(targets[1]),
      target3: parseFloat(targets[2]),
      target4: parseFloat(targets[3]),
      stopLoss: parseFloat(SL),
      showInFreeCalls: showInFreeCalls,
    };

    setIsSubmitting(true);

    const messageData = {
      name: name || "TESTING MESSAGE", // Default value if name is empty
      method: getMethodTypeLabel(methodType),
      above: above, // Default value if above is empty
      target1: targets[0],
      target2: targets[1],
      target3: targets[2],
      target4: targets[3],
      stopLoss: SL,
      chatId: chatId, // Ensure chatId is available
    };

    try {
      const response = await api.post("/CallPost", postData, {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      });
      if (response.data.isSuccess) {
        toast.success(response.data.displayMessage);

        // Second API Call: Send Message to Group
        if (sendTelegramMessage) {
          const messageResponse = await axios.post(
            "https://phonepe.copartner.in/api/sendCallMessageToGroup",
            messageData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (messageResponse.status === 200) {
            toast.success("Message sent to group successfully!");
          } else {
            toast.error("Failed to send message to group.");
          }
        }
        fetchCallData(getSubscriptionTypeLabel(subscriptionType));
        closeDialog(); // Close the dialog on success
      } else {
        alert("Failed to post call");
      }
    } catch (error) {
      console.error("Error posting call:", error);
      alert("An error occurred while posting the call");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-[60%] overflow-y-auto p-8 relative">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Add Free Call
            </h2>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          <div className="flex flex-col gap-4 md:w-[1006px]">
            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px] mt-4">
              {/* Subscription Type (Call Type) Dropdown */}
              <div className="relative">
                <label
                  htmlFor="subscriptionType"
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[100px] w-[74px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Call Type
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      id="subscriptionType"
                      value={getSubscriptionTypeLabel(subscriptionType)}
                      onClick={toggleSubscriptionDropdown}
                      className={`md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] ${inputClassName}`}
                      readOnly
                    />
                    <img
                      src={dropdown}
                      alt="DropDown"
                      className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                    />
                  </div>
                  {isSubscriptionOpen && (
                    <div className="absolute z-10 mt-2 md:w-[382px] w-[345px] rounded-md bg-white shadow-lg">
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

              {/* Method Type Dropdown */}
              <div className="relative">
                <div className="mb-0">
                  <label
                    className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[70px] w-[60px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                  >
                    Method
                  </label>
                  <div className="relative">
                    <input
                      id="methodType"
                      value={getMethodTypeLabel(methodType)}
                      onClick={toggleMethodDropdown}
                      className={`md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] ${inputClassName}`}
                      readOnly
                    />
                    <img
                      src={dropdown}
                      alt="DropDown"
                      className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                    />
                    {isMethodOpen && (
                      <div className="absolute z-10 mt-2 md:w-[382px] w-[345px] rounded-md bg-white shadow-lg">
                        <ul className="py-1">
                          <li
                            onClick={() => handleMethodClick(1)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            BUY
                          </li>
                          <li
                            onClick={() => handleMethodClick(2)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            SELL
                          </li>
                          <li
                            onClick={() => handleMethodClick(3)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            HOLD
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Name and Above Inputs */}
            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px] mt-4">
              {/* Name Input */}
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[70px] w-[58px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name-input"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>

              {/* Above Input */}
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[70px] w-[60px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Above
                </label>
                <input
                  type="number"
                  value={above}
                  onChange={(e) => setAbove(e.target.value)}
                  id="above-input"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>

            {/* Target and SL */}
            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px] mt-4">
              {/* Target Inputs 1, 2, 3, 4 */}
              <div className="relative w-full">
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {["Target 1", "Target 2", "Target 3", "Target 4"].map(
                    (targetLabel, index) => (
                      <div key={index} className="relative">
                        <label
                          className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
            w-full md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                        >
                          {targetLabel}
                        </label>
                        <input
                          type="number"
                          value={targets[index] || ""}
                          onChange={(e) =>
                            handleTargetChange(index, e.target.value)
                          }
                          className="w-full px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* SL Input */}
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
      md:w-[70px] w-[58px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  SL
                </label>
                <input
                  type="number"
                  value={SL}
                  onChange={(e) => setSL(e.target.value)}
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            <div className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                name="showInFreeCalls"
                id="showInFreeCalls"
                onChange={handleShowInFreeCalls}
              />
              <label htmlFor="showInFreeCalls">Show in Free Calls</label>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-center mt-8">
            <button
              disabled={isSubmitting}
              onClick={handleSendClick}
              className={`bg-white opacity-[90%] md:w-[107px] w-[90px] h-[36px] md:h-[40px] rounded-[10px] ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <span className="font-[500] md:text-[16px] text-[15px]">
                {isSubmitting ? "Sending..." : "SEND"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDialog;
