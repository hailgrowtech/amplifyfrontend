import React, { useState } from 'react';
import { closeIcon } from "../assets";
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../api';

const UpiEditDialog = ({ isOpen, onClose, selectedWithdrawal, fetchData }) => {
  console.log(selectedWithdrawal)
  const [upiID, setUpiID] = useState(selectedWithdrawal.upI_ID);
  const [deleteUpiInfo, setDeleteUpiInfo] = useState(selectedWithdrawal.id);

  const handleDelete = () => {
    toast.success("Successfully Deleted!", {
      position: "top-right",
    });
  };

  const deleteUpiDetails = async () => {
    try {
      const response = await api.delete(`/Withdrawal/${deleteUpiInfo}`);
      if (response.status === 200) {
        console.log("UPI details deleted successfully");
        fetchData();
        handleDelete();
        onClose();
      } else {
        console.error("Failed to delete UPI details");
      }
    } catch (error) {
      console.error("Error deleting UPI details:", error);
    }
  };

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center ${isOpen ? 'visible' : 'invisible'}`}>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] xl:h-[40%] md:h-[50%] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[24px] md:leading-[51px] text-new">
              Edit UPI ID Details
            </h2>
            <button onClick={onClose}>
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[50px] md:h-[35px] h-[50px]"
              />
            </button>
          </div>
          <div className="relative md:mt-8 mt-4">
            <div className="mb-0">
              <label
                className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                md:w-[76px] w-[70px] h-[25px] md:h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center"
              >
                UPI ID
              </label>
              <input
                value={upiID}
                type="text" // Use 'text' instead of 'link'
                id="default-input"
                placeholder="arunkumar@phonepay"
                className="w-full py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                onChange={(e) => setUpiID(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center gap-4 items-center mt-6">
            <button onClick={deleteUpiDetails} className="bg-red-500 text-white text-[14px] rounded-[10px] w-[147px] h-[40px]">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpiEditDialog;
