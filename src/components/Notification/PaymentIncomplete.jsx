import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";

const PaymentIncomplete = ({ searchQuery }) => {
  const [userData, setUserData] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://copartners.in:5009/api/PaymentResponse?page=1&pageSize=100000"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        if (data.isSuccess) {
            console.log(data.data)
          setUserData(data.data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const determineUserType = (userData) => {
    if (userData.apId) {
      return "AP";
    } else if (userData.expertId) {
      return "RA";
    } else {
      return "CP";
    }
  };

  return (
    <div className="py-4 px-8">
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
      <table className="table-list w-full mt-4">
        <thead>
          <tr>
            <th className="text-left pl-8">Date</th>
            <th className="text-left pl-8">Time</th>
            <th className="text-left">User Number</th>
            <th className="text-left">Source</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.userId}>
              <td className="text-left pl-8">
                {new Date(user.date).toLocaleDateString()}
              </td>
              <td className="text-left pl-8">
                {new Date(user.date).toLocaleTimeString()}
              </td>
              <td className="text-left">{user.mobile}</td>
              <td className="text-left">{determineUserType(user)}</td>
              <td>{user.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentIncomplete;
