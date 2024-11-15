import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PageHeader from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import APDetailPopup from "./APDetailPopup";
import { IoEyeSharp } from "react-icons/io5";
import axios from "axios";

const APDetail = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://copartners.in:5133/api/APDashboard/DashobaordAPDetails?page=1&pageSize=10000`
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
      toast.error("Failed to fetch A.P Details");
    }
  };

  const handleOpenPopup = (item, mode = "edit") => {
    if (mode === "view") {
      setViewItem(item);
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(true);
      setEditItem(item);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditItem(null);
    setViewItem(null);
  };

  const handleSave = async () => {
    fetchData();
    handleClosePopup();
    toast.success("A.P. details saved successfully!");
  };

  const handleChangeMode = () => {
    setEditItem(viewItem);
    setViewItem(null);
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="A.P Details"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      <div className="p-4">
        <div className="dashboard-view-section mb-4">
          <div className="table-list-mb">
            <div className="channel-heading flex">
              <h3 className="text-xl font-semibold mr-auto">Listing</h3>
              <button
                className="border-2 border-black rounded-lg px-4 py-1 mr-4"
                onClick={() => handleOpenPopup(null, "add")}
              >
                + Add
              </button>
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th>Join Date</th>
                    <th>A.P</th>
                    <th>Legal Name</th>
                    <th>GSTIN</th>
                    <th>CM. Fix 1</th>
                    <th>CM. Fix 2</th>
                    <th>Spend</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr className="even:bg-gray-100 odd:bg-white" key={item.id}>
                      <td>{new Date(item.joinDate).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/${item.id}`}>{item.apName}</Link>
                      </td>
                      <td>{item.legalName}</td>
                      <td>{item.gst}</td>
                      <td>{item.fixCommission1}</td>
                      <td>{item.fixCommission2}</td>
                      <td style={{textAlign: "center"}} className="text-red-600">
                        <AsyncApEarning id={item.id} />
                      </td>
                      <td className="text-green-600 flex justify-center items-center gap-6">
                        <button
                          onClick={() => handleOpenPopup(item, "edit")}
                          aria-label="Edit"
                        >
                          <FaPen className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleOpenPopup(item, "view")}
                          aria-label="View"
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
      </div>
      {isPopupOpen && !viewItem && (
        <APDetailPopup
          onClose={handleClosePopup}
          onSave={handleSave}
          mode={editItem ? "edit" : "add"}
          initialValues1={editItem || {}}
        />
      )}
      {viewItem && (
        <APDetailPopup
          onClose={handleClosePopup}
          onSave={handleSave}
          mode="view"
          initialValues1={viewItem}
          onChangeMode={handleChangeMode}
        />
      )}
      <ToastContainer />
    </div>
  );
};

const AsyncApEarning = ({ id }) => {
  const [earning, setEarning] = useState(null);

  const totalRaEarning = async (id) => {
    try {
      const response = await axios.get(
        `https://copartners.in:5135/api/Wallet/GetWalletWithdrawalBalance/${id}?userType=AP`
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

export default APDetail;
