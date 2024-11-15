import React, { useState, useEffect } from "react";
import { closeIcon } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api";

const AddUpiDialog = ({ isOpen, onClose, saveUpiDetails, fetchData }) => {
  const [myUpiId, setMyUpiId] = useState("");
  const [getUPIID, setGetUPIID] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const stackholderId = sessionStorage.getItem("stackholderId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCheckboxChecked) {
      setError("Please acknowledge the checkbox.");
      return;
    }

    setError("");
    setLoading(true);

    saveUpiDetails({
      myUpiId,
    });

    const postData = {
      paymentMode: "UPI",
      affiliatePartnerId: "",
      expertsId: stackholderId,
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      upI_ID: myUpiId,
    };

    try {
      const response = await api.post(
        "/Withdrawal/PostBankUPIDetails",
        postData
      );

      if (response.status !== 200) {
        toast.error("Something wrong happened!", {
          position: "top-right",
        });
      } else {
        fetchData();
        setGetUPIID(response.data.data.id);
        onClose();
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Failed to submit data. Please try again.", {
        position: "top-right",
      });
      setError("Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const UPI_API = `https://copartners.in:5135/api/Withdrawal/GetBankUPIById/${getUPIID}`;

  // useEffect(() => {
  //   if (getUPIID) {
  //     axios.get(UPI_API).then((res) => {
  //       setMyUpiId(res.data.data);
  //     });
  //   }
  // }, [getUPIID]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center">
      <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] xl:h-[50%] md:h-[65%] w-[378px] h-[340px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Add UPI ID Details
            </h2>
            <button onClick={onClose} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[45px] md:h-[45px] w-[40px] h-[40px]"
              />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative md:mt-8 mt-4">
              <div className="mb-0">
                <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] md:w-[76px] w-[56px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center md:ml-0 ml-[-1rem]">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upi-id-input"
                  value={myUpiId}
                  onChange={(e) => setMyUpiId(e.target.value)}
                  placeholder=""
                  className="md:w-full w-[344px] py-2 px-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] md:ml-0 ml-[-1rem]"
                  required
                />
              </div>
            </div>

            <div className="flex md:mt-[2rem] mt-[1rem] md:ml-0 ml-[-1rem]">
              <input
                id="link-checkbox"
                type="checkbox"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                className="w-4 mt-1 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                required
              />
              <label
                htmlFor="link-checkbox"
                className="ms-2 text-[14px] font-medium text-white"
              >
                By checking this box, I acknowledge that the bank/payment
                details provided are accurate and authorize Hailgro Tech
                Solutions Pvt. Ltd. to process transactions accordingly.
              </label>
            </div>

            {error && (
              <div className="text-red-500 mt-2 md:ml-0 ml-[-1rem]">
                {error}
              </div>
            )}

            <div className="flex justify-center items-center mt-6">
              <button
                className={`rounded-[10px] md:text-[18px] text-[14px] w-[147px] h-[40px] ${
                  !isCheckboxChecked ||
                  !myUpiId 
                    ? "bg-gray-300 cursor-not-allowed" // Change background color and cursor
                    : "bg-white" // Default background color
                }`}
                disabled={
                  loading ||
                  !isCheckboxChecked ||
                  !myUpiId 
                }
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default AddUpiDialog;
