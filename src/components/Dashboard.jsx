import React, { useState, useEffect } from "react";
import { arrow, stars, telegramIcon, userBck } from "../assets";
import BarGraph from "../graphs/BarGraph";
import EarningAnalysis from "./EarningAnalysis";
import ReferralLinkComponent from "./ReferralLinkComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../api";

const Dashboard = ({stackholderId}) => {
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);
  const [activeButtonSecondSection, setActiveButtonSecondSection] =
    useState("today");
  const [totalVisits, setTotalVisits] = useState(0);
  const [paidUsers, setPaidUsers] = useState(0);
  const [notInterested, setNotInterested] = useState(0);
  const [subTable, setSubTable] = useState([]);
  const [myCard, setMyCard] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const SUB_TABLE_URL = `/Subscription/GetByExpertsId/${stackholderId}`;

  const fetchSubscriptionData = () => {
    api
      .get(SUB_TABLE_URL)
      .then((res) => {
        setSubTable(res.data.data);
      })
      .catch((error) => {
        console.log("Something went wrong", error);
      });
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    api
      .get(`/Experts/${stackholderId}`)
      .then((res) => {
        setMyCard(res.data.data);
      })
      .catch((error) => {
        console.log("Something went wrong", error);
      });
  }, []);

  const handleCustomButtonClick = () => {
    setActiveButtonSecondSection("custom");
    setIsCustomPickerVisible(!isCustomPickerVisible);
  };

  const handleDateChange = (start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setIsCustomPickerVisible(false);
  };

  const handleClearDates = () => {
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  const handleDataUpdate = (data) => {
    setTotalVisits(data.totalVisits);
    setPaidUsers(data.paidUsers);
    setNotInterested(data.notInterested);
  };

  const getExpertType = (typeId) => {
    switch (typeId) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Options";
      default:
        return "";
    }
  };

  const sortedSubTable = subTable
    ? [...subTable].sort((a, b) => a.amount - b.amount)
    : [];

  if (!sortedSubTable) {
    return <div>No data found</div>;
  }

  return (
    <div className="xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] xl:py-[6rem] md:pt-[8rem] pt-[6rem]">
      <div className="flex items-center">
        <div className="">
          <div className="flex items-center md:gap-0 gap-10">
            <h2 className="md:w-[176px] md:h-[27px] w-[125px] h-[28px] font-inter md:text-[22px] text-[20px] font-[600] leading-[27px] text-white">
              User Analysis
            </h2>
            <div className="flex items-center md:gap-[2rem] gap-2 xl:ml-[50rem] md:ml-[25rem] ml-[-20px]">
              <button
                className={`button ${
                  activeButtonSecondSection === "today"
                    ? "bg-[#fff] text-[#000]"
                    : "bg-transparent text-[#fff]"
                } md:text-[18px] border-solid border-[1px] border-white transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonSecondSection("today")}
              >
                Today
              </button>
              <button
                className={`button ${
                  activeButtonSecondSection === "weekly"
                    ? "bg-[#fff] text-[#000]"
                    : "bg-transparent text-[#fff]"
                } md:text-[18px] border-solid border-[1px] border-white  transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonSecondSection("weekly")}
              >
                Weekly
              </button>
              <button
                className={`button ${
                  activeButtonSecondSection === "monthly"
                    ? "bg-[#fff] text-[#000]"
                    : "bg-transparent text-[#fff]"
                } md:text-[18px] border-solid border-[1px] border-white  transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                onClick={() => setActiveButtonSecondSection("monthly")}
              >
                Monthly
              </button>
              <div className="relative inline-block">
                <button
                  className={`button ${
                    activeButtonSecondSection === "custom"
                      ? "bg-[#fff] text-[#000]"
                      : "bg-transparent text-[#fff]"
                  } md:text-[18px] border-solid border-[1px] border-white  transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
                  onClick={handleCustomButtonClick}
                >
                  Custom
                </button>
                {isCustomPickerVisible && (
                  <div className="absolute top-full right-0 mt-2 z-10 bg-[#2b2d42] p-4 rounded-lg shadow-lg flex flex-col gap-3">
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date) => setCustomStartDate(date)}
                      selectsStart
                      startDate={customStartDate}
                      endDate={customEndDate}
                      placeholderText="Start Date"
                      className="bg-transparent text-white border-b border-white mb-2"
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <div className="flex justify-between items-center">
                          <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                          >
                            {"<"}
                          </button>
                          <select
                            value={date.getFullYear()}
                            onChange={({ target: { value } }) =>
                              changeYear(parseInt(value))
                            }
                          >
                            {Array.from(
                              { length: 80 },
                              (_, i) => new Date().getFullYear() - 79 + i
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <select
                            value={date.getMonth()}
                            onChange={({ target: { value } }) =>
                              changeMonth(parseInt(value))
                            }
                          >
                            {Array.from({ length: 12 }, (_, i) => i).map(
                              (month) => (
                                <option key={month} value={month}>
                                  {new Date(0, month).toLocaleString(
                                    undefined,
                                    { month: "long" }
                                  )}
                                </option>
                              )
                            )}
                          </select>
                          <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                          >
                            {">"}
                          </button>
                        </div>
                      )}
                    />
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date) =>
                        handleDateChange(customStartDate, date)
                      }
                      selectsEnd
                      startDate={customStartDate}
                      endDate={customEndDate}
                      minDate={customStartDate}
                      placeholderText="End Date"
                      className="bg-transparent text-white border-b border-white"
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <div className="flex justify-between items-center">
                          <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                          >
                            {"<"}
                          </button>
                          <select
                            value={date.getFullYear()}
                            onChange={({ target: { value } }) =>
                              changeYear(parseInt(value))
                            }
                          >
                            {Array.from(
                              { length: 80 },
                              (_, i) => new Date().getFullYear() - 79 + i
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <select
                            value={date.getMonth()}
                            onChange={({ target: { value } }) =>
                              changeMonth(parseInt(value))
                            }
                          >
                            {Array.from({ length: 12 }, (_, i) => i).map(
                              (month) => (
                                <option key={month} value={month}>
                                  {new Date(0, month).toLocaleString(
                                    undefined,
                                    { month: "long" }
                                  )}
                                </option>
                              )
                            )}
                          </select>
                          <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                          >
                            {">"}
                          </button>
                        </div>
                      )}
                    />
                    <button
                      onClick={handleClearDates}
                      className="bg-[#fff] text-[#000] px-4 py-1 rounded-md focus:outline-none"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-12 gap-4 md:px-[4rem] md:py-8 py-0">
            <div className="flex-1 md:ml-[-4rem]">
              <BarGraph
                activeButton={activeButtonSecondSection}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onDataUpdate={handleDataUpdate}
              />
            </div>

            <div className="leaderDiv w-full md:w-1/3 flex md:flex-col justify-center items-center bg_cards rounded-[30px] p-2 md:mt-0 mt-3 md:ml-0 ml-[-6px]">
              <Link
                to="/analysis_board"
                className="w-full flex flex-col items-center md:gap-8 gap-0"
              >
                <div className="w-full flex justify-center">
                  <img
                    src={telegramIcon}
                    alt=""
                    className="md:w-[100px] w-[60px] border-[2px] rounded-full p-4"
                  />
                </div>
                <div className="px-4 w-full flex flex-col md:gap-4 gap-0">
                  <h3 className="text-left md:text-[2rem] text-[1.4rem] xl:text-[4rem] font-bold text-gradient">
                    User Analysis Board
                  </h3>
                  <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
                    <span className="text-white">Total Visit:</span>
                    <span className="font-semibold text-[#247673]">
                      {totalVisits}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
                    <span className="text-white">Paid Users:</span>
                    <span className="font-semibold text-[#25A2DE]">
                      {paidUsers}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between md:text-xl xl:text-2xl">
                    <span className="text-white">Not Interested:</span>
                    <span className="font-semibold text-[#D0667A]">
                      {notInterested}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <ReferralLinkComponent stackholderId={stackholderId}/>
          <EarningAnalysis
            stackholderId={stackholderId}
            startDate={startDate}
            endDate={endDate}
          />

          {/* <div className="py-8 flex flex-col gap-4 md:mt-0 mt-[-2rem]">
            <span className="font-inter font-[600] text-[22px] leading-[27px] w-[246px] h-[27px] text-white">
              Subscription : Services
            </span>
            <div className="xl:w-[1530px] md:w-[1122px] md:h-[400px] xl:h-[480px] w-[361px] h-[310px] md:ml-0 ml-[-8px] bg_cards p-4 rounded-[24px] md:mt-0 mt-[-2px]">
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2">
                      <span className="font-inter font-[700] md:text-[47px] text-[26px] md:leading-[60px] leading-[30px] text-gradient">
                        {myCard && myCard.channelName}
                      </span>
                      <span className="text-white font-inter font-[500] md:text-[17px] text-[12px] md:leading-[22px]">
                        {myCard && myCard.name} -{" "}
                        {myCard && getExpertType(myCard.expertTypeId)}
                      </span>
                    </div>
                    <div className="md:w-[278px] w-[176px] mt-2 md:h-[53px] h-[25px] flex flex-row justify-between">
                      <div className="md:w-[84px] w-[54px] md:h-[53px] h-[25px] flex flex-col">
                        <span className="text-[#E4E4E7] opacity-[40%] font-[400] md:text-[14px] text-[10px] md:leading-[17px] leading-[12px] font-inter md:w-[83px] w-[56px] md:h-[17px]">
                          Experience
                        </span>
                        <span className="text-white md:w-[83px] w-[54px] md:h-[20] h-[12px] font-[600] md:text-[16px] text-[10px] text-center leading-[20px]">
                          {myCard && myCard.experience}+
                        </span>
                      </div>
                      <div className="bg-white w-[1px] md:h-[35px] h-[22px]"></div>
                      <div className="w-[84px] h-[53px] flex flex-col">
                        <span className="text-[#E4E4E7] opacity-[40%] font-[400] md:text-[14px] text-[10px] md:leading-[17px] leading-[12px] font-inter md:w-[83px] w-[56px] md:h-[17px]">
                          Followers
                        </span>
                        <span className="text-white md:w-[83px] w-[54px] md:h-[20] h-[12px] font-[600] md:text-[16px] text-[10px] text-center leading-[20px]">
                          {`${myCard && myCard.telegramFollower / 1000}k`}
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-row flex-col md:ml-0 md:mt-8 mt-8">
                      <div className="absolute flex md:flex-row z-[9] flex-col md:gap-4 justify-center md:items-center md:ml-0 ml-[-6px]">
                        <button className="md:w-[373px] w-[255px] md:h-[31px] h-[23px] flex items-center justify-center rounded-[21.5px] border-solid border-[1px] border-[#4e4e4ecc] mt-2 md:mt-0">
                          <button className="flex justify-center md:p-2 items-center gap-2">
                            <img
                              src={telegramIcon}
                              alt="Telegram"
                              className="md:w-[18.6px] w-[14px] h-[14px] md:h-[18.6px]"
                            />
                            <span className="md:w-[300px] h-[13px] md:h-[23px] text-white font-[400] md:text-[12px] text-[8px] md:leading-[22px] leading-[12px]">
                              {myCard && myCard.telegramChannel}
                            </span>
                            <img
                              src={arrow}
                              alt="arrow"
                              className="md:w-[13px] w-[10px] h-[10px] md:h-[13px]"
                            />
                          </button>
                        </button>
                        <button className="md:w-[373px] w-[255px] md:h-[31px] h-[23px] flex items-center justify-center rounded-[21.5px] border-solid border-[1px] border-[#4e4e4ecc] mt-2 md:mt-0">
                          <button className="flex justify-center items-center gap-2">
                            <img
                              src={telegramIcon}
                              alt="Telegram"
                              className="md:w-[18.6px] w-[14px] h-[14px] md:h-[18.6px]"
                            />
                            <span className="md:w-[300px] h-[13px] md:h-[23px] text-white font-[400] md:text-[12px] text-[8px] md:leading-[22px] leading-[12px]">
                              {myCard && myCard.premiumTelegramChannel}
                            </span>
                            <img
                              src={arrow}
                              alt="arrow"
                              className="md:w-[13px] w-[10px] h-[10px] md:h-[13px]"
                            />
                          </button>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:h-[344px] sm:h-[240px] md:max-h-[250px] max-h-[180px] xl:left-48 md:right-0 right-[4rem] relative profile-image_1 mb-4">
                    <img
                      src={userBck}
                      alt="background"
                      className="absolute top-0 md:left-0 left-6 w-full h-full object-contain rounded-t-[11px]"
                    />
                    <img
                      src={myCard && myCard.expertImagePath}
                      alt="User"
                      className="absolute top-0 md:left-[2rem] left-12 md:w-full h-full object-contain rounded-t-[11px]"
                    />
                  </div>

                  <div className="flex md:ml-auto ml-[-4rem] flex-col items-start md:gap-[16rem] gap-[10rem]">
                    <div className="flex flex-row w-[70px] h-[32px]">
                      <img
                        src={stars}
                        alt={myCard && myCard.rating}
                        className="md:w-[25px] w-[14px] md:h-[25px] h-[14px]"
                      />
                      <span className="md:w-[38px] w-[22px] md:h-[32px] h-[19px] font-[600] md:text-[25px] text-[15px] md:leading-[31px] leading-[18px] text-[#E1E1E3]">
                        {myCard && myCard.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:flex md:flex-row grid grid-cols-2 md:gap-[12rem] gap-2 md:px-[1rem] md:mt-[2rem] mt-14 md:py-0 py-8 items-center justify-center">
                  {sortedSubTable &&
                    sortedSubTable
                      .filter(
                        (subUnit) =>
                          !subUnit.isCustom &&
                          myCard &&
                          subUnit.serviceType == myCard.expertTypeId
                      )
                      .map((subUnit) => (
                        <div
                          key={subUnit.id}
                          className="flex gap-[4rem] md:w-[165px] w-[150px] h-[38px] md:flex-col justify-center items-center"
                        >
                          <div className="md:w-auto md:h-[97px] md:gap-0 gap-0 flex md:flex-col flex-col justify-center items-center">
                            <span className="text-gradient-2 md:w-auto md:h-[32px] font-inter font-[700] md:text-[23px] text-[12px] text-center">
                              {subUnit.planType}
                            </span>
                            <span className="text-white md:w-[120px] font-poppins font-[700] md:text-[36px] text-[11px] text-center">
                              {subUnit.amount}
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
