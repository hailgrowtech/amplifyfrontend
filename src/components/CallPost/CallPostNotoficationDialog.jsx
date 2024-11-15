import React, { useState } from "react";
import { closeIcon } from "../../assets";

const CallPostNotoficationDialog = ({ isDialogOpen, closeDialog }) => {
    const[sendMessage, setSendMessage]= useState("");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[900px] w-[378px] md:h-[240px] h-[210px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Send Notification
            </h2>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          <div className="relative md:ml-0 ml-[-16px]">
              <div className="mb-0">
                <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] md:w-[100px] w-[70px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center">
                  Message
                </label>
                <input
                  value={sendMessage}
                  readOnly
                  type="link"
                  id="default-input"
                  className="md:w-full w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>

          <div className="flex justify-center mt-4">
          <button className="bg-white opacity-[90%] md:w-[107px] w-[90px] h-[36px] md:h-[40px] rounded-[10px]">
            <span className="font-[500] md:text-[16px] text-[15px]">SEND</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallPostNotoficationDialog