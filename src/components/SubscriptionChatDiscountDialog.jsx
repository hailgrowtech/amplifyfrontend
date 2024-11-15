import React, { useState, useEffect } from "react";
import axios from "axios";
import { closeIcon } from "../assets";
import { toast } from "react-toastify";
import FreeTimeForm from "./FreeTimeForm";
import DiscountForm from "./DiscountForm";
import api from "../api";

const SubscriptionChatDiscountDialog = ({ closeDialog, addCourse }) => {
  const [selectedButton, setSelectedButton] = useState("Discount");
  const [plans, setPlans] = useState([]);
  const stackholderId = sessionStorage.getItem("stackholderId");

  const fetchPlans = async () => {
    try {
      const response = await api.get(
        `/ChatConfiguration/GetChatPlanByExpertsId/${stackholderId}?page=1&pageSize=100000`
      );

      // Log the entire response for debugging
      console.log("API Response:", response);

      if (response.data && response.data.isSuccess) {
        const availablePlans = response.data.data.filter(
          (plan) => plan.discountPercentage > 0
        );

        console.log("Available Plans after filtering:", availablePlans);

        if (availablePlans.length > 0) {
          setPlans(availablePlans);
        } else {
          toast.warn("No plans with a discount were found", {
            position: "top-right",
          });
        }
      } else {
        toast.error("Failed to fetch plans: API did not return success", {
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

  useEffect(() => {
    fetchPlans();
  }, [stackholderId]);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-auto h-[60%] overflow-y-auto p-8 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex md:flex-row flex-col md:items-center items-start md:gap-6 gap-2">
              <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
                Chat Discount Offers
              </h2>
              <div className="flex md:flex-row flex-row md:ml-0 ml-[-12px]">
                <button
                  className={`md:w-[100px] w-[90px] md:h-[40px] h-[30px] rounded-[10px] text-black font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2 ${
                    selectedButton === "Free Time"
                      ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                      : "bg-transparent text-white font-[600] font-inter text-[12px]"
                  }`}
                  onClick={() => handleButtonClick("Free Time")}
                >
                  Free Time
                </button>
                <button
                  className={`md:w-[100px] w-[90px] md:h-[40px] h-[30px] rounded-[10px] text-black font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2 ${
                    selectedButton === "Discount"
                      ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                      : "bg-transparent text-white font-[600] font-inter text-[12px]"
                  }`}
                  onClick={() => handleButtonClick("Discount")}
                >
                  Discount
                </button>
              </div>
            </div>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          {selectedButton === "Free Time" && (
            <FreeTimeForm
              plans={plans}
              stackholderId={stackholderId}
              closeDialog={closeDialog}
              addCourse={addCourse}
            />
          )}
          {selectedButton === "Discount" && (
            <DiscountForm
              plans={plans}
              closeDialog={closeDialog}
              addCourse={addCourse}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionChatDiscountDialog;
