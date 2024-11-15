import React, { useState, useEffect } from "react";
import axios from "axios";
import { backImg } from "../assets";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";

const AnalysisBoard = ({stackholderId}) => {
  const [showAnalysis, setShowAnalysis] = useState("totalVisit");
  const [smallScreen, setSmallScreen] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeButtonSecondSection, setActiveButtonSecondSection] =
    useState("today");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isCustomPickerVisible, setIsCustomPickerVisible] = useState(false);

  const ANALYSIS_API = `/RADashboard/GetDashboardRAListingData/${stackholderId}?page=1&pageSize=100000`;

  useEffect(() => {
    api
      .get(ANALYSIS_API)
      .then((response) => {
        setAnalysis(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [ANALYSIS_API]);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isSameWeek = (date1, date2) => {
    const startOfWeek = (date) => {
      const newDate = new Date(date);
      const day = newDate.getDay();
      const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      return new Date(newDate.setDate(diff));
    };
    return isSameDay(startOfWeek(date1), startOfWeek(date2));
  };

  const isSameMonth = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  const isBetween = (date, start, end) => {
    return date >= start && date <= end;
  };

  const filterByDate = (data, dateFilter) => {
    const now = new Date();
    return data.filter((item) => {
      const joinDate = new Date(item.userJoiningDate);
      if (dateFilter === "today") {
        return isSameDay(joinDate, now);
      } else if (dateFilter === "weekly") {
        return isSameWeek(joinDate, now);
      } else if (dateFilter === "monthly") {
        return isSameMonth(joinDate, now);
      } else if (dateFilter === "custom" && customStartDate && customEndDate) {
        return isBetween(joinDate, customStartDate, customEndDate);
      }
      return true;
    });
  };

  const filteredAnalysis = filterByDate(
    analysis,
    activeButtonSecondSection
  ).filter((item) => {
    if (showAnalysis === "totalVisit") return true;
    if (showAnalysis === "paidUser") return item.planType.trim() !== "No Plan";
    if (showAnalysis === "notInterested")
      return item.planType.trim() === "No Plan";
    return true;
  });

  const totalPages = Math.ceil(filteredAnalysis.length / pageSize);
  const currentPageData = filteredAnalysis.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  return (
    <div className="pb-[5rem] xl:pl-[12rem] md:pl-[10rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="flex flex-col md:gap-6 gap-3">
        <div className="flex md:flex-row justify-between items-center">
        <div className="flex flex-row items-center justify-between md:ml-0 ml-[-8px]">
          <div className="flex flex-col gap-8 mt-4">
            <div className="flex md:justify-between md:flex-row flex-row-reverse items-center">
              <span className="text-white md:w-[210px] h-[27px] font-inter font-[600] md:text-[22px] text-[16px] md:leading-[27px] md:items-center items-start">
                Analysis History
              </span>
              <Link to="/">
                <img
                  src={backImg}
                  alt="BACK"
                  className="w-[30px] h-[30px] md:hidden block"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center md:gap-[2rem] gap-1 mr-2 mt-4">
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
                              {new Date(0, month).toLocaleString(undefined, {
                                month: "long",
                              })}
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
                              {new Date(0, month).toLocaleString(undefined, {
                                month: "long",
                              })}
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

        <div className="flex flex-col md:justify-between md:gap-0 gap-2">
          <div className="flex flex-row md:gap-4 gap-2 md:ml-0 ml-[-10px]">
            <button
              onClick={() => {
                setShowAnalysis("totalVisit");
                setCurrentPage(1);
              }}
              className={`w-[120px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                showAnalysis === "totalVisit"
                  ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                  : "bg-transparent text-white font-[600] font-inter text-[12px]"
              }`}
            >
              Total Visit
            </button>
            <button
              onClick={() => {
                setShowAnalysis("paidUser");
                setCurrentPage(1);
              }}
              className={`w-[90px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                showAnalysis === "paidUser"
                  ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                  : "bg-transparent text-white font-[600] font-inter text-[12px]"
              }`}
            >
              Paid User
            </button>
            <button
              onClick={() => {
                setShowAnalysis("notInterested");
                setCurrentPage(1);
              }}
              className={`w-[140px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                showAnalysis === "notInterested"
                  ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                  : "bg-transparent text-white font-[600] font-inter text-[12px]"
              }`}
            >
              Not Interested
            </button>
          </div>
        </div>

        <>
          {smallScreen ? (
            <div className="flex flex-col pl-[5rem] flex-wrap justify-center items-center">
              {currentPageData.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-around w-[358px] ml-[-6rem] h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4"
                >
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DATE:</span>{" "}
                    {new Date(item.userJoiningDate).toLocaleString()}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">USER NUMBER:</span>{" "}
                    {item.userMobileNo}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">SUBSCRIPTION:</span>{" "}
                    {showAnalysis === "paidUser" ? item.planType : ""}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">AMOUNT:</span>{" "}
                    {showAnalysis === "paidUser" ? item.amount : ""}
                  </span>
                </div>
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div>
              <table className="xl:w-[1520px] md:w-[1130px] md:h-auto p-8 h-[497px] bg-[#29303F] rounded-md">
                <thead className="text-dimWhite bg-[#18181B]">
                  <tr>
                    <th className="text-center py-2">DATE</th>
                    <th className="text-center py-2">USER NUMBER</th>
                    <th className="text-center py-2">SUBSCRIPTION</th>
                    <th className="text-center py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-lightWhite">
                  {currentPageData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-[#18181B]" : ""}
                    >
                      <td className="text-center py-2">
                        {new Date(item.userJoiningDate).toLocaleString()}
                      </td>
                      <td className="text-center py-2">{item.userMobileNo}</td>
                      <td className="text-center py-2">
                        {showAnalysis === "paidUser" ? item.planType : ""}
                      </td>
                      <td className="text-center py-2">
                        {showAnalysis === "paidUser" ? item.amount : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default AnalysisBoard;
