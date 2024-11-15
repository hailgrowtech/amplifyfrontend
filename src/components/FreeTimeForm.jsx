import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { dropdown } from "../assets";
import axios from "axios";
import api from "../api";

const FreeTimeForm = ({ plans, closeDialog, addCourse }) => {
  const [planName, setPlanName] = useState("");
  const [planAmt, setPlanAmt] = useState("0");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [duration, setDuration] = useState("");
  // const [subscriptionType, setSubscriptionType] = useState(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [filteredPlans, setFilteredPlans] = useState(plans);
  const [offerDuration, setOfferDuration] = useState("");

  const stackholderId = sessionStorage.getItem("stackholderId");

  useEffect(() => {
    if (startDate && endDate) {
      calculateOfferDuration(startDate, endDate);
    }
  }, [startDate, endDate]);

  // useEffect(() => {
  //   if (subscriptionType !== null) {
  //     const filteredPlans = plans.filter(
  //       (plan) =>
  //         mapSubscriptionTypeToInt(plan.subscriptionType) === subscriptionType
  //     );
  //     setFilteredPlans(filteredPlans);
  //   } else {
  //     setFilteredPlans(plans);
  //   }
  // }, [subscriptionType, plans]);

  const calculateOfferDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const offerDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    setOfferDuration(`${offerDuration} days`);
  };

  const handleSubmit = async () => {
    console.log("Plan Name:", planName);
    console.log("Plan Amount:", planAmt);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    // console.log("Subscription Type:", subscriptionType);
    console.log("Duration:", duration);

    if (!planName || !planAmt || !startDate || !endDate || !duration) {
      toast.error("Please fill all fields", {
        position: "top-right",
      });
      return;
    }

    const newCourse = {
      date: new Date().toLocaleDateString(),
      planType: "F", // always send "F"
      amount: planAmt,
      discountValidFrom: new Date(startDate).toISOString(),
      discountValidTo: new Date(endDate).toISOString(),
      createdOn: new Date().toISOString(),
      // serviceType: subscriptionType,
    };

    try {
      const response = await api.post(
        "/ChatConfiguration",
        {
          expertsId: stackholderId,
          // subscriptionType,
          planType: "F",
          planName,
          duration,
          price: planAmt,
          discountPercentage: 0,
          discountValidFrom: new Date(startDate).toISOString(),
          discountValidTo: new Date(endDate).toISOString(),
        }
      );
      toast.success("Course added successfully!", {
        position: "top-right",
      });
      addCourse(newCourse);
      closeDialog();
    } catch (error) {
      toast.error("Failed to add course. Please try again.", {
        position: "top-right",
      });
      console.error("Error adding course:", error);
    }
  };

  const mapSubscriptionTypeToInt = (type) => {
    switch (type) {
      case "Commodity":
        return 1;
      case "Equity":
        return 2;
      case "Futures & Options":
        return 3;
      default:
        return null;
    }
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

  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
  };

  // const handleSubClick = (option) => {
  //   setSubscriptionType(option);
  //   setIsSubscriptionOpen(false);
  // };

  return (
    <div className="flex flex-col gap-4 md:w-[1006px]">
      <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
        {/* <div className="relative">
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
                className={`md:w-[482px] w-[345px] md:px-4 px-2 py-2 cursor-pointer rounded-md border border-[#40495C] bg-[#282F3E] ${
                  subscriptionType === null ? "text-[#9BA3AF]" : "text-white"
                }`}
                readOnly
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
        </div> */}
        <div className="relative">
          <label
            htmlFor="planType"
            className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[110px] w-[100px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            Plan Name
          </label>
          <div className="relative">
            <input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="md:w-[1010px] w-[345px] md:px-4 px-2 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
              placeholder="Enter Plan Name"
            />
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
        <div className="relative">
          <label
            className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
            md:w-[90px] w-[80px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
          />
        </div>
        <div className="relative">
          <label
            className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
            md:w-[90px] w-[80px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
          />
        </div>
      </div>

      <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
        <div className="relative">
          <label
            className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
              md:w-[120px] w-[90px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            Duration In Min
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            id="default-input"
            className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
          />
        </div>

        <div className="relative">
          <label
            className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
              md:w-[120px] w-[90px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            Offer Duration
          </label>
          <input
            type="text"
            value={offerDuration}
            onChange={(e) => setOfferDuration(e.target.value)}
            id="default-input"
            className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
            readOnly
          />
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-2 justify-end py-4">
        <button
          onClick={handleSubmit}
          className="px-4 w-full py-2 bg-blue-500 text-white md:text-[14px] text-[14px] rounded-lg hover:bg-blue-600"
        >
          Confirm
        </button>
        <button
          onClick={closeDialog}
          className="px-4 w-full py-2 bg-gray-300 md:text-[14px] text-[14px] text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FreeTimeForm;
