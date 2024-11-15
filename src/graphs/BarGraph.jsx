import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarGraph = ({
  activeButton,
  customStartDate,
  customEndDate,
  onDataUpdate,
}) => {
  const [data, setData] = useState({ daily: [], weekly: [], monthly: [] });
  const [error, setError] = useState("");
  const stackholderId = sessionStorage.getItem("stackholderId");

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  // This function formats the date for display in the X-axis
  const formatMonthDay = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    // Return the original string if it is not a valid date
    return dateString;
  };

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://copartners.in:5132/api/RADashboard/GetDashboardRAListingData/${stackholderId}?page=1&pageSize=100000`
        );
        if (response.data.isSuccess) {
          const apiData = response.data.data;

          const dailyData = {};
          const startOfCurrentWeek = startOfWeek(new Date());

          const weeklyData = Array(7)
            .fill()
            .map((_, index) => {
              const date = addDays(startOfCurrentWeek, index);
              return {
                name: formatDate(date),
                totalVisit: 0,
                paidUsers: 0,
                usersLeft: 0,
              };
            });

          const monthlyData = Array(12)
            .fill()
            .map((_, index) => ({
              name: new Date(2024, index, 1).toLocaleString("default", {
                month: "long",
              }),
              totalVisit: 0,
              paidUsers: 0,
              usersLeft: 0,
            }));

          const subscriptionCount = {};

          apiData.forEach((item) => {
            const date = item.userJoiningDate
              ? new Date(item.userJoiningDate)
              : null;
            const dayLabel = date ? formatDate(date) : "Unknown Date";
            const month = date ? date.getMonth() : null;

            const totalVisit = 1;
            const subscription =
              item.subscription &&
              item.subscribeDate &&
              item.subscription !== "No Subscription" &&
              item.subscription !== "No Subscrption";
            const notInterested =
              item.subscription &&
              (item.subscription === "No Subscription" ||
                item.subscription === "No Subscrption")
                ? 1
                : 0;

            if (subscription) {
              const subscribeDate = item.subscribeDate.split("T")[0];
              subscriptionCount[subscribeDate] =
                (subscriptionCount[subscribeDate] || 0) + 1;
            }

            if (!dailyData[dayLabel]) {
              dailyData[dayLabel] = {
                name: dayLabel,
                totalVisit: 0,
                paidUsers: 0,
                usersLeft: 0,
              };
            }
            dailyData[dayLabel].totalVisit += totalVisit;
            dailyData[dayLabel].usersLeft += notInterested;

            if (date && date >= startOfCurrentWeek && date <= addDays(startOfCurrentWeek, 6)) {
              const index = Math.floor((date - startOfCurrentWeek) / (1000 * 60 * 60 * 24));
              weeklyData[index].totalVisit += totalVisit;
              weeklyData[index].usersLeft += notInterested;
            }

            if (month !== null) {
              monthlyData[month].totalVisit += totalVisit;
              monthlyData[month].usersLeft += notInterested;
            }
          });

          Object.keys(subscriptionCount).forEach((subscribeDate) => {
            const date = new Date(subscribeDate);
            const dayLabel = formatDate(date);
            const month = date.getMonth();

            if (dailyData[dayLabel]) {
              dailyData[dayLabel].paidUsers = subscriptionCount[subscribeDate];
            }

            if (date >= startOfCurrentWeek && date <= addDays(startOfCurrentWeek, 6)) {
              const index = Math.floor((date - startOfCurrentWeek) / (1000 * 60 * 60 * 24));
              weeklyData[index].paidUsers += subscriptionCount[subscribeDate];
            }

            monthlyData[month].paidUsers += subscriptionCount[subscribeDate];
          });

          setData({
            daily: Object.values(dailyData),
            weekly: weeklyData,
            monthly: monthlyData,
          });
        } else {
          setError(response.data.displayMessage || "Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching data: " + (error.message || "Unknown error"));
      }
    };
    fetchData();
  }, [stackholderId]);

  useEffect(() => {
    const selectedData = selectData();
    const totalVisits = selectedData.reduce(
      (sum, item) => sum + item.totalVisit,
      0
    );
    const paidUsers = selectedData.reduce(
      (sum, item) => sum + item.paidUsers,
      0
    );
    const notInterested = selectedData.reduce(
      (sum, item) => sum + item.usersLeft,
      0
    );
    onDataUpdate({ totalVisits, paidUsers, notInterested });
  }, [data, activeButton, customStartDate, customEndDate, onDataUpdate]);

  const selectData = () => {
    const today = formatDate(new Date());
    switch (activeButton) {
      case "today":
        const todayData = data.daily.filter((d) => d.name === today);
        return todayData.length > 0
          ? todayData
          : [{ name: today, totalVisit: 0, paidUsers: 0, usersLeft: 0 }];
      case "weekly":
        return data.weekly;
      case "monthly":
        return data.monthly;
      case "custom":
        if (customStartDate && customEndDate) {
          return data.daily.filter((d) => {
            const currentDate = new Date(d.name);
            return currentDate >= customStartDate && currentDate <= customEndDate;
          });
        }
        return [];
      default:
        return [];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip rounded-[10px] p-2 bg-gradient border border-[#ffffff31]">
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {`${entry.name} : ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer
      className="bg_cards rounded-[10px] ml-[-3.8rem] md:flex hidden"
      width="110%"
      height={370}
    >
      <BarChart
        data={selectData()}
        margin={{
          top: 25,
          right: 20,
          left: 30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="transparent" />
        <XAxis dataKey="name" stroke="#fff" tickFormatter={formatMonthDay} />
        <YAxis stroke="#fff" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Bar
          dataKey="totalVisit"
          fill="#8884D8"
          name="Total Visit"
          barSize={20}
        />
        <Bar
          dataKey="paidUsers"
          fill="#82CA9D"
          name="Paid Users"
          barSize={20}
        />
        <Bar
          dataKey="usersLeft"
          fill="#D0667A"
          name="Not Interested (Left)"
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
