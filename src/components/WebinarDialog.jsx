import React, { useState } from "react";
import { closeIcon, deleteIcon, dropdown } from "../assets";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

const WebinarDialog = ({ closeDialog, addCourse }) => {
  const [courseName, setCourseName] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [des, setDes] = useState("");
  const [startDate, setStartDate] = useState(null);

  const [imagePath, setImagePath] = useState("");

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
    });
  };

  const handleSubmit = () => {
    if (!courseName || !amount || !duration || !startDate) {
      handleError("Please fill all fields");
      return;
    }

    const newCourse = {
      date: new Date().toLocaleDateString(),
      courseName,
      amount,
      duration,
      startDate,
      activeUser: 0, // Assuming this is the default value
    };

    addCourse(newCourse);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] h-[60%] overflow-y-auto p-8 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Add Webinar
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
                <div className="mb-0">
                  <label
                    className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[110px] w-[100px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                  >
                    Webinar Name
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    id="default-input"
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
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

            <div className="flex md:flex-row flex-col md:gap-12 gap-4 md:ml-0 ml-[-16px]">
              <div className="relative">
                <div className="mb-0">
                  <label
                    className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[70px] w-[68px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                  >
                    Duration
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    id="default-input"
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
              <div className="relative">
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[90px] w-[80px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
                >
                  Date & Time
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
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
                typeof="text"
                onChange={(e) => setDes(e.target.value)}
                id="des-input"
                value={des}
                rows="4"
                className="block p-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] md:w-full w-[105%]"
                placeholder="Write something here"
              ></textarea>
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

export default WebinarDialog;