import React, { useEffect, useState } from "react";
import { closeIcon } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api";

const AddBankDialog = ({ onClose, saveBankDetails, isOpen, fetchData }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [getBankID, setGetBankID] = useState("");
  const [accountError, setAccountError] = useState(false);


  const stackholderId = sessionStorage.getItem("stackholderId"); 

  const handleAddBank = () => {
    toast.success("Successfully Added!", {
      position: "top-right",
    });
  };

  const handleSubmit = async (e) => {
    setError("");
    setLoading(true);

    if (accountNumber !== confirmAccountNumber) {
      toast.error("Account numbers do not match.", {
        position: "top-right",
      });
      return;
    }
    saveBankDetails({
      accountNumber,
      ifscCode,
      bankName,
      accountHolderName,
    });

    const postData = {
      paymentMode: "Bank",
      affiliatePartnerId: "",
      expertsId: stackholderId,
      accountHolderName: accountHolderName,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      bankName: bankName,
      upI_ID: "",
    };

    try {
      const response = await api.post(
        "/Withdrawal/PostBankUPIDetails",
        postData
      );

      if (response.status !== 200) {
        toast.error("Something Wrong happened!", {
          position: "top-right",
        });
      }
      setGetBankID(response.data.data.id);
      fetchData();
      handleAddBank();
      onClose();
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

  const BANK_API = `https://copartners.in:5135/api/Withdrawal/GetBankUPIById/${getBankID}`;

  // useEffect(() => {
  //   getBankID &&
  //     axios.get(BANK_API).then((res) => {
  //       setBankName(res.data.data);
  //     });
  // }, [getBankID]);

  return (
    isOpen && (
      <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center">
        <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center bg-black bg-opacity-[40%]">
          <div className="bg-[#2E374B] rounded-lg md:w-[1084px] md:h-[90%] xl:h-[70%] w-[378px] h-[600px] overflow-auto p-8">
            <div className="flex items-center justify-between">
              <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] md:text-[24px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
                Add Bank Details
              </h2>
              <button onClick={onClose} className="md:mr-0 mr-[-1.4rem]">
                <img
                  src={closeIcon}
                  alt="Close_Icon"
                  className="md:w-[45px] w-[40px] md:h-[45px] h-[40px]"
                />
              </button>
            </div>
            <div className="flex md:flex-row flex-col justify-between md:ml-0 ml-[-1rem] md:mt-8 mt-4 md:gap-0 gap-4">
              <div className="relative">
                <div className="mb-0">
                  <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] md:w-[132px] w-[120px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center">
                    Account Number
                  </label>
                  <input
                    type="number"
                    id="account-number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter Account Number Here"
                    className="md:w-[480px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="mb-0">
                  <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] w-[189px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center">
                    Confirm Account Number
                  </label>
                  <input
                    type="number"
                    id="confirm-account-number"
                    value={confirmAccountNumber}
                    onChange={(e) => {
                      setConfirmAccountNumber(e.target.value);
                      if (accountNumber !== e.target.value) {
                        setAccountError(true);
                      } else {
                        setAccountError(false);
                      }
                    }}
                    placeholder="Enter again Account Number Here"
                    className={`md:w-[480px] w-[345px] py-2 px-4 rounded-md text-white border ${
                      accountError ? "border-red-500" : "border-[#40495C]"
                    } bg-[#282F3E]`}
                  />
                </div>
                {accountError && (
                  <p className="text-red-500 text-sm mt-2">
                    Account numbers do not match.
                  </p>
                )}
              </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between md:ml-0 ml-[-1rem] md:gap-0 gap-4 md:mt-8 mt-4">
              <div className="relative">
                <div className="mb-0">
                  <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] w-[91px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifsc-code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="Enter IFSC Code Here"
                    className="md:w-[480px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="mb-0">
                  <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] w-[91px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[15px] text-center">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bank-name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter Bank Name"
                    className="md:w-[480px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
            </div>
            <div className="flex md:flex-row md:ml-0 ml-[-1rem] flex-col md:gap-8">
              <div className="relative md:mt-8 mt-4">
                <div className="mb-0">
                  <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] w-[166px] h-[26px] rounded-[8px] font-[400] text-[14px] leading-[16px] text-center">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="account-holder-name"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Enter Name"
                    className="md:w-[480px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                </div>
              </div>
              <div className="flex items-center md:mt-[3rem] mt-3">
                <input
                  id="link-checkbox"
                  type="checkbox"
                  value={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-4 md:mb-9 mb-[60px] h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
            </div>
            <div className="flex justify-center items-center mt-8">
              <button
                onClick={handleSubmit}
                className={`rounded-[10px] md:text-[18px] text-[14px] w-[147px] h-[40px] ${
                  !isChecked ||
                  !accountNumber ||
                  !confirmAccountNumber ||
                  !ifscCode ||
                  !bankName ||
                  !accountHolderName
                    ? "bg-gray-300 cursor-not-allowed" // Change background color and cursor
                    : "bg-white" // Default background color
                }`}
                disabled={loading ||
                  !isChecked ||
                  !accountNumber ||
                  !confirmAccountNumber ||
                  !ifscCode ||
                  !bankName ||
                  !accountHolderName
                }
              >
                Add
              </button>
            </div>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    )
  );
};

export default AddBankDialog;
