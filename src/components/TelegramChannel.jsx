import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api";

const TelegramChannel = ({stackholderId}) => {
  const [channelData, setChannelData] = useState([]);
  const TELEGRAM_CHAT_API = `https://copartners.in:5134/api/TelegramMessage/${stackholderId}?userType=RA&page=1&pageSize=100000`;

  useEffect(() => {
    axios
      .get(TELEGRAM_CHAT_API)
      .then((response) => {
        setChannelData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching the data", error);
      });
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedChannelData = [...channelData];
    updatedChannelData[index][field] = value;
    setChannelData(updatedChannelData);
  };

  const handleSave = (channel) => {
    const { id, joinMessage, leaveMessage, marketingMessage, channelName } =
      channel;
    const payload = [
      { path: "joinMessage", op: "replace", value: joinMessage },
      { path: "leaveMessage", op: "replace", value: leaveMessage },
      { path: "marketingMessage", op: "replace", value: marketingMessage },
      { path: "channelName", op: "replace", value: channelName },
    ];

    api
      .patch(`/TelegramMessage?Id=${id}`, payload)
      .then((response) => {
        toast.success("Successfully Send!", {
          position: "top-right",
        });
        console.log("Save successful", response.data);
      })
      .catch((error) => {
        console.error("Error saving the data", error);
      });
  };

  return (
    <div className="pb-[5rem] xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="flex md:flex-row flex-col justify-between">
        <span className="md:w-[206px] w-[168px] md:h-[27px] h-[28px] font-inter md:text-[22px] text-[20px] font-[600] leading-[27px] text-[#ffffff]">
          Telegram Channel
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:mt-[4rem] mt-[3rem] items-center justify-center md:ml-0 ml-[-0.6rem]">
        {channelData.map((channel, index) => (
          <div
            key={channel.id}
            className="border-2 border-[#202F49] rounded-[30px] md:w-[527px] w-[360px] md:h-[585px] flex flex-col gap-4 p-6"
          >
            <span className="text-white font-inter font-[600] text-[22px] leading-[26px]">
              {channel.channelName}
            </span>
            <hr className="bg-[#202F49] w-full" />

            <div className="flex flex-col gap-4">
              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
            w-[100px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[13px] text-center"
                >
                  Join Message
                </label>
                <textarea
                  typeof="text"
                  onChange={(e) =>
                    handleInputChange(index, "joinMessage", e.target.value)
                  }
                  value={channel.joinMessage}
                  rows="4"
                  className="block p-2 rounded-md text-white opacity-[50%] border border-[#40495C] bg-transparent md:w-[470px] h-[90px] w-[105%]"
                ></textarea>
              </div>

              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
            w-[120px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[13px] text-center"
                >
                  Leave Message
                </label>
                <textarea
                  typeof="text"
                  onChange={(e) =>
                    handleInputChange(index, "leaveMessage", e.target.value)
                  }
                  value={channel.leaveMessage}
                  rows="4"
                  className="block p-2 rounded-md text-white opacity-[50%] border border-[#40495C] bg-transparent md:w-full w-[105%]"
                ></textarea>
              </div>

              <div className="relative">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
            w-[150px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[13px] text-center"
                >
                  Marketing Message
                </label>
                <textarea
                  typeof="text"
                  onChange={(e) =>
                    handleInputChange(index, "marketingMessage", e.target.value)
                  }
                  value={channel.marketingMessage}
                  rows="4"
                  className="block p-2 rounded-md text-white opacity-[50%] border border-[#40495C] bg-transparent md:w-full w-[105%]"
                ></textarea>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex items-center justify-center bg-white border border-white rounded-[8px] w-[180px] h-[40px]">
                  <button
                    className="text-[14px]"
                    onClick={() => handleSave(channel)}
                  >
                    Save
                  </button>
                </div>

                <div className="flex items-center justify-center bg-blue-500 border border-none text-white rounded-[8px] w-[280px] h-[40px]">
                  <button className="text-[14px]">
                    Send Marketing Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramChannel;
