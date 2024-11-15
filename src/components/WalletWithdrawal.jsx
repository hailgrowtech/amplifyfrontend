import React, { useState, useEffect } from "react";
import axios from "axios";
import { closeIcon, tick } from "../assets";
import AddBankDialog from "./AddBankDialog";
import AddUpiDialog from "./AddUpiDialog";
import api from "../api";

const WalletWithdrawal = ({ closeDialog, walletBalance }) => {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [isUpiOpen, setIsUpiOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(true); // Assuming KYC is verified for now
  const stackholderId = sessionStorage.getItem("stackholderId");

  const withdrawal_api = `https://copartners.in:5135/api/Withdrawal/BankUPIByUserId/${stackholderId}?userType=RA&page=1&pageSize=100000`;

  const fetchData = async () => {
    try {
      const res = await axios.get(withdrawal_api);
      setWithdrawalAmount(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [withdrawal_api]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value >= 100 && value <= 100000) {
      setInputError("");
    } else {
      setInputError(`Please enter an amount between 100 and 100000.`);
    }
  };

  const handleBankClick = (id) => {
    setSelectedBank(id === selectedBank ? null : id);
    setSelectedUpi(null);
  };

  const handleUpiClick = (id) => {
    setSelectedUpi(id === selectedUpi ? null : id);
    setSelectedBank(null);
  };

  const openAddBankDialog = () => {
    setIsAddBankOpen(true);
  };

  const closeAddBankDialog = () => {
    setIsAddBankOpen(false);
  };

  const saveBankDetails = (details) => {
    fetchData();
  };

  const saveUpiDetails = (details) => {
    fetchData()
  };

  const openAddUpiDialog = () => {
    setIsUpiOpen(true);
  };

  const closeAddUpiDialog = () => {
    setIsUpiOpen(false);
  };

  const handleWithdraw = async () => {
    if (!isKycVerified) {
      alert("Please complete KYC verification before withdrawing.");
      return;
    }

    const withdrawalModeId = selectedBank || selectedUpi;
    if (!withdrawalModeId) {
      setInputError("Please select a bank or UPI ID.");
      return;
    }

    if (inputValue <= 0 || inputValue > walletBalance.withdrawalBalance) {
      setInputError(`Please enter a valid amount between 0 and ${walletBalance.withdrawalBalance}.`);
      return;
    }

    try {
      const response = await api.post('/Withdrawal', {
        withdrawalBy: "RA",
        amount: inputValue,
        withdrawalModeId,
        withdrawalRequestDate: new Date().toISOString(),
        requestAction: "P",
      });

      if (response.data.isSuccess) {
        alert("Withdrawal request created successfully.");
        closeDialog();
        window.location.reload(); // Refresh the page
      } else {
        setInputError(`Failed to create withdrawal request: ${response.data.displayMessage}`);
      }
    } catch (error) {
      setInputError(`Error creating withdrawal request: ${error.message}`);
    }
  };

  const isButtonDisabled = !inputValue || inputValue <= 0 || (!selectedBank && !selectedUpi);

  return (
    <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center bg-black bg-opacity-[40%]">
      <div className="bg-[#2E374B] rounded-lg md:w-[1084px] xl:h-[550px] md:h-full w-[378px] h-[600px] overflow-auto p-8">
        <div className="flex items-center justify-between">
          <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
            Withdrawal
          </h2>
          <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
            <img src={closeIcon} alt="Close Icon" className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]" />
          </button>
        </div>

        <div className="flex flex-row items-center justify-between mt-4">
          <span className="md:w-[184px] md:h-[23px] text-white md:text-[20px] text-[16px] font-inter font-[500] leading-[16px] md:ml-0 ml-[-0.8rem]">
            Select Your Bank
          </span>
          <button
            onClick={openAddBankDialog}
            className="md:w-[100px] w-[90px] border-solid border-[1px] border-white md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[10px] md:mr-0 mr-[-0.8rem]"
          >
            +Add Bank
          </button>
          {isAddBankOpen && (
            <AddBankDialog
              fetchData={fetchData}
              isOpen={isAddBankOpen}
              onClose={closeAddBankDialog}
              saveBankDetails={saveBankDetails}
            />
          )}
        </div>

        <div className="flex md:flex-row flex-col md:gap-8 gap-2 items-center mt-4">
          {withdrawalAmount.map((withdrawal, index) => (
            withdrawal.paymentMode === "Bank" && (
              <button
                key={index}
                onClick={() => handleBankClick(withdrawal.id)}
                className={`relative md:w-[310px] w-[200px] md:h-[70px] h-[70px] text-white rounded-[16px] border-solid border-[1px] border-[#40495C] ${
                  selectedBank === withdrawal.id ? "bg-[#282F3E]" : "bg-transparent"
                }`}
              >
                {selectedBank === withdrawal.id && (
                  <img src={tick} alt="Selected" className="absolute top-2 right-2 w-[20px] h-[20px]" />
                )}
                <div className="flex md:ml-8 justify-center md:flex-col">
                  <div className="flex flex-col md:items-start items-center">
                    <span className="text-[16px] font-[600]">{withdrawal.bankName}</span>
                    <span className="text-[14px]">{withdrawal.accountNumber}</span>
                  </div>
                </div>
              </button>
            )
          ))}
        </div>

        <div className="flex flex-row items-center mt-4 justify-between">
          <span className="md:w-[184px] md:h-[23px] text-white md:text-[20px] text-[16px] font-inter font-[500] leading-[16px] md:ml-0 ml-[-0.8rem]">
            Select Your UPI ID
          </span>
          <button
            onClick={openAddUpiDialog}
            className="md:w-[100px] w-[90px] border-solid border-[1px] border-white md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[10px] md:mr-0 mr-[-0.8rem]"
          >
            +Add UPI ID
          </button>
          {isUpiOpen && (
            <AddUpiDialog onClose={closeAddUpiDialog} isOpen={isUpiOpen} saveUpiDetails={saveUpiDetails} fetchData={fetchData} />
          )}
        </div>

        <div className="flex md:flex-row flex-col md:gap-8 gap-2 items-center mt-6">
          {withdrawalAmount.map((withdrawal, index) => (
            withdrawal.paymentMode === "UPI" && (
              <button
                key={index}
                onClick={() => handleUpiClick(withdrawal.id)}
                className={`relative md:w-[310px] w-[220px] h-[50px] text-white rounded-[16px] border-solid border-[1px] border-[#40495C] ${
                  selectedUpi === withdrawal.id ? "bg-[#282F3E]" : "bg-transparent"
                }`}
              >
                {selectedUpi === withdrawal.id && (
                  <img src={tick} alt="Selected" className="absolute top-2 right-2 w-[20px] h-[20px]" />
                )}
                <div className="flex justify-center items-start md:ml-4 md:flex-col">
                  <span className="text-[16px] font-[600]">{withdrawal.upI_ID}</span>
                </div>
              </button>
            )
          ))}
        </div>

        <div className="md:h-[50px] flex md:flex-row flex-col md:gap-2 gap-0 md:justify-center md:items-center mt-4">
          <span className="font-[500] text-[18px] leading-[27px] text-white">
            Amount:
          </span>
          <input
            type="number"
            id="wallet_withdrawal"
            value={inputValue}
            onChange={handleInputChange}
            className="md:w-[287px] w-[344px] h-[50px] border border-[#40495C] bg-[#282F3E] rounded-[16px] text-white px-2 md:ml-0 ml-[-0.8rem]"
            placeholder={`Your Withdrawal Balance: ${walletBalance?.withdrawalBalance}`}
          />
        </div>

        {inputError && (
          <div className="text-red-500 text-center mt-2">{inputError}</div>
        )}

        <div className="flex justify-center items-center mt-6">
          <button
            onClick={handleWithdraw}
            className={`rounded-[10px] w-[147px] h-[40px] md:text-[18px] text-[14px] ${
              isButtonDisabled ? "bg-[#D2D2D2] text-black" : "bg-white"
            }`}
            disabled={isButtonDisabled || loading}
          >
            Withdraw
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default WalletWithdrawal;

