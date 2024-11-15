import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import Bin from "../../assets/TrashBinMinimalistic.png";
import PageHeader from "../Header/Header";
import { Link } from "react-router-dom";

const RAUserData = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openSubAdmin = () => {
    setIsPopupOpen(true);
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="RA User Data"
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
              <button className="border-2 border-black rounded-lg px-4 py-1 mr-4" onClick={openSubAdmin} >
                + Add
              </button>
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", paddingLeft: "2rem" }}>
                      RA Name
                    </th>
                    <th style={{ textAlign: "left" }}>SEBI Number</th>
                    <th>User Data Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                      <Link>Parvez</Link>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      SEBI9879263
                    </td>
                    <td>5</td>
                    <td className="flex justify-center items-center gap-6">
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RAUserData;
