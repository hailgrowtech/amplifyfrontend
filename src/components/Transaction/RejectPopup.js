import { TextField } from "@mui/material";
import React, { useState } from "react";
import close from "../../assets/close.png";

const RejectPopup = ({ onClose, memberId, onConfirm }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onConfirm(message);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] p-4 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            Reject Reason
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={close} alt="" />
          </button>
        </div>
        <div className="font-semibold text-2xl px-12 py-4 flex flex-col gap-12 text-left">
          <div className="relative flex flex-col w-1/2">
            <TextField
              id="message"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              fullWidth
              rows={6}
              required
            />
          </div>
        </div>
        <button
          className="px-12 bg-blue-500 text-white py-2 border-2 rounded-lg mb-8"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RejectPopup;
