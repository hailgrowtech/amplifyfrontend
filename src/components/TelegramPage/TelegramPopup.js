import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import closeIcon from "../../assets/close.png";
import { toast } from "react-toastify";

const TelegramPopup = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    chatId: "",
    channelName: "",
    joinMessage: "",
    leaveMessage: "",
    marketingMessage: "",
    assignedTo: "RA",
    expertsName: "",
    expertsId: "",
    affiliatePartnersName: "",
    affiliatePartnersId: "",
  });
  const [chatNames, setChatNames] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [userType, setUserType] = useState("RA");

  useEffect(() => {
    const fetchChatNames = async () => {
      try {
        const response = await fetch(
          "https://tbot.copartner.in/api/getStockChannels"
        );
        const data = await response.json();
        setChatNames(data);
      } catch (error) {
        console.error("Error fetching chat names:", error);
        toast.error("Failed to fetch chat names");
      }
    };

    const fetchUsers = async (userType) => {
      try {
        const response = await fetch(
          `https://copartners.in:5130/api/Users?userType=${userType}&page=1&pageSize=10000`
        );
        const data = await response.json();
        setUserOptions(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(`Failed to fetch ${userType} users`);
      }
    };

    fetchChatNames();
    fetchUsers(userType);
  }, [userType]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleChatChange = (e) => {
    const selectedChatId = e.target.value;
    const selectedChat = chatNames.find(
      (chat) => chat.chatId === selectedChatId
    );
    setFormData({
      ...formData,
      chatId: selectedChatId,
      channelName: selectedChat ? selectedChat.chatName : "",
    });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData({
      ...formData,
      assignedTo: e.target.value,
      expertsName: "",
      expertsId: "",
      affiliatePartnersName: "",
      affiliatePartnersId: "",
    });
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = userOptions.find((user) => user.id === selectedUserId);
    console.log(selectedUser);
    setFormData({
      ...formData,
      expertsName: userType === "RA" ? selectedUser.name : formData.expertsName,
      expertsId:
        userType === "RA" ? selectedUser.stackholderId : formData.expertsId,
      affiliatePartnersName:
        userType === "AP" ? selectedUser.name : formData.affiliatePartnersName,
      affiliatePartnersId:
        userType === "AP"
          ? selectedUser.stackholderId
          : formData.affiliatePartnersId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newChatSettings = {
      chatId: formData.chatId,
      channelName: formData.channelName,
      joinMessage: formData.joinMessage,
      leaveMessage: formData.leaveMessage,
      marketingMessage: formData.marketingMessage,
      assignedTo: formData.assignedTo,
      expertsName: formData.expertsName,
      expertsId: formData.expertsId,
      affiliatePartnersName: formData.affiliatePartnersName,
      affiliatePartnersId: formData.affiliatePartnersId,
    };

    console.log(newChatSettings);

    try {
      const saveResponse = await fetch(
        "https://copartners.in:5134/api/TelegramMessage?page=1&pageSize=100000",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newChatSettings),
        }
      );

      const result = await saveResponse.json();
      if (!result.isSuccess) {
        throw new Error("Failed to save chat settings data");
      }
      console.log(result);
      onSave();
      toast.success("Chat settings added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save chat settings data");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-left">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            Add Chat Settings
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={closeIcon} alt="Close" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-12 py-4 grid grid-cols-2 gap-6"
        >
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="chatId-label">Chat ID</InputLabel>
            <Select
              labelId="chatId-label"
              id="chatId"
              value={formData.chatId}
              onChange={handleChatChange}
              label="Chat ID"
            >
              {chatNames.map((chat) => (
                <MenuItem key={chat.chatId} value={chat.chatId}>
                  {chat.chatName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="channelName"
            label="Channel Name"
            value={formData.channelName}
            variant="outlined"
            fullWidth
            disabled
          />
          <TextField
            id="joinMessage"
            label="Join Message"
            value={formData.joinMessage}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            id="leaveMessage"
            label="Leave Message"
            value={formData.leaveMessage}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            id="marketingMessage"
            label="Marketing Message"
            value={formData.marketingMessage}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="userType-label">User Type</InputLabel>
            <Select
              labelId="userType-label"
              value={userType}
              onChange={handleUserTypeChange}
              label="User Type"
            >
              <MenuItem value="RA">RA</MenuItem>
              <MenuItem value="AP">AP</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="assignedTo-label">Assigned To</InputLabel>
            <Select
              labelId="assignedTo-label"
              id="assignedTo"
              value={formData.expertsId || formData.affiliatePartnersId}
              onChange={handleUserChange}
              label="Assigned To"
            >
              {userOptions.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="assignedToName"
            label="Assigned To Name"
            value={formData.expertsName || formData.affiliatePartnersName}
            variant="outlined"
            fullWidth
            disabled
          />
          <div className="flex col-span-2 justify-center">
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TelegramPopup;
