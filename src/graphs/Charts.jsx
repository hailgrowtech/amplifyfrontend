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
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  isSameWeek,
  isSameMonth,
  getMonth,
  compareAsc,
  isToday,
} from "date-fns";
import PropTypes from "prop-types";

const Charts = ({ filter, customStartDate, customEndDate }) => {
  const [data, setData] = useState({ daily: [], weekly: [], monthly: [], custom: [] });
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const stackholderId = sessionStorage.getItem("stackholderId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (stackholderId) {
          const response = await axios.get(
            `https://copartners.in:5132/api/RADashboard/GetDashboardRAListingData/${stackholderId}?page=1&pageSize=100000`
          );

          if (response.data.isSuccess) {
            const apiData = response.data.data;
            const currentMonth = new Date().getMonth();

            const monthlyData = Array(12)
              .fill()
              .map((_, index) => ({
                name: format(new Date(2024, index, 1), "MMMM"), // Keep monthly names unchanged
                earnings: 0,
              }));

            const weeklyData = [];
            const monthStart = startOfMonth(new Date(2024, currentMonth, 1));
            const monthEnd = endOfMonth(new Date(2024, currentMonth, 1));
            const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });

            weeks.forEach((weekStart) => {
              weeklyData.push({
                name: format(weekStart, "MMM dd"), // Format as Month Date (e.g., Sep 01)
                earnings: 0,
              });
            });

            const dailyData = [];
            const customDataMap = new Map();

            apiData.forEach((item) => {
              if (item.subscribeDate && item.amount !== null) {
                const date = parseISO(item.subscribeDate);
                const month = getMonth(date);
                const earnings = item.amount || 0;

                monthlyData[month].earnings += earnings;

                if (isSameMonth(date, new Date())) {
                  const weekIndex = weeklyData.findIndex((week) =>
                    isSameWeek(date, parseISO(week.name))
                  );

                  if (weekIndex !== -1) {
                    weeklyData[weekIndex].earnings += earnings;
                  }
                }

                if (isToday(date)) {
                  dailyData.push({
                    name: format(date, "MMM dd HH:mm"), // Format today’s data as Month Date and time (e.g., Sep 15 14:00)
                    earnings,
                  });
                }

                if (customStartDate && customEndDate && date >= customStartDate && date <= customEndDate) {
                  const dateString = format(date, "MMM dd"); // Format custom range dates as Month Date
                  if (!customDataMap.has(dateString)) {
                    customDataMap.set(dateString, { name: dateString, earnings });
                  } else {
                    customDataMap.get(dateString).earnings += earnings;
                  }
                }
              }
            });

            const customData = Array.from(customDataMap.values()).sort((a, b) =>
              compareAsc(parseISO(a.name), parseISO(b.name))
            );

            const totalCustomEarnings = customData.reduce((acc, item) => acc + item.earnings, 0);
            const totalTodayEarnings = dailyData.reduce((acc, item) => acc + item.earnings, 0);
            const totalWeeklyEarnings = weeklyData.reduce((acc, item) => acc + item.earnings, 0);
            const totalMonthlyEarnings = monthlyData.reduce((acc, item) => acc + item.earnings, 0);

            setData({ daily: dailyData, weekly: weeklyData, monthly: monthlyData, custom: customData });

            if (filter === "today") {
              setTotalEarnings(totalTodayEarnings);
            } else if (filter === "weekly") {
              setTotalEarnings(totalWeeklyEarnings);
            } else if (filter === "monthly") {
              setTotalEarnings(totalMonthlyEarnings);
            } else if (filter === "custom") {
              setTotalEarnings(totalCustomEarnings);
            }
          } else {
            setError(response.data.displayMessage);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stackholderId, customStartDate, customEndDate, filter]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip rounded-[10px] p-2 bg-gradient border border-[#ffffff31]">
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {`${entry.name} : ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  let chartData = [];
  if (filter === "today") {
    chartData = data.daily;
  } else if (filter === "weekly") {
    chartData = data.weekly;
  } else if (filter === "monthly") {
    chartData = data.monthly;
  } else if (filter === "custom") {
    chartData = data.custom;
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#2b2d42",
        borderRadius: "30px",
        padding: "15px",
      }}
    >
      {error && <div className="text-red-500">{error}</div>}
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 60, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3e5c" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar
            dataKey="earnings"
            fill="#64dfdf"
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-white text-lg font-semibold mt-4">
        Total Earnings: ₹{totalEarnings.toFixed(2)}
      </div>
    </div>
  );
};

Charts.propTypes = {
  filter: PropTypes.string.isRequired,
  customStartDate: PropTypes.instanceOf(Date),
  customEndDate: PropTypes.instanceOf(Date),
};

export default Charts;
