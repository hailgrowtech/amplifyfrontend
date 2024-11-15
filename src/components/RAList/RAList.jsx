import React, { useState, useEffect } from "react";
import "./RAList.css";
import { FaAngleLeft } from "react-icons/fa6";
import PageHeader from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";

const RAList = () => {
  const { raId } = useParams();
  const navigate = useNavigate();
  const [selectedRA, setSelectedRA] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all"); // State to manage the current filter
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getExpertType = (typeId) => {
    switch (parseInt(typeId)) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Options";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://copartners.in:5132/api/RADashboard/GetDashboardRAListingData/${raId}?page=1&pageSize=10000`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const sortedData = data.data.sort(
          (a, b) => new Date(b.subscribeDate || b.userJoiningDate) - new Date(a.subscribeDate || a.userJoiningDate)
        );

        setSelectedRA(sortedData);
        setFilteredData(sortedData); // Set initial filtered data
      } catch (error) {
        toast.error("Error fetching RA data:", error);
      }
    };

    fetchData();
  }, [raId]);

  useEffect(() => {
    if (selectedRA) {
      const start = dateRange[0].startDate ? new Date(dateRange[0].startDate.setHours(0, 0, 0, 0)) : null;
      const end = dateRange[0].endDate ? new Date(dateRange[0].endDate.setHours(23, 59, 59, 999)) : null;
  
      const filteredAndSortedData = selectedRA.filter((ra) => {
        const subscribeDate = new Date(ra.subscribeDate);
        return (
          (filter === "all" ||
            (filter === "paid" && ra.amount !== null) ||
            (filter === "unpaid" && ra.amount === null)) &&
          (!start || !end || (subscribeDate >= start && subscribeDate <= end))
        );
      });
  
      setFilteredData(filteredAndSortedData);
    }
  }, [filter, selectedRA, dateRange]);

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="R.A Details"
        searchQuery=""
        setSearchQuery={() => {}}
        hasNotification={false}
        setHasNotification={() => {}}
      />

      <div className="back-button flex items-center text-2xl font-bold p-6 justify-between">
        <button onClick={() => navigate(-1)}>
          <FaAngleLeft />
          <span className="ml-1">Back</span>
        </button>
        <div className="mr-2 text-lg flex-row-reverse flex">
          <button
            onClick={() => setShowDatePicker(true)}
            className="border-2 border-black rounded-lg px-4 py-1"
          >
            Select Date Range
          </button>
        </div>
      </div>
      {showDatePicker && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Select Date Range</h2>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDatePicker(false)}
                className="border-2 border-black rounded-lg px-4 py-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredData && (
        <div className="requestContainer mx-5 bg-[#fff]">
          <div className="requestHeading flex justify-between items-center text-2xl font-bold p-4">
            <h2 className="pl-3 text-xl font-semibold">
              {filteredData[0]?.name}
            </h2>
            <div className="flex justify-between items-center px-6">
              <div className="flex gap-x-2">
                <h3 className="mr-2 channel-heads text-lg">
                  <button
                    className={`border-2 px-2 py-1 border-black rounded-xl ${
                      filter === "paid" ? "bg-black text-white" : ""
                    }`}
                    onClick={() => setFilter("paid")}
                  >
                    Paid
                  </button>
                </h3>
                <h3 className="mr-2 channel-heads text-lg">
                  <button
                    className={`border-2 px-2 py-1 border-black rounded-xl ${
                      filter === "unpaid" ? "bg-black text-white" : ""
                    }`}
                    onClick={() => setFilter("unpaid")}
                  >
                    Unpaid
                  </button>
                </h3>
                <h3 className="mr-2 channel-heads text-lg">
                  <button
                    className={`border-2 px-2 py-1 border-black rounded-xl ${
                      filter === "all" ? "bg-black text-white" : ""
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>
                </h3>
              </div>
            </div>
          </div>

          <div className="requestTable px-5 pb-3">
            <table className="request-table">
              <thead>
                <tr className="requestColumns">
                  <th className="text-left">Date</th>
                  <th className="text-left">Users</th>
                  <th>Source</th>
                  <th>Amount Paid</th>
                  <th>Subscription</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((ra, index) => (
                  <tr
                    key={index}
                    className="even:bg-gray-100 odd:bg-white font-semibold"
                  >
                    <td className="p-3">
                      {ra.subscribeDate ? new Date(ra.subscribeDate).toLocaleDateString() : new Date(ra.userJoiningDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{ra.userMobileNo}</td>
                    <td className="p-3 text-center">{ra.apName}</td>
                    <td className="p-3 text-orange-500 text-center">
                      {ra.amount}
                    </td>
                    <td className="p-3 text-center">
                      {getExpertType(ra.subscription)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RAList;
