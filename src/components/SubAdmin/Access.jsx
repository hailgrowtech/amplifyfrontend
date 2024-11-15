import { Switch } from "@mui/material";
import React, { useState } from "react";
import { FaAngleLeft, FaPen } from "react-icons/fa";
import Bin from "../../assets/TrashBinMinimalistic.png";
import PageHeader from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AccessPopup from "./AccessPopup";

const Access = () => {
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openAccess = () => {
    setIsPopupOpen(true);
  };

  const closeAccess = () => {
    setIsPopupOpen(false);
  }
  return (
    <div className="dashboard-container p-0 sm:ml-60">
      {/* Page Header */}
      <PageHeader
        title="Access"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      {/* Back Button */}
      <div className="back-button flex items-center text-2xl font-bold p-6">
        <button
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft />
          <span className="ml-1">Back</span>
        </button>
      </div>

      {/* Display AP details */}
      <div className="requestContainer mx-5 bg-[#fff]">
        <div className="channel-heading flex">
          <h3 className="text-xl font-semibold mr-auto">Listing</h3>
          <button  onClick={openAccess} className="border-2 border-black rounded-lg px-4 py-1 mr-4">
            + Add
          </button>
        </div>

        {/* Table Layout */}
        <div className="py-4 px-8">
          <table className="table-list">
            <thead>
              <tr className="requestColumns">
                <th className="text-left">Date</th>
                <th className="text-left">Role</th>
                <th>Access</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="request-numbers font-semibold">
                <td>01/04/24</td>
                <td>R.A Details</td>
                <td className="text-center">View Only</td>
                <td className="text-center">
                  <Switch color="primary" />
                </td>
                <td className="flex justify-center items-center gap-6 p-3">
                  <FaPen className="text-blue-600 cursor-pointer" />
                  <img
                    className="w-6 h-6 cursor-pointer"
                    src={Bin}
                    alt="Delete"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {isPopupOpen && <AccessPopup closeAccess={closeAccess}  />}
      <ToastContainer />
    </div>
  );
};

export default Access;
