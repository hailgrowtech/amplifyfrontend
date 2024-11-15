import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageHeader from "../Header/Header";
import axios from "axios";

const ChatIds = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    axios
      .get("https://phonepe.copartner.in/api/getChatNames")
      .then((res) => {
        const sortedData = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setChatData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching chat names:", error);
        toast.error("Error fetching chat names");
      });
  }, []);

  const filteredData = chatData.filter((user) =>
    user.chatName.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Chat IDs"
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
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th style={{ textAlign: "left", paddingLeft: "2rem" }}>
                      Channel Name
                    </th>
                    <th style={{ textAlign: "left" }}>Chat ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((chat) => (
                    <tr key={chat._id}>
                      <td>{chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : ""}</td>
                      <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                        {chat.chatName}
                      </td>
                      <td style={{ textAlign: "left" }}>{chat.chatId}</td>
                    </tr>
                  ))}
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

export default ChatIds;
