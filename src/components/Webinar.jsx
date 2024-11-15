import React, { useState, useEffect } from "react";
import { deleteIcon, edit, Link } from "../assets";
import WebinarDialog from "./WebinarDialog";
import axios from "axios";
import { toast } from "react-toastify";

const Webinar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [subTable, setSubTable] = useState([]);
  const [activeUser, setActiveUser] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [planTypeCounts, setPlanTypeCounts] = useState({});

  const stackholderId = sessionStorage.getItem("stackholderId");

  const handleSuccess = () => {
    toast.success("Successfully Deleted!", {
      position: "top-right",
    });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const openEditDialog = (subscription) => {
    setCurrentSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTable = () => {};

  return (
    <div className="pb-[5rem] xl:pl-[12rem] md:pl-[10rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex items-center justify-between">
        <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Webinar
        </span>
        <button
          onClick={openDialog}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isDialogOpen && (
          <WebinarDialog
            isDialogOpen={isDialogOpen}
            closeDialog={closeDialog}
          />
        )}
      </div>

      <div className="flex md:flex-row flex-col md: gap-0 gap-6 justify-between py-10">
        <div className="flex flex-col gap-3 w-[342px] h-[185px] bg-[#29303F] rounded-[25px] p-4">
          <div className="flex items-center justify-between">
            <span className="font-[500] text-[18px] leading-[12px] text-[#E4E4E7]">
              Insights at your fingertips
            </span>
            <button className="bg-white rounded-full w-[36px] h-[36px] flex items-center justify-center">
              <img src={Link} alt="Copy_link" className="w-[20px] h-[20px]" />
            </button>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex">
              <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
                User Buy: <span className="text-white">200</span>
              </span>
            </div>
            <div className="flex">
              <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
                Duration: <span className="text-white">3 hrs</span>
              </span>
            </div>
          </div>

          <div>
            <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
              Date & Time:{" "}
              <span className="text-white">1/02/2024 | 10:00AM</span>
            </span>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex">
              <span className="font-[700] text-[31px] leading-[47px] text-white">
                ₹1,999
              </span>
            </div>
            <button className="w-[95px] h-[26px] rounded-[4px] bg-white text-black font-[500] text-[10px] leading-[10.3px]">
              Start Now
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-[342px] h-[185px] bg-[#29303F] rounded-[25px] p-4">
          <div className="flex items-center justify-between">
            <span className="font-[500] text-[18px] leading-[12px] text-[#E4E4E7]">
              Insights at your fingertips
            </span>
            <button className="bg-white rounded-full w-[36px] h-[36px] flex items-center justify-center">
              <img src={Link} alt="Copy_link" className="w-[20px] h-[20px]" />
            </button>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex">
              <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
                User Buy: <span className="text-white">200</span>
              </span>
            </div>
            <div className="flex">
              <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
                Duration: <span className="text-white">3 hrs</span>
              </span>
            </div>
          </div>

          <div>
            <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
              Date & Time:{" "}
              <span className="text-white">1/02/2024 | 10:00AM</span>
            </span>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex">
              <span className="font-[700] text-[31px] leading-[47px] text-white">
                ₹1,999
              </span>
            </div>
            <button className="w-[95px] h-[26px] rounded-[4px] bg-white text-black font-[500] text-[10px] leading-[10.3px]">
              Start Now
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-[342px] h-[185px] bg-[#29303F] rounded-[25px] p-4">
          <div className="flex items-center justify-between">
            <span className="font-[500] text-[18px] leading-[12px] text-[#E4E4E7]">
              Insights at your fingertips
            </span>
            <button className="bg-white rounded-full w-[36px] h-[36px] flex items-center justify-center">
              <img src={Link} alt="Copy_link" className="w-[20px] h-[20px]" />
            </button>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex">
              <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
                User Buy: <span className="text-white">200</span>
              </span>
            </div>
            <div className="flex">
              <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
                Duration: <span className="text-white">3 hrs</span>
              </span>
            </div>
          </div>

          <div>
            <span className="font-[400] text-[13px] leading-[15.4px] text-[#A1A1AA] opacity-[80%]]">
              Date & Time:{" "}
              <span className="text-white">1/02/2024 | 10:00AM</span>
            </span>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex">
              <span className="font-[700] text-[31px] leading-[47px] text-white">
                ₹1,999
              </span>
            </div>
            <button className="w-[95px] h-[26px] rounded-[4px] bg-white text-black font-[500] text-[10px] leading-[10.3px]">
              Start Now
            </button>
          </div>
        </div>
      </div>

      <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
        History
      </span>

      <div className="flex md:mt-[3rem] mt-1">
        {smallScreen ? (
          <div className="flex flex-wrap justify-center items-center ml-[-22px]">
            {subTable.map((row, index) => (
              <div
                key={index}
                className="flex flex-col justify-around w-[361px] h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 w-[90%] max-w-sm"
              >
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DATE:</span> {row.createdOn}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">WEBINAR:</span>{" "}
                  {row.serviceType}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DURATION:</span>{" "}
                  {row.planType}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DATE & TIME:</span>{" "}
                  {row.durationMonth}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">AMOUNT:</span> {row.amount}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">USER:</span>{" "}
                  {}
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
                <th className="text-center">WEBINAR</th>
                <th className="text-center">DURATION</th>
                <th className="text-center">DATE & TIME</th>
                <th className="text-center">AMOUNT</th>
                <th className="text-center">USER</th>
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {subTable.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}
                >
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.date}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.webinar}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.duration}
                  </td>
                  <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                    {row.date_time}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.amount}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Webinar;
