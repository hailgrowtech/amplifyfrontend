import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import PageHeader from "../Header/Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const APList = () => {
  const navigate = useNavigate();
  const { apName } = useParams();
  const [apDetails, setApDetails] = useState([]);
  const [referralLink, setReferralLink] = useState("");
  const [apHeading, setApHeading] = useState("")

  useEffect(() => {
    const fetchAPDetails = async () => {
      try {
        const response = await fetch(
          `https://copartners.in:5133/api/APDashboard/GetDashboardAPListingData/${apName}?page=1&pageSize=10000`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${apName}`);
        }
        const data = await response.json();
        if (data.isSuccess) {
          const sortedData = data.data.sort(
            (a, b) => new Date(b.userJoiningDate) - new Date(a.userJoiningDate)
          );
          setApDetails(sortedData);
          setReferralLink(data.data[0].referralLink);
          setApHeading(data.data[0].apName);
        } else {
          setApDetails([]);
        }
      } catch (error) {
        console.error("Fetching error:", error);
        toast.error(`Failed to fetch A.P. details: ${error.message}`);
      }
    };

    fetchAPDetails();
  }, [apName]);

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="A.P Details"
        searchQuery=""
        setSearchQuery={() => {}}
        hasNotification={false}
        setHasNotification={() => {}}
      />
      <div className="back-button flex items-center text-2xl font-bold p-6">
        <button
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft />
          <span className="ml-1">Back</span>
        </button>
      </div>
      <div className="requestContainer mx-5 bg-[#fff]">
        <div className="requestHeading flex justify-between items-center text-2xl font-bold p-4">
          <h2 className="pl-3 text-xl font-semibold">{apHeading}</h2>
          <div className="channelOptions flex place-content-between px-6">
            <div
              style={{ justifyContent: "space-around" }}
              className="chatLinks flex"
            >
              <h3 className="mr-2 channel-heads text-lg">Link:</h3>
              <p className="text-lg">{referralLink || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="py-4 px-8">
          <table className="table-list">
            <thead>
              <tr className="requestColumns">
                <th style={{ textAlign: "left", paddingLeft: "2rem" }}>Date</th>
                <th style={{ textAlign: "left" }}>Users Come</th>
                <th>Users Pay</th>
              </tr>
            </thead>
            <tbody>
              {apDetails.length > 0 &&
                apDetails.map((apdetail) => (
                  <tr className="request-numbers font-semibold">
                    <td
                      style={{ textAlign: "left", paddingLeft: "2rem" }}
                      className="p-3"
                    >
                      {new Date(apdetail.userJoiningDate).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: "left" }} className="p-3">
                      {apdetail.userMobileNo}
                    </td>
                    <td className="p-3 text-center text-blue-500">
                      {/* <Link to={`/${apdetail.apName}`}> */}
                        {apdetail.amount}
                      {/* </Link> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default APList;
