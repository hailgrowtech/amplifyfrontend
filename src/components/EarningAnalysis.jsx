import React, { useState, useEffect } from "react";
import PieCharts from "../graphs/PieCharts";
import Charts from "../graphs/Charts";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";

const EarningAnalysis = ({ stackholderId }) => {
  const [earningAnalysis, setEarningAnalysis] = useState(null);
  const [userEarning, setUserEarning] = useState({
    copartnerEarning: 0,
    personalEarning: 0,
  });
  const [isCoPartner, setIsCoPartner] = useState(false);
  const [filter, setFilter] = useState("monthly");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);

  const EARNING_URL = `/Wallet/GetWalletWithdrawalBalance/${stackholderId}?userType=RA`;
  const USER_EARNING = `/RADashboard/GetDashboardRAListingData/${stackholderId}?page=1&pageSize=100000`;
  const EXPERT_DATA_URL = `/Experts/${stackholderId}`;

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const response = await api.get(EXPERT_DATA_URL);
        setIsCoPartner(response.data.data.isCoPartner);
      } catch (error) {
        console.error("Error fetching the expert data:", error);
      }
    };

    fetchExpertData();
  }, [stackholderId]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await api.get(EARNING_URL);
        setEarningAnalysis(response.data.data);
      } catch (error) {
        console.error("Error fetching the wallet balance:", error);
        setEarningAnalysis("Error");
      }
    };

    fetchWalletBalance();
  }, [stackholderId]);

  useEffect(() => {
    const fetchEarningBalance = async () => {
      try {
        const response = await api.get(USER_EARNING);
        const data = response.data.data;

        // Filter data based on the selected date range
        const filteredData = data.filter((item) => {
          const subscribeDate = new Date(item.subscribeDate);
          return (
            (!customStartDate || subscribeDate >= customStartDate) &&
            (!customEndDate || subscribeDate <= customEndDate)
          );
        });

        // Calculate Copartner and Personal Earnings
        let copartnerEarning = 0;
        let personalEarning = 0;

        filteredData.forEach((item) => {
          if (item.amount !== null && item.subscription !== "No Subscription") {
            if (item.subscriptionAmount * 0.3 > item.amount) {
              copartnerEarning += item.amount;
            } else {
              personalEarning += item.amount;
            }
          }
        });

        setUserEarning({
          copartnerEarning,
          personalEarning,
        });
      } catch (error) {
        console.error("Error fetching the earning balance:", error);
        setUserEarning("Error");
      }
    };

    fetchEarningBalance();
  }, [stackholderId, customStartDate, customEndDate]);

  const handleCustomButtonClick = () => {
    setIsCustomPickerVisible(!isCustomPickerVisible);
  };

  const handleDateChange = (start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setIsCustomPickerVisible(false);
    setFilter("custom"); // Set filter to custom when custom dates are selected
  };

  const handleClearDates = () => {
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  return (
    <div className="flex flex-col py-8">
      <div className="flex md:gap-[28rem] xl:gap-[38rem] mb-2">
        <span className="text-xl font-semibold text-white">Earning analysis</span>
        <div className="flex items-start flex-col gap-2">
          <span className="text-xl font-semibold text-white md:mr-14 xl:mr-20 md:flex hidden">
            Earning Analysis Graph
          </span>
          <div className="mb-4 md:flex hidden gap-8">
            <button
              className={` p-2 rounded-[8px] ${
                filter === "today" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
              } md:text-[14px] border-solid border-[1px] border-white transition duration-300`}
              onClick={() => setFilter("today")}
            >
              Today
            </button>
            <button
              className={` p-2 rounded-[8px] ${
                filter === "weekly" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
              } md:text-[14px] border-solid border-[1px] border-white transition duration-300`}
              onClick={() => setFilter("weekly")}
            >
              Weekly
            </button>
            <button
              className={`p-2 rounded-[8px] ${
                filter === "monthly" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
              } md:text-[14px] border-solid border-[1px] border-white transition duration-300`}
              onClick={() => setFilter("monthly")}
            >
              Monthly
            </button>
            <div className="relative inline-block">
              <button
                className={`button rounded-[8px] ${
                  filter === "custom" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
                } md:text-[16px] border-solid border-[1px] border-white  transition duration-300 md:py-2 py-1 px-2 md:px-6 rounded mb-2 md:mb-0`}
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
                    onChange={(date) => handleDateChange(customStartDate, date)}
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
      </div>

      <div className="md:w-[1120px] xl:w-[1500px] w-[345px] xl:justify-around sm:w-[380px] md:flex-row flex-col md:gap-10 gap-8 flex xl:ml-[-2.6rem] md:ml-0 ml-[-6px]">
        <div className="flex flex-row bg_cards rounded-[10px] md:w-[100%] w-[358px] px-12">
          {/* <PieCharts />  */}
          <div className="flex flex-col md:items-center items-start md:justify-center md:gap-10 gap-7 md:w-[360px] md:h-auto w-[219px] h-auto md:py-0 py-4">
            <div className="flex flex-col">
              <span className="text-white font-[500] md:text-[16px] text-[10px] md:leading-[24px] leading-[12px]">
                Total Earning:
              </span>
              <span className="text-gradient text-white font-[600] md:text-[65px] text-[29px] md:leading-[55px] leading-[24px]">
                ₹{Number(earningAnalysis?.walletBalance) || 0}
              </span>
            </div>
            {isCoPartner && (
              <>
                <div className="flex flex-col md:mr-[3rem] mr-0">
                  <span className="text-white font-[500] md:text-[16px] text-[10px] md:leading-[24px] leading-[12px]">
                    Copartner Earning:
                  </span>
                  <span className="text-gradient text-white font-[600] md:text-[65px] text-[29px] md:leading-[55px] leading-[24px]">
                    ₹{userEarning.copartnerEarning.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-[500] md:text-[16px] text-[10px] md:leading-[24px] leading-[12px]">
                    Personal Earning:
                  </span>
                  <span className="text-gradient text-white font-[600] md:text-[65px] text-[29px] md:leading-[55px] leading-[24px]">
                    ₹{userEarning.personalEarning.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-col-reverse gap-8 items-start">
          <div className="md:hidden flex gap-6">
            <button
              className={`p-2 rounded-[8px] ${
                filter === "today" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
              } text-[14px] border-solid border-[1px] border-white transition duration-300`}
              onClick={() => setFilter("today")}
            >
              Today
            </button>
            <button
              className={`p-2 rounded-[8px] ${
                filter === "weekly" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
              } text-[14px] border-solid border-[1px] border-white transition duration-300`}
              onClick={() => setFilter("weekly")}
            >
              Weekly
            </button>
            <button
              className={`p-2 rounded-[8px] ${
                filter === "monthly" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
              } text-[14px] border-solid border-[1px] border-white transition duration-300`}
              onClick={() => setFilter("monthly")}
            >
              Monthly
            </button>
            <div className="relative inline-block">
              <button
                className={`p-2 rounded-[8px] ${
                  filter === "custom" ? "bg-[#fff] text-[#000]" : "bg-transparent text-[#fff]"
                } text-[14px] border-solid border-[1px] border-white  transition duration-300`}
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
                    onChange={(date) => handleDateChange(customStartDate, date)}
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
          <span className="text-xl font-semibold text-white md:mr-14 xl:mr-20 mb-0 mb-[-24px]">
            Earning Analysis Graph
          </span>
        </div>

        <div className="flex flex-row bg_cards rounded-[10px] md:w-[100%] md:h-[400px] w-[358px] h-[405px]">
          <Charts filter={filter} customStartDate={customStartDate} customEndDate={customEndDate} />
        </div>
      </div>
    </div>
  );
};

export default EarningAnalysis;
