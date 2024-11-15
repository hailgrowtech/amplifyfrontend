import React, { useState, useEffect } from "react";
import axios from "axios";
import { deleteIcon } from "../assets";
import SubscriptionChatDialog from './SubscriptionChatDialog';
import SubscriptionChatDiscount from "./SubscriptionChatDiscount";
import api from "../api";

const SubscriptionChat = () => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [error, setError] = useState(null);

  const stackholderId = sessionStorage.getItem("stackholderId");

  const CHAT_SERVICE_API = `/ChatConfiguration/GetChatPlanByExpertsId/${stackholderId}?page=1&pageSize=100000`;

  const axiosServiceData = async () => {
    try {
      const res = await api.get(CHAT_SERVICE_API);
      console.log("API response:", res.data); // Log the response
      setChat(res.data.data || []); // Ensure data is an array
      setError(null);
    } catch (error) {
      console.log("Something went wrong", error);
      setError("Failed to fetch data from the chat service. Please try again later.");
    }
  };

  useEffect(() => {
    if (stackholderId) {
      axiosServiceData();
    } else {
      setError("Stackholder ID not found. Please log in again.");
    }
  }, [stackholderId, CHAT_SERVICE_API]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = async (id) => {
    const DELETE_API = `/ChatConfiguration/${id}`;
    try {
      await api.delete(DELETE_API);
      setChat(prevChat => prevChat.filter(course => course.id !== id));
    } catch (error) {
      console.error("Error deleting the chat:", error);
      setError("Failed to delete the chat. Please try again later.");
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getPlanTypeDisplay = (planType) => {
    return planType === "F" ? "Free" : planType === "P" ? "Paid" : "";
  };

  return (
    <div className="bg-gradient md:pt-[5rem] py-[4rem]">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex items-center justify-between">
        <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Chat Service
        </span>
        <button
          onClick={openDialog}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isDialogOpen && (
          <SubscriptionChatDialog
            closeDialog={closeDialog}
            axiosServiceData={axiosServiceData}
          />
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">{error}</div>
      )}

      <div className="flex md:mt-[2rem] mt-1">
        {smallScreen ? (
          <div className="flex flex-wrap justify-center items-center ml-[-22px]">
            {chat
              .filter((row) => row.planType !== "F")
              .map((row, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-around h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 w-[90%] max-w-sm"
                >
                  <div className="flex flex-row justify-between">
                    <p className="w-[173px] h-[26px] font-[600] text-[14px] leading-[25px] text-lightWhite">
                      {row.planName}
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => handleDelete(row.id)}>
                        <img
                          src={deleteIcon}
                          alt=""
                          className="w-[24px] h-[24px] text-white"
                        />
                      </button>
                    </div>
                  </div>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DATE:</span> {formatDate(row.date)}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DURATION:</span> {row.duration}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">AMOUNT:</span> {row.price}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">PLAN TYPE:</span> {getPlanTypeDisplay(row.planType)}
                  </span>
                </div>
              ))}
            <button className="mt-6 md:w-[147px] md:h-[40px] md:flex items-center justify-center flex w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px]">
              Show More
            </button>
          </div>
        ) : (
          <table className="xl:w-[1520px] md:w-[1130px] h-[230px] bg-[#29303F] rounded-[30px]">
            <thead className="text-[#BABABA] font-inter font-[600] text-[14px] leading-[20px] h-[51px]">
              <tr>
                <th className="text-center">DATE</th>
                <th className="text-center">PLAN NAME</th>
                <th className="text-center">PLAN TYPE</th>
                <th className="text-center">DURATION</th>
                <th className="text-center">AMOUNT</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {chat
                .filter((row) => row.planType !== "F")
                .map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {formatDate(row.createdOn)}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.planName}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {getPlanTypeDisplay(row.planType)}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.duration}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.price}
                    </td>
                    <td className="flex flex-row items-center justify-center gap-2 py-[2rem]">
                      <button onClick={() => handleDelete(row.id)}>
                        <img
                          src={deleteIcon}
                          alt=""
                          className="w-[21px] h-[21px] mx-auto flex items-center justify-center"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <SubscriptionChatDiscount />
    </div>
  );
};

export default SubscriptionChat;
