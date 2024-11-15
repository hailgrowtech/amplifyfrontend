import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RejectPopup from "./RejectPopup";
import AcceptPopup from "./AcceptPopup";
import { MenuItem, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const TransactionAP = () => {
  const [acceptPopupOpenForTransaction, setAcceptPopupOpenForTransaction] =
    useState(null);
  const [rejectPopupOpenForTransaction, setRejectPopupOpenForTransaction] =
    useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "https://copartners.in:5135/api/Withdrawal?RequestBy=AP&page=1&pageSize=1000000"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Sort by most recent date first, then by requestAction if needed
      const sortedTransactions = data.data.sort((a, b) => {
        const dateComparison = new Date(b.withdrawalRequestDate) - new Date(a.withdrawalRequestDate);
        if (dateComparison !== 0) return dateComparison;
        if (a.requestAction && !b.requestAction) return 1;
        if (!a.requestAction && b.requestAction) return -1;
        return 0;
      });

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Fetching error:", error);
      toast.error(`Failed to fetch transactions: ${error.message}`);
    }
  };

  const handleAccept = (member) => {
    setAcceptPopupOpenForTransaction(member);
  };

  const handleConfirmAccept = async (memberId, transactionId) => {
    const transaction = transactions.find((t) => t.id === memberId);
    const requestBody = {
      withdrawalBy: transaction.withdrawalBy,
      amount: transaction.amount,
      withdrawalModeId: transaction.withdrawalModeId,
      withdrawalRequestDate: transaction.withdrawalRequestDate,
      requestAction: "A",
      transactionId: transactionId,
      transactionDate: new Date().toISOString(),
      rejectReason: "",
    };

    try {
      const response = await fetch(
        `https://copartners.in:5135/api/Withdrawal/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Transaction accepted successfully!");
      fetchTransactions(); // Refresh transactions after accept
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error(`Failed to accept transaction: ${error.message}`);
    }

    setAcceptPopupOpenForTransaction(null);
  };

  const handleReject = (member) => {
    setRejectPopupOpenForTransaction(member);
  };

  const handleConfirmReject = async (memberId, rejectReason) => {
    const transaction = transactions.find((t) => t.id === memberId);
    const requestBody = {
      withdrawalBy: transaction.withdrawalBy,
      amount: transaction.amount,
      withdrawalModeId: transaction.withdrawalModeId,
      withdrawalRequestDate: transaction.withdrawalRequestDate,
      requestAction: "R",
      transactionId: "",
      transactionDate: "",
      rejectReason: rejectReason,
    };

    try {
      const response = await fetch(
        `https://copartners.in:5135/api/Withdrawal/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.info("Transaction rejected successfully!");
      fetchTransactions(); // Refresh transactions after reject
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error(`Failed to reject transaction: ${error.message}`);
    }

    setRejectPopupOpenForTransaction(null);
  };

  return (
    <div className="dashboard-view-section mb-4">
      <div className="table-list-mb">
        <div className="channel-heading">
          <h3 className="text-xl font-semibold">Listing</h3>
        </div>
        <div className="py-4 px-8">
          <table className="table-list">
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingLeft: "2rem" }}>Date</th>
                <th style={{ textAlign: "left" }}>A.P Name</th>
                <th style={{ textAlign: "left" }}>Legal Name</th>
                <th>Amount</th>
                <th>Request</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((member, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                    {new Date(
                      member.withdrawalRequestDate
                    ).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "left" }} className="text-blue-600">
                    <Link to={`${member.id}`}>{member.name}</Link>
                  </td>
                  <td style={{ textAlign: "left" }}>{member.legalName}</td>
                  <td>{member.amount}</td>
                  <td>
                    <TextField
                      select
                      label={"Select"}
                      name={`request-${member.id}`}
                      id={`request-${member.id}`}
                      variant="outlined"
                      fullWidth
                      value={
                        member.requestAction === "A"
                          ? "accept"
                          : member.requestAction === "R"
                          ? "reject"
                          : member.request
                      }
                      disabled={
                        member.requestAction === "A" ||
                        member.requestAction === "R"
                      }
                      onChange={(e) => {
                        const updatedTransactions = transactions.map((t) =>
                          t.id === member.id
                            ? { ...t, request: e.target.value }
                            : t
                        );
                        setTransactions(updatedTransactions);
                      }}
                    >
                      <MenuItem
                        onClick={() => handleAccept(member)}
                        value="accept"
                      >
                        Accept
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleReject(member)}
                        value="reject"
                      >
                        Reject
                      </MenuItem>
                    </TextField>
                    {acceptPopupOpenForTransaction &&
                      acceptPopupOpenForTransaction.id === member.id && (
                        <AcceptPopup
                          memberId={member.id}
                          onConfirm={(transactionId) =>
                            handleConfirmAccept(member.id, transactionId)
                          }
                          onClose={() => setAcceptPopupOpenForTransaction(null)}
                        />
                      )}
                    {rejectPopupOpenForTransaction &&
                      rejectPopupOpenForTransaction.id === member.id && (
                        <RejectPopup
                          memberId={member.id}
                          onConfirm={(rejectReason) =>
                            handleConfirmReject(member.id, rejectReason)
                          }
                          onClose={() => setRejectPopupOpenForTransaction(null)}
                        />
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TransactionAP;
