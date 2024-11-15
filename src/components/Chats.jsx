import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ChatsHistory from "./ChatsHistory";
import api from "../api";

const Chats = ({stackholderId}) => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [isChat, setIsChat] = useState(false);

  const expertAPI = `/Experts/${stackholderId}`;

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const response = await api.get(expertAPI);
        const expertData = response.data.data;
        setIsChat(expertData.isChatLive);
      } catch (error) {
        toast.error("Failed to fetch expert data", { position: "top-right" });
      }
    };

    fetchExpertData();
  }, [expertAPI]);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleCheckboxChange = async () => {
    const newValue = !isChat; 
    setIsChat(newValue); 

    try {
      await api.patch(`/Experts?Id=${stackholderId}`, [
        {
          path: "isChatLive",
          op: "replace",
          value: newValue,
        },
      ]);
      toast.success("Chat status updated successfully!", {
        position: "top-right",
      });

      if (newValue) {
        sessionStorage.setItem("isChatLive", JSON.stringify(newValue));
      } else {
        sessionStorage.removeItem("isChatLive");
      }
    } catch (error) {
      toast.error("Failed to update chat status!", {
        position: "top-right",
      });
    }
  };

  return (
    <>
    <div className="xl:pl-[18rem] md:pl-[16rem] pl-[1rem] md:pt-[6rem] pt-[8rem] bg-gradient">
      <div className="xl:w-[1520px] md:w-[1130px] w-[370px] flex items-center justify-between">
        <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Chats Status
        </span>
        <label className="inline-flex items-center me-5 cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isChat} // Reflect the isChat state in the checkbox
            onChange={handleCheckboxChange}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
        </label>
      </div>

      {/* <div className="flex pt-[4rem]">
        <Link to="/chats/chats_history">
          <div className="flex xl:w-[1520px] md:w-[1120px] md:gap-6 gap-2">
            <div className="md:h-auto h-auto border border-white border-opacity-50 rounded-lg md:w-full w-[350px] p-4 flex md:flex-row flex-col justify-between md:gap-0 gap-2">
              <span className="font-[700] md:text-[26px] text-[14px] md:leading-[35px] leading-[20px] text-gradient-2 md:w-auto w-[160px] md:h-auto h-[25px]">
                Chat Active Queries:
              </span>
              <button className="px-4 py-2 md:w-[20%] w-full bg-blue-500 text-white md:text-[14px] text-[14px] rounded-lg hover:bg-blue-600">
                Response
              </button>
            </div>
          </div>
        </Link>
      </div> */}
    </div>

    <ChatsHistory stackholderId={stackholderId} />
    </>
  );
};

export default Chats;
