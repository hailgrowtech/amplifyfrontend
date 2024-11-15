import React, { useState, useEffect } from "react";
import axios from "axios";
import { closeIcon, dropdown } from "../assets";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";

const SubscriptionEditDiscount = ({ closeDialog, addCourse }) => {
  const [planName, setPlanName] = useState("");
  const [discountPer, setDiscountPer] = useState("");
  const [planAmt, setPlanAmt] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState("");
  const [isDiscountedAmountOpen, setIsDiscountedAmountOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [offersDuration, setOffersDuration] = useState("");
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [subscriptionType, setSubscriptionType] = useState(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  const inputClassName = subscriptionType === null ? "text-[#9BA3AF]" : "text-white";

  const stackholderId = sessionStorage.getItem("stackholderId");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `https://copartners.in:5009/api/Subscription/GetByExpertsId/${stackholderId}`
        );
        if (response.data.isSuccess) {
          const availablePlans = response.data.data.filter(plan => !plan.discountPercentage);
          setPlans(availablePlans);
        } else {
          handleError("Failed to fetch plans");
        }
      } catch (error) {
        handleError("Error fetching plans");
      }
    };

    fetchPlans();
  }, [stackholderId]);

  useEffect(() => {
    if (planAmt && discountPer) {
      const calculatedDiscountedAmount = planAmt - planAmt * (discountPer / 100);
      setDiscountedAmount(calculatedDiscountedAmount.toFixed(2));
    }
  }, [planAmt, discountPer]);

  useEffect(() => {
    if (startDate && endDate) {
      calculateOffersDuration(startDate, endDate);
    }
  }, [startDate, endDate]);

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
    });
  };

  const handleSubmit = async () => {
    if (
      !planName ||
      !discountPer ||
      !planAmt ||
      !discountedAmount ||
      !startDate ||
      !endDate ||
      !subscriptionType
    ) {
      handleError("Please fill all fields");
      return;
    }

    const subID = selectedPlan.id;

    const patchData = [
      {
        path: "discountValidTo",
        op: "replace",
        value: new Date(endDate).toISOString(), // Convert to UTC
      },
      {
        path: "discountValidFrom",
        op: "replace",
        value: new Date(startDate).toISOString(), // Convert to UTC
      },
      {
        path: "discountPercentage",
        op: "replace",
        value: discountPer,
      },
    ];

    try {
      const response = await api.patch(
        `/Subscription?Id=${subID}`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.isSuccess) {
        handleError("Failed to update discount offer");
      } else {
        toast.success("Discount offer updated successfully", {
          position: "top-right",
        });
        const newCourse = {
          date: new Date().toLocaleDateString(),
          planType: planName,
          discountPercentage: discountPer,
          amount: planAmt,
          discountedAmount: discountedAmount,
          discountValidFrom: new Date(startDate).toISOString(),
          discountValidTo: new Date(endDate).toISOString(),
          createdOn: new Date().toISOString(),
          serviceType: subscriptionType, // Include subscription type
        };

        addCourse(newCourse);
        closeDialog();
      }
    } catch (error) {
      handleError("Error updating discount offer");
    }
  };

  const handleSelectChange = (plan) => {
    setSelectedPlan(plan);
    setPlanName(plan.planType);
    setPlanAmt(plan.amount);
    setIsDropdownOpen(false);
  };

  const calculateOffersDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    setOffersDuration(`${duration} days`);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (value > 70) {
      setErrorMessage("Can't give more than 70% discount");
      setDiscountPer("");
    } else {
      setErrorMessage("");
      setDiscountPer(value);
    }
  };

  const handleSubClick = (option) => {
    setSubscriptionType(option);
    setIsSubscriptionOpen(false);
    const filtered = plans.filter(
      (plan) => plan.serviceType === option.toString()
    );
    setFilteredPlans(filtered);
    setPlanName(""); // Reset plan name when subscription type changes
    setPlanAmt(""); // Reset plan amount when subscription type changes
  };

  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
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

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-[60%] h-[80%] overflow-y-auto p-8 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Discount Offers
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
            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
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
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="md:w-[482px] w-[345px] md:px-4 px-2 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] cursor-pointer"
                  >
                    {planName || "Select Plan"}
                  </div>
                  <img
                    src={dropdown}
                    alt="DropDown"
                    className="absolute inset-y-0 md:right-3 right-[-6px] w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                  />
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 md:w-[482px] w-[345px] rounded-md bg-white shadow-lg">
                      <ul className="py-1">
                        {filteredPlans.map((plan) => (
                          <li
                            key={plan.id}
                            onClick={() => handleSelectChange(plan)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {plan.planType}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[100px] w-[90px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Plan Amount
                </label>
                <input
                  type="number"
                  value={planAmt}
                  onChange={(e) => setPlanAmt(e.target.value)}
                  id="default-input"
                  disabled
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[160px] w-[140px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={discountPer}
                  onChange={handleDiscountChange}
                  id="default-input"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
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
                <div className="mb-0 md:ml-0 ml-[-16px]">
                  <label
                    className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  w-[110px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                  >
                    Offers Duration
                  </label>
                  <input
                    type="text"
                    value={offersDuration}
                    onChange={(e) => setOffersDuration(e.target.value)}
                    id="default-input"
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[150px] w-[140px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Discounted Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={discountedAmount}
                    readOnly
                    onClick={() =>
                      setIsDiscountedAmountOpen(!isDiscountedAmountOpen)
                    }
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] cursor-pointer"
                  />
                </div>
              </div>
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
      </div>
    </div>
  );
};

export default SubscriptionEditDiscount;
