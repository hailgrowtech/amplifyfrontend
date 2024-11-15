import { useState, useEffect } from "react";
import "./Dashboard.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import PageHeader from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://copartners.in:5133/api/APDashboard/DashboardAPListing?page=1&pageSize=10000`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData.data);
    } catch (error) {
      toast.error("Failed to fetch data", {
        position: "top-right",
      });
    }
  };

  const totalUsersCount = data.reduce((sum, row) => sum + row.usersCount, 0);
  const totalUsersPay = data.reduce((sum, row) => sum + row.usersPayment, 0);
  const totalApEarning = data.reduce((sum, row) => sum + row.apEarning, 0);
  const totalRaEarning = data.reduce((sum, row) => sum + row.raEarning, 0);
  const totalCpEarning = data.reduce((sum, row) => sum + row.cpEarning, 0);

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="A.P"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      <div className="p-4">
        <div className="dashboard-view-section mb-4">
          <div className="table-list-mb">
            <div className="channel-heading">
              <h3 className="text-xl font-semibold">Listing</h3>
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th>AP Name</th>
                    <th>Users Come</th>
                    <th>Users Pay</th>
                    <th>Spend on A.P</th>
                    <th>Spend on R.A</th>
                    <th>Earning</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="even:bg-gray-100 odd:bg-white">
                      <td>
                        <Link to={`/${row.id}`}>{row.apName}</Link>
                      </td>
                      <td>{row.usersCount}</td>
                      <td className="text-blue-400">
                        <Link to={`/${row.id}`}>{row.usersPayment}</Link>
                      </td>
                      <td className="text-red-500">{row.apEarning}</td>
                      <td className="text-red-500">{row.raEarning}</td>
                      <td className="text-green-600">{row.cpEarning}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td
                      style={{
                        paddingLeft: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{ fontWeight: "bold" }}
                      className="text-blue-600"
                    >
                      {totalUsersCount}
                    </td>
                    <td
                      style={{ fontWeight: "bold" }}
                      className="text-blue-600"
                    >
                      {totalUsersPay}
                    </td>
                    <td style={{ fontWeight: "bold" }} className="text-red-500">
                      {totalApEarning.toFixed(1)}
                    </td>
                    <td
                      style={{ fontWeight: "bold" }}
                      className="text-green-600"
                    >
                      {totalRaEarning.toFixed(1)}
                    </td>
                    <td
                      style={{ fontWeight: "bold" }}
                      className="text-green-600"
                    >
                      {totalCpEarning.toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
