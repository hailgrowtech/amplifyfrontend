import { useState, useCallback, useEffect } from "react";
import "./RADetail.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PageHeader from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import RAPopup from "./RAPopup";
import Personal from "./Personal";
import axios from "axios";

const RADetail = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState("button1");
  const [hasNotification, setHasNotification] = useState(true);
  const [popup, setPopup] = useState({
    isOpen: false,
    item: null,
    mode: "edit",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://copartners.in:5132/api/RADashboard/DashboardRADetails?isCoPartner=true&page=1&pageSize=10000`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const fetchedData = await response.json();
      const sortedData = fetchedData.data.sort(
        (a, b) => new Date(b.joinDate) - new Date(a.joinDate)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch RA Details");
    }
  };

  const handleOpenPopup = useCallback(async (item, mode = "edit") => {
    if (mode === "edit" || mode === "view") {
      try {
        const response = await fetch(
          `https://copartners.in:5132/api/Experts/${item.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const fetchedData = await response.json();
        setPopup({ isOpen: true, item: fetchedData.data, mode });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch RA Details");
      }
    } else {
      setPopup({ isOpen: true, item: null, mode });
    }
  }, []);

  const handleClosePopup = useCallback(() => {
    setPopup({ isOpen: false, item: null, mode: "edit" });
  }, []);

  const handleSave = () => {
    fetchData();
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="R.A Details"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setHasNotification={setHasNotification}
      />

      <div className="px-4 flex gap-8">
        <button
          onClick={() => handleButtonClick("button1")}
          className={`px-8 py-4 border-2 rounded-xl ${
            activeButton === "button1" ? "border-black" : "border-gray-200"
          } font-semibold`}
        >
          With Copartner R.A
        </button>
        <button
          onClick={() => handleButtonClick("button2")}
          className={`px-8 py-4 border-2 rounded-xl ${
            activeButton === "button2" ? "border-black" : "border-gray-200"
          } font-semibold`}
        >
          Personal R.A
        </button>
      </div>

      <div className="p-4">
        {activeButton === "button1" ? (
          <div className="dashboard-view-section mb-4">
            <div className="table-list-mb">
              <div className="channel-heading flex">
                <h3 className="text-xl font-semibold mr-auto">Listing</h3>
                <button
                  className="border-2 border-black rounded-lg px-4 py-1 mr-4"
                  onClick={() => handleOpenPopup(null, "add")}
                  aria-label="Add new RA detail"
                >
                  + Add
                </button>
              </div>
              <div className="py-4 px-8">
                <table className="table-list">
                  <thead>
                    <tr>
                      <th>Join Date</th>
                      <th>Channel Name</th>
                      <th>GST No.</th>
                      <th>Commission Fix</th>
                      <th>Wallet Bal.</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr
                        className="even:bg-gray-100 odd:bg-white"
                        key={item.id}
                      >
                        <td>{new Date(item.joinDate).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/r.a/${item.id}`}>{item.channelName}</Link>
                        </td>
                        <td>{item.gst}</td>
                        <td>{item.fixCommission}%</td>
                        <td className="text-red-600">
                          <AsyncRaEarning id={item.id} />
                        </td>
                        <td className="text-green-600 flex justify-center items-center gap-6">
                          <button
                            onClick={() => handleOpenPopup(item, "edit")}
                            aria-label={`Edit ${item.name}`}
                          >
                            <FaPen className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleOpenPopup(item, "view")}
                            aria-label={`View ${item.name}`}
                          >
                            <IoEyeSharp className=" text-blue-500 text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <Personal />
        )}
      </div>
      {popup.isOpen && (
        <RAPopup
          onClose={handleClosePopup}
          onSave={handleSave}
          mode={popup.mode}
          initialValues={popup.item}
        />
      )}
      <ToastContainer />
    </div>
  );
};

const AsyncRaEarning = ({ id }) => {
  const [earning, setEarning] = useState(null);

  const totalRaEarning = async (id) => {
    try {
      const response = await axios.get(
        `https://copartners.in:5135/api/Wallet/GetWalletWithdrawalBalance/${id}?userType=RA`
      );
      return response.data.data.withdrawalBalance;
    } catch (error) {
      console.error(error.message);
      return "Error fetching data";
    }
  };

  useEffect(() => {
    const fetchEarning = async () => {
      const result = await totalRaEarning(id);
      setEarning(result !== null && result !== undefined ? result : 0);
    };
    fetchEarning();
  }, [id]);

  if (earning === "Error fetching data") {
    return <span>Error fetching data</span>;
  }

  return earning !== null ? earning : "Loading...";
};

export default RADetail;
