import React, { useState, useEffect } from "react";
import "./APPage.css";
import { FaAngleLeft } from "react-icons/fa6";
import PageHeader from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";

const APPage = () => {
  const { apName } = useParams();
  const navigate = useNavigate();
  const [apData, setApData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filter, setFilter] = useState("all");
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
    fetchAPData();
  }, [apName]);

  const fetchAPData = async () => {
    try {
      const response = await fetch(
        `https://copartners.in:5133/api/APDashboard/GetDashboardAPListingData/${apName}?page=1&pageSize=10000`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const sortedData = data.data.sort(
        (a, b) => new Date(b.subscribeDate || b.userJoiningDate) - new Date(a.subscribeDate || a.userJoiningDate)
      );
      setApData(sortedData);
      setFilteredData(sortedData); // Set initial filtered data
    } catch (error) {
      console.error("Fetching error:", error);
      toast.error(`Failed to fetch AP data: ${error.message}`);
    }
  };

  useEffect(() => {
    if (apData) {
      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;

      const filteredAndSortedData = apData.filter((data) => {
        const joiningDate = new Date(data.subscribeDate);
        return (
          (filter === "all" ||
            (filter === "paid" && data.amount !== null) ||
            (filter === "unpaid" && data.amount === null)) &&
          (!start || !end || (joiningDate >= start && joiningDate <= end))
        );
      });

      setFilteredData(filteredAndSortedData);
    }
  }, [filter, apData, dateRange]);

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      {/* Page Header */}
      <PageHeader
        title="A.P"
        searchQuery=""
        setSearchQuery={() => {}}
        hasNotification={false}
        setHasNotification={() => {}}
      />

      {/* Back Button */}
      <div className="back-button flex items-center text-2xl font-bold p-6 justify-between">
        <button
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(-1)}
        >
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

      {/* Display AP details */}
      {filteredData ? (
        <div className="requestContainer mx-5 bg-[#fff]">
          <div className="requestHeading flex justify-between items-center text-2xl font-bold p-4">
            <h2 className="pl-3 text-xl font-semibold">
              {filteredData[0]?.apName}
            </h2>
            <div className="channelOptions flex place-content-between px-6 gap-x-4">
              <div className="chatLinks flex items-center">
                <h3 className="mr-2 channel-heads text-lg">Link:</h3>
                <p className="text-lg">
                  {filteredData[0]?.referralLink || "N/A"}
                </p>
              </div>
              <div className="chatLinks flex">
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

          {/* Table Layout */}
          <div className="requestTable px-5 pb-3">
            <table className="request-table">
              <thead>
                <tr className="requestColumns">
                  <th className="text-left">Date</th>
                  <th className="text-left">User</th>
                  <th>Amount Pay</th>
                  <th>R.A</th>
                  <th>Subscription</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, index) => (
                  <tr key={index} className="even:bg-gray-100 odd:bg-white font-semibold">
                    <td className="p-3">
                      {data.subscribeDate ? new Date(data.subscribeDate).toLocaleDateString() : new Date(data.userJoiningDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {/* <Link to={`/${apName}/${data.userMobileNo}`}> */}
                      {data.userMobileNo}
                      {/* </Link> */}
                    </td>
                    <td className="p-3 text-center">{data.amount}</td>
                    <td className="p-3 text-center">{data.raName}</td>
                    <td className="p-3 text-center">
                      {getExpertType(data.subscription)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-28 text-3xl font-bold p-6">
          User not found!
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default APPage;
