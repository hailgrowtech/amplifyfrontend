import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../Header/Header";
import { toast } from "react-toastify";

const TransactionID = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();
  const { transactionId } = useParams();

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`https://copartners.in:5135/api/Withdrawal/${transactionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransaction(data.data);
    } catch (error) {
      console.error('Fetching error:', error);
      toast.error(`Failed to fetch transaction: ${error.message}`);
    }
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Transaction ID"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      <div className="back-button flex items-center text-2xl font-bold p-6">
        <button
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft />
          <span className="ml-1">Back</span>
        </button>
      </div>

      {transaction ? (
        <div className="requestContainer mx-5 bg-[#fff]">
          <div className="requestHeading flex justify-between items-center text-2xl font-bold p-4">
            <h2 className="pl-3 text-xl font-semibold">{transaction.name}</h2>
          </div>

          {transaction.bankName && (
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr className="requestColumns">
                    <th className="text-left">Account Number</th>
                    <th className="text-left">IFSC Code</th>
                    <th>Bank Name</th>
                    <th>Account Holder Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="request-numbers font-semibold">
                    <td className="p-3">{transaction.accountNumber}</td>
                    <td className="p-3">{transaction.ifscCode}</td>
                    <td className="p-3 text-center">{transaction.bankName}</td>
                    <td className="p-3 text-center">{transaction.accountHolderName}</td>
                    <td className="p-3 text-center">{transaction.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {transaction.upI_ID && (
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr className="requestColumns">
                    <th style={{ textAlign: "left", paddingLeft: "5rem" }}>UPI Id</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="request-numbers font-semibold">
                    <td style={{ textAlign: "left", paddingLeft: "5rem" }} className="p-3">{transaction.upI_ID}</td>
                    <td className="p-3 text-center">{transaction.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-28 text-3xl font-bold p-6">
          Transaction not found!
        </div>
      )}
    </div>
  );
};

export default TransactionID;
