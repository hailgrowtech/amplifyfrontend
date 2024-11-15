import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PageHeader from "../Header/Header";
import TelegramPopup from "./TelegramPopup";
import { FaTrash } from "react-icons/fa";

const TelegramPage = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [channels, setChannels] = useState([]);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(
        "https://copartners.in:5134/api/TelegramMessage?page=1&pageSize=100000"
      );
      if (response.data.isSuccess) {
        setChannels(response.data.data);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const openSubAdmin = () => {
    setIsPopupOpen(true);
  };

  const closeSubAdmin = () => {
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    fetchChannels();
    setIsPopupOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://copartners.in:5134/api/TelegramMessage/${id}`
      );
      if (response.data.isSuccess) {
        toast.success("Channel deleted successfully");
        fetchChannels(); // Refresh the channel list after deletion
      } else {
        toast.error("Failed to delete channel");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the channel");
    }
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Sub Admin Management"
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
                onClick={openSubAdmin}
              >
                + Add
              </button>
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", paddingLeft: "2rem" }}>
                      Channel Name
                    </th>
                    <th style={{ textAlign: "left" }}>Chat ID</th>
                    <th>Join Message</th>
                    <th>Leave Message</th>
                    <th>Marketing Message</th>
                    <th>Assigned to</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((channel) => (
                    <tr
                      className="even:bg-gray-100 odd:bg-white"
                      key={channel.id}
                    >
                      <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                        {channel.channelName}
                      </td>
                      <td
                        style={{ textAlign: "left" }}
                        className="text-blue-600"
                      >
                        {channel.chatId}
                      </td>
                      <td>{channel.joinMessage}</td>
                      <td>{channel.leaveMessage}</td>
                      <td>{channel.marketingMessage}</td>
                      <td>
                        {channel.expertsName || channel.affiliatePartnersName}
                      </td>
                      <td className="flex justify-center">
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(channel.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <TelegramPopup onClose={closeSubAdmin} onSave={handleSave} />
      )}
      <ToastContainer />
    </div>
  );
};

export default TelegramPage;
