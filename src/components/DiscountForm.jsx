import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { dropdown } from "../assets";
import api from "../api";

const DiscountForm = ({ closeDialog, addCourse }) => {
  const [plans, setPlans] = useState([]);
  const [planName, setPlanName] = useState("");
  const [discountPer, setDiscountPer] = useState("");
  const [planAmt, setPlanAmt] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const stackholderId = sessionStorage.getItem("stackholderId");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get(
          `/ChatConfiguration/GetChatPlanByExpertsId/${stackholderId}?page=1&pageSize=100000`
        );

        if (response.data && response.data.isSuccess) {
          const availablePlans = response.data.data;
          setPlans(availablePlans);
        } else {
          toast.error("Failed to fetch plans", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Error fetching plans. Please try again later.", {
          position: "top-right",
        });
      }
    };

    fetchPlans();
  }, [stackholderId]);

  useEffect(() => {
    if (planAmt && discountPer) {
      const calculatedDiscountedAmount =
        planAmt - planAmt * (discountPer / 100);
      setDiscountedAmount(calculatedDiscountedAmount.toFixed(2));
    }
  }, [planAmt, discountPer]);

  const handleSelectChange = (plan) => {
    setSelectedPlan(plan);
    setPlanName(plan.planName);
    setPlanAmt(plan.price);
    setIsDropdownOpen(false);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (value > 70) {
      toast.error("Can't give more than 70% discount", {
        position: "top-right",
      });
      setDiscountPer("");
    } else {
      setDiscountPer(value);
    }
  };

  const handleSubmit = async () => {
    if (!planName || !discountPer || !planAmt || !discountedAmount || !startDate || !endDate) {
      toast.error("Please fill all fields", {
        position: "top-right",
      });
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
        `/ChatConfiguration?Id=${subID}`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.isSuccess) {
        toast.error("Failed to update discount offer", {
          position: "top-right",
        });
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
        };

        addCourse(newCourse);
        closeDialog();
      }
    } catch (error) {
      toast.error("Error updating discount offer", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 md:w-[1006px]">
      <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
        <div className="relative">
          <label
            htmlFor="planType"
            className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[110px] w-[100px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            Plan Name
          </label>
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="md:w-[1010px] w-[345px] md:px-4 px-2 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] cursor-pointer"
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
                  {plans.map((plan) => (
                    <li
                      key={plan.id}
                      onClick={() => handleSelectChange(plan)}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {plan.planName}
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
            md:w-[100px] w-[140px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
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
              md:w-[130px] w-[90px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
          >
            Discount Amount
          </label>
          <input
            type="text"
            value={discountedAmount}
            onChange={(e) => setDiscountedAmount(e.target.value)}
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

export default DiscountForm;
