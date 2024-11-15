import React, { useState, useEffect } from "react";
import { Link, invoiceImg, searchIcon } from "../assets";
import WalletWithdrawal from "./WalletWithdrawal";
import EarningAnalysis from "./EarningAnalysis";
import RejectUpiOpen from "./RejectUpiOpen";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const Wallet = ({stackholderId}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState("transaction");
  const [isEditUpiOpen, setIsEditUpiOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactionTable, setTransactionTable] = useState([]);
  const [withdrawalReq, setWithdrawalReq] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [signatureImage, setSignatureImage] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [copiedRow, setCopiedRow] = useState(null);
  const pageSize = 15;

  const WALLET_BALANCE_URL = `https://copartners.in:5135/api/Wallet/GetWalletWithdrawalBalance/${stackholderId}?userType=RA`;

  const TRANSACTION_API = `https://copartners.in:5132/api/RADashboard/GetDashboardRAListingData/${stackholderId}?page=1&pageSize=100000`;

  const WITHDRAWAL_REQ_API = `https://copartners.in:5135/api/Withdrawal/GetWithdrawalByUserId/${stackholderId}?userType=RA&page=1&pageSize=100000`;

  const SIGNATURE_API = `https://copartners.in:5132/api/Experts/${stackholderId}`;

  const fetchBankDetails = async (withdrawalModeId) => {
    const BANK_API = `https://copartners.in:5135/api/Withdrawal/GetBankUPIById/${withdrawalModeId}`;
    try {
      const response = await axios.get(BANK_API);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching bank details:", error);
      return null;
    }
  };

  const fetchWithdrawalRequests = async () => {
    try {
      const response = await axios.get(WITHDRAWAL_REQ_API);
      const withdrawalRequests = response.data.data;

      const requestsWithBankDetails = await Promise.all(
        withdrawalRequests.map(async (request) => {
          // const bankDetails = await fetchBankDetails(request.withdrawalModeId);
          return {
            ...request,
            // bankDetails,
          };
        })
      );

      setWithdrawalReq(requestsWithBankDetails);
    } catch (error) {
      console.error("Error fetching the withdrawal requests:", error);
      setWithdrawalReq([]);
    }
  };

  const fetchSignatureImage = async () => {
    try {
      const response = await axios.get(SIGNATURE_API);
      setSignatureImage(response.data.data.signatureImage);
      setJurisdiction(response.data.data.state);
    } catch (error) {
      console.error("Error fetching the signature image:", error);
    }
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(WALLET_BALANCE_URL);
        setWalletBalance(response.data.data);
      } catch (error) {
        console.error("Error fetching the wallet balance:", error);
        setWalletBalance("Error");
      }
    };

    fetchWalletBalance();
    fetchWithdrawalRequests();
    fetchSignatureImage();
  }, []);

  useEffect(() => {
    const fetchTransactionTable = async () => {
      try {
        const response = await axios.get(TRANSACTION_API);
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.subscribeDate) - new Date(a.subscribeDate)
        );
        const filteredData = sortedData.filter(row => row.subscription !== "No Subscrption");
        setTransactionTable(filteredData);
        setFilteredTransactions(filteredData);
      } catch (error) {
        console.error("Error fetching the transaction table:", error);
        setFilteredTransactions([]);
      }
    };

    fetchTransactionTable();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const openEditUpiDialog = (row) => {
    setSelectedRow(row);
    setIsEditUpiOpen(true);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditUpiOpen(false);
    setSelectedRow(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatusText = (action) => {
    switch (action) {
      case "A":
        return "Success";
      case "P":
        return "Pending";
      case "R":
        return "Rejected";
      default:
        return action;
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    
    // If there's an end date, set the time to the end of the day (23:59:59) for accurate filtering.
    if (end) {
      const adjustedEndDate = new Date(end);
      adjustedEndDate.setHours(23, 59, 59, 999);
      setEndDate(adjustedEndDate);
    } else {
      setEndDate(null);
    }
  };
  
  useEffect(() => {
    const filterTransactions = () => {
      let filtered = transactionTable;
  
      if (searchInput) {
        filtered = filtered.filter((row) =>
          row.user.mobileNumber.includes(searchInput)
        );
      }
  
      if (startDate && endDate) {
        filtered = filtered.filter((row) => {
          const subscribeDate = new Date(row.subscribeDate);
          return subscribeDate >= startDate && subscribeDate <= endDate;
        });
      }
  
      setFilteredTransactions(filtered);
      setCurrentPage(1); // Reset to first page when filtering
    };
  
    filterTransactions();
  }, [searchInput, startDate, endDate, transactionTable]);
  

  useEffect(() => {
    const filterTransactions = () => {
      let filtered = transactionTable;

      if (searchInput) {
        filtered = filtered.filter((row) =>
          row.user.mobileNumber.includes(searchInput)
        );
      }

      if (startDate && endDate) {
        filtered = filtered.filter((row) => {
          const subscribeDate = new Date(row.subscribeDate);
          return subscribeDate >= startDate && subscribeDate <= endDate;
        });
      }

      setFilteredTransactions(filtered);
      setCurrentPage(1); // Reset to first page when filtering
    };

    filterTransactions();
  }, [searchInput, startDate, endDate, transactionTable]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const currentPageData = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getExpertType = (typeId) => {
    switch (typeId) {
      case "1":
        return "Commodity";
      case "2":
        return "Equity";
      case "3":
        return "Options";
      default:
        return "";
    }
  };

  const handleTeleGramClicked = (telegramChannel, rowIndex) => {
    navigator.clipboard
      .writeText(telegramChannel)
      .then(() => {
        toast.success("Successfully Copied!", {
          position: "top-right",
        });
        setCopiedRow(rowIndex);
        setTimeout(() => setCopiedRow(null), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy the text to clipboard: ", err);
      });
  };

  const handleDownloadSheet = () => {
    const header = [
      "Invoice ID",
      "Transaction ID",
      "User Mobile No",
      "User Name",
      "User Email",
      "User Pan Card",
      "User State",
      "User Address",
      "Subscription Date",
      "Subscription",
      "Plan Type",
      "CGST%",
      "CGST Amt",
      "SGST%",
      "SGST Amt",
      "IGST%",
      "IGST Amt",
      "Total Tax",
      "Price",
      "Amount",
      "Discounted Percentage",
      "Paid Amount",
      "Premium Telegram",
    ];
  
    const rows = filteredTransactions.map((row) => {
      const paidAmount = row.totalAmount;
      const price = (100 / 118) * paidAmount;
      const igstAmount = price * 0.18;
      const cgstSgstAmount = price * 0.09;
  
      const isSameState = row.user.state && row.state && row.user.state.trim() === row.state.trim();
  
      const cgst = isSameState ? 9 : 0;
      const sgst = isSameState ? 9 : 0;
      const igst = isSameState ? 0 : 18;
      const cgstAmount = isSameState ? cgstSgstAmount : 0;
      const sgstAmount = isSameState ? cgstSgstAmount : 0;
      const totalTax = (cgstAmount + sgstAmount + igstAmount).toFixed(2);
  
      return [
        row.invoiceId,
        row.transactionId,
        row.user.mobileNumber,
        row.user.name,
        row.user.email,
        row.user.pan,
        row.user.state,
        row.user.address,
        formatDate(row.subscribeDate),
        getExpertType(row.subscription),
        row.planType,
        `${cgst}%`,
        `${cgstAmount.toFixed(2)}`,
        `${sgst}%`,
        `${sgstAmount.toFixed(2)}`,
        `${igst}%`,
        `${igstAmount.toFixed(2)}`,
        `${totalTax}`,
        price.toFixed(2),
        row.subscriptionAmount,
        `${row.discountPercentage}%`,
        paidAmount.toFixed(2),
        row.premiumTelegramChannel,
      ];
    });
  
    const data = [header, ...rows];
  
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  
    const binaryString = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
  
    const blob = new Blob([s2ab(binaryString)], {
      type: "application/octet-stream",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
  
    const firstInvoiceId =
      filteredTransactions.length > 0
        ? filteredTransactions[0].invoiceId
        : "transactions";
    a.download = `${firstInvoiceId}.xlsx`;
  
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  

  const handleInvoiceClick = (row) => {
    const {
      subscriptionAmount,
      raName,
      gst,
      transactionId,
      invoiceId,
      subscribeDate,
      totalAmount,
      discountPercentage,
      user,
    } = row;

    const invoiceDate = new Date(subscribeDate).toLocaleDateString();

    const paidAmount = totalAmount;
    const price = (paidAmount * 100) / 118;
    const igstAmount = price * 0.18;
    const cgstSgstAmount = price * 0.09;

    const sanitizedImagePath = signatureImage
      ? signatureImage.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      : "";
    const jurisdictionAction = jurisdiction;

    const isSameState = user.state === row.state;

    const htmlContent = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .receipt-container { width: 100%; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .receipt-header { text-align: center; margin-bottom: 20px; }
          .receipt-header h1 { margin: 0; }
          .receipt-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .receipt-details div { width: 48%; }
          .receipt-details p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          table th, table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          .terms { margin-top: 20px; }
          .user-image { text-align: center; margin-bottom: 10px; }
          .user-image img { width: 300px; height: 200px; border-radius: 50%; }
          .print-button { display: block; width: 100%; text-align: center; margin-top: 20px; }
          .print-button button { padding: 10px 20px; background-color: #4CAF50; color: #fff; border: none; border-radius: 5px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <h1>Tax Invoice/Bill of Service</h1>
            <p>Invoice No: ${invoiceId}</p>
            <p>Original for Recipient</p>
          </div>
          <div class="receipt-details">
            <div>
              <h2>Service offered by</h2>
              <p><strong>Creator Name:</strong> ${raName}</p>
              <p><strong>Creator ID:</strong> ${stackholderId}</p>
              <p><strong>PAN No:</strong> ${row.pan || "N/A"}</p>
              ${gst ? `<p><strong>Creator GSTIN:</strong> ${gst}</p>` : ""}
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              <p><strong>Bill Date:</strong> ${invoiceDate}</p>
              <p><strong>State Code:</strong> ${gst ? gst.slice(0, 2) : "N/A"}</p>
            </div>
            <div>
              <h2>Billed To</h2>
              <p>${user.name}</p>
              <p>${user.mobileNumber}</p>
              <p>${user.email}</p>
              <p><strong>Billing Address:</strong> ${user.address || "N/A"}</p>
              <p><strong>State:</strong> ${user.state || "N/A"}</p>
              <p><strong>Place Of Supply:</strong> ${user.state || "N/A"}</p>
              <p><strong>HSN Code:</strong> 999299</p>
              <p><strong>RCM Applicable:</strong> No</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Price</th>
                ${isSameState ? `
                  <th>CGST%</th>
                  <th>CGST Amt</th>
                  <th>SGST%</th>
                  <th>SGST Amt</th>
                  <th>Total Tax</th>
                ` : `
                  <th>IGST%</th>
                  <th>IGST Amt</th>
                  <th>Total Tax</th>
                `}
                <th>Amount</th>
                <th>Discount Percentage</th>
                <th>Paid Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${row.planType} Subscription</td>
                <td>₹ ${price.toFixed(2)}</td>
                ${isSameState ? `
                  <td>9%</td>
                  <td>₹ ${cgstSgstAmount.toFixed(2)}</td>
                  <td>9%</td>
                  <td>₹ ${cgstSgstAmount.toFixed(2)}</td>
                  <td>₹ ${(cgstSgstAmount * 2).toFixed(2)}</td>
                ` : `
                  <td>18%</td>
                  <td>₹ ${igstAmount.toFixed(2)}</td>
                  <td>₹ ${igstAmount.toFixed(2)}</td>
                `}
                <td>₹ ${subscriptionAmount.toFixed(2)}</td>
                <td>${discountPercentage} %</td>
                <td>₹ ${paidAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="user-image">
            <img src="${sanitizedImagePath}" alt="User Image" />
          </div>
          <div class="terms">
            <h2>TERMS & CONDITIONS</h2>
            <p>No refund policy. Please read terms & conditions and disclaimer on our website.</p>
            <p>All jurisdiction under ${jurisdictionAction}.</p>
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p>Contact support@copartner.in for technical support.</p>
          </div>
          <div class="print-button">
            <button onclick="window.print()">Download Invoice</button>
          </div>
        </div>
      </body>
    </html>
  `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const handleMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
    setCopiedRow(null);
  };

  return (
    <div className="pb-[5rem] xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex md:flex-row flex-col justify-between">
        <span className="md:w-[176px] w-[58px] md:h-[27px] h-[28px] font-inter md:text-[22px] text-[20px] font-[600] leading-[27px] text-[#ffffff]">
          Wallet
        </span>
        <div className="flex flex-row justify-between items-center md:mr-4 mr-0">
          <span className="md:w-[320px] w-[233px] md:h-[27px] h-[19px] text-white font-inter font-[600] md:text-[22px] text-[16px] md:leading-[27px] leading-[19px] md:mr-[3rem] mr-0">
            Withdrawal Balance :{" "}
            <span className="text-white opacity-[40%]">
              ₹{walletBalance?.withdrawalBalance}
            </span>
          </span>
          <button
            onClick={openDialog}
            className="md:w-[147px] w-[128px] md:h-[40px] h-[35px] rounded-[10px] border text-black bg-[#ffffff] font-[600] font-inter text-[12px]"
          >
            Withdrawal
          </button>
          {isDialogOpen && (
            <WalletWithdrawal
              isDialogOpen={isDialogOpen}
              closeDialog={closeDialog}
              walletBalance={walletBalance}
            />
          )}
        </div>
      </div>

      <EarningAnalysis stackholderId={stackholderId} startDate={startDate} endDate={endDate} />

      <div className="flex flex-col md:gap-6 gap-3">
        <div className="flex flex-row items-center justify-between md:ml-0 ml-[-8px]">
          <div className="xl:w-[1420px] md:w-[1030px] flex flex-col gap-8 mt-4">
            <div className="flex md:justify-between md:flex-row flex-col md:gap-0 gap-2">
              <span className="text-white md:w-[210px] h-[27px] font-inter font-[600] text-[22px] md:leading-[27px] md:items-center items-start">
                Transaction History
              </span>
              {showTransactions === "transaction" && (
                <div className="flex md:flex-row flex-col md:gap-0 gap-2 items-center md:mr-[-6rem] mr-0">
                  <div className="relative md:mr-4 mr-0">
                    <img
                      src={searchIcon}
                      alt=""
                      className="cursor-pointer absolute top-1/2 left-4 transform -translate-y-1/2 w-[19px] h-[19px]"
                    />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchChange}
                      placeholder="Search"
                      className="pl-10 md:pr-4 bg-[#2E323C] md:w-[252px] w-[350px] h-[55px] text-white rounded-[10px]"
                    />
                  </div>
                  <div className="ml-0">
                    <DatePicker
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      isClearable
                      placeholderText="Select Date range"
                      className="bg-[#2E323C] md:w-[252px] w-[350px] h-[55px] text-white rounded-[10px] px-4"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex md:flex-row flex-col md:justify-between md:gap-0 gap-4">
              <div className="flex flex-row md:gap-4 gap-2">
                <button
                  onClick={() => setShowTransactions("transaction")}
                  className={`w-[120px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                    showTransactions === "transaction"
                      ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                      : "bg-transparent text-white font-[600] font-inter text-[12px]"
                  }`}
                >
                  User Statement
                </button>
                <button
                  onClick={() => setShowTransactions("withdrawal")}
                  className={`w-[90px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                    showTransactions === "withdrawal"
                      ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                      : "bg-transparent text-white font-[600] font-inter text-[12px]"
                  }`}
                >
                  Transaction
                </button>
                <button
                  onClick={() => setShowTransactions("request")}
                  className={`w-[140px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                    showTransactions === "request"
                      ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                      : "bg-transparent text-white font-[600] font-inter text-[12px]"
                  }`}
                >
                  Withdrawal Request
                </button>
              </div>
              <button
                onClick={handleDownloadSheet}
                className={`w-[140px] h-[40px] rounded-[10px] md:mr-[-6rem] ml-[14rem] border-solid border-[1px] border-white text-black ${
                  showTransactions === "request"
                    ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                    : "bg-transparent text-white font-[600] font-inter text-[12px]"
                }`}
              >
                Download Sheet
              </button>
            </div>
          </div>
        </div>

        {showTransactions === "transaction" && (
          <>
            {smallScreen ? (
              <div className="flex flex-col pl-[5rem] flex-wrap justify-center items-center">
                {currentPageData &&
                  currentPageData
                    .filter((row) => row.planType.trim() !== "No Plan")
                    .map((row, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-around w-[358px] ml-[-6rem] h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4"
                      >
                        <div className="flex flex-row justify-between">
                          <p className="w-[173px] h-[26px] font-[600] text-[16px] leading-[25px] text-lightWhite">
                            {row.transactionId}
                          </p>
                        </div>
                        <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                          <span className="text-dimWhite">DATE:</span>{" "}
                          {new Date(row.subscribeDate).toLocaleString()}
                        </span>
                        <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                          <span className="text-dimWhite">PLAN NAME:</span>{" "}
                          {row.planType}
                        </span>
                        <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                          <span className="text-dimWhite">User Number:</span>{" "}
                          {row.userMobileNo}
                        </span>
                        <span
                          onMouseEnter={() => handleMouseEnter(index)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() =>
                            handleTeleGramClicked(
                              row.premiumTelegramChannel,
                              index
                            )
                          }
                          className="relative flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite cursor-pointer"
                        >
                          <span className="text-dimWhite">TELEGRAM:</span>{" "}
                          <img
                            src={Link}
                            alt="Link"
                            className="w-[18px] h-[18px]"
                          />
                          {hoveredRow === index && (
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2">
                              {copiedRow === index ? "Copied" : "Copy"}
                            </span>
                          )}
                        </span>
                        <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                          <span className="text-dimWhite">KYC:</span>{" "}
                          {row.user.isKYC ? "Y" : "N"}
                        </span>
                        <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                          <span className="text-dimWhite">AMOUNT:</span>{" "}
                          {row.amount}
                        </span>
                        <span
                          onClick={() => handleInvoiceClick(row)}
                          className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite cursor-pointer"
                        >
                          <span className="text-dimWhite">Invoice:</span>{" "}
                          <img
                            src={invoiceImg}
                            alt="INVOICE"
                            className="w-[18px] h-[18px]"
                          />
                        </span>
                      </div>
                    ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div>
                <table className="xl:w-[1520px] md:w-[1130px] md:h-auto p-8 h-[497px] bg-[#29303F] rounded-[30px]">
                  <thead className="text-dimWhite bg-[#1E1E22]">
                    <tr>
                      <th className="text-start px-4 py-2">Transaction ID</th>
                      <th className="text-center py-2">Date</th>
                      <th className="text-start px-4 py-2">Plan Name</th>
                      <th className="text-start px-4 py-2">User Number</th>
                      <th className="text-start px-4 py-2">Telegram</th>
                      <th className="text-center px-8 py-2">KYC</th>
                      <th className="text-center py-2">Amount</th>
                      <th className="text-start px-4 py-2">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="text-lightWhite">
                    {currentPageData &&
                      currentPageData
                        .filter((row) => row.planType.trim() !== "No Plan")
                        .map((row, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0
                                ? "bg-transparent"
                                : "bg-[#1E1E22]"
                            }
                          >
                            <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                              {row.transactionId}
                            </td>
                            <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                              {new Date(row.subscribeDate).toLocaleString()}
                            </td>
                            <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                              {row.planType}
                            </td>
                            <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                              {row.userMobileNo}
                            </td>
                            <td
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={handleMouseLeave}
                              onClick={() =>
                                handleTeleGramClicked(
                                  row.premiumTelegramChannel,
                                  index
                                )
                              }
                              className="relative text-center font-[500] leading-[18px] px-10 py-2 cursor-pointer"
                            >
                              <img
                                src={Link}
                                alt="Link"
                                className="w-[20px] h-[20px]"
                              />
                              {hoveredRow === index && (
                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2">
                                  {copiedRow === index ? "Copied" : "Copy"}
                                </span>
                              )}
                            </td>
                            <td className="text-center font-[500] text-[16px] leading-[18px] px-4 py-2">
                              {row.user.isKYC ? "Y" : "N"}
                            </td>
                            <td className="text-center font-[500] text-[16px] leading-[18px] py-2">
                              {row.amount}
                            </td>
                            <td
                              onClick={() => handleInvoiceClick(row)}
                              className="text-center font-[500] leading-[18px] px-4 py-2 cursor-pointer"
                            >
                              <img
                                src={invoiceImg}
                                alt="INVOICE"
                                className="w-[20px] h-[20px]"
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {showTransactions === "withdrawal" && (
          <>
            {smallScreen ? (
              <div className="flex flex-col pl-[5rem] flex-wrap justify-center items-center">
                {withdrawalReq.slice(0, 5).map((row, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-around w-[358px] ml-[-6rem] h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4"
                  >
                    <div className="flex flex-row justify-between">
                      <p className="w-[173px] h-[26px] font-[600] text-[16px] leading-[25px] text-lightWhite">
                        {row.transactionId}
                      </p>
                    </div>
                    <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                      <span className="text-dimWhite">DATE:</span>{" "}
                      {formatDate(row.withdrawalRequestDate)}
                    </span>
                    <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                      <span className="text-dimWhite">BANK:</span>{" "}
                      {row.bankDetails?.bankname || row.bankDetails?.upI_ID}
                    </span>
                    <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                      <span className="text-dimWhite">ACCOUNT NUMBER:</span>{" "}
                      {row.bankDetails?.accountNumber || row.bankDetails?.upI_ID}
                    </span>
                    <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                      <span className="text-dimWhite">AMOUNT:</span>{" "}
                      {row.amount}
                    </span>
                  </div>
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div>
                <table className="xl:w-[1520px] md:w-[1130px] md:h-auto h-[497px] px-[1rem] bg-[#29303F] rounded-[30px]">
                  <thead className="text-dimWhite">
                    <tr>
                      <th className="text-center px-4 py-2">Transaction ID</th>
                      <th className="text-start px-4 py-2">Date</th>
                      <th className="text-start px-4 py-2">Bank</th>
                      <th className="text-start px-4 py-2">Account Number</th>
                      <th className="text-start px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-lightWhite">
                    {withdrawalReq &&
                      withdrawalReq
                        .slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize
                        )
                        .map((row, index) => {
                          return (
                            row.requestAction === "A" && (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-[#1E1E22]" : ""
                                }
                              >
                                <td className="text-center font-[500] text-[16px] leading-[18px] px-4 py-2">
                                  {row.transactionId}
                                </td>
                                <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                                  {formatDate(row.withdrawalRequestDate)}
                                </td>
                                <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                                  {row.bankDetails?.bankname ||
                                    row.bankDetails?.upI_ID}
                                </td>
                                <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                                  {row.bankDetails?.accountNumber ||
                                    row.bankDetails?.upI_ID}
                                </td>
                                <td className="text-start font-[500] text-[16px] leading-[18px] px-4 py-2">
                                  {row.amount}
                                </td>
                              </tr>
                            )
                          );
                        })}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {showTransactions === "request" && (
          <>
            {smallScreen ? (
              <div className="flex flex-col pl-[5rem] flex-wrap justify-center items-center">
                {withdrawalReq
                  .filter((row) => String(row.requestAction).trim() !== "A")
                  .slice(0, 5)
                  .map((row, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-around w-[358px] ml-[-6rem] ml- h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4"
                    >
                      <div className="flex flex-row justify-between">
                        <p className="w-[173px] h-[26px] font-[600] text-[16px] leading-[25px] text-lightWhite">
                          {Math.floor(row.id.length * 1110000)}
                        </p>
                        <div
                          className="font-[600] text-[16px] leading-[25px] text-lightWhite pl-[4rem]"
                          style={{
                            color:
                              row.status === "Pending" ? "#FB923C" : "#E24966",
                          }}
                        >
                          {row.status === "Pending" ? (
                            <div>{row.requestAction}</div>
                          ) : (
                            <button
                              className="text-[14px]"
                              onClick={() => openEditUpiDialog(row)}
                            >
                              {getStatusText(row.requestAction)}
                            </button>
                          )}
                          {isEditUpiOpen && row.requestAction === "R" && (
                            <RejectUpiOpen
                              isOpen={isEditUpiOpen}
                              onClose={closeDialog}
                            />
                          )}
                        </div>
                      </div>
                      <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                        <span className="text-dimWhite">DATE:</span>{" "}
                        {formatDate(row.withdrawalRequestDate)}
                      </span>
                      <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                        <span className="text-dimWhite">BANK:</span>{" "}
                        {row.bankDetails?.bankname || row.bankDetails?.upI_ID}
                      </span>
                      <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                        <span className="text-dimWhite">ACCOUNT NUMBER:</span>{" "}
                        {row.bankDetails?.accountNumber ||
                          row.bankDetails?.upI_ID}
                      </span>
                      <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                        <span className="text-dimWhite">AMOUNT:</span>{" "}
                        {row.amount}
                      </span>
                    </div>
                  ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div>
                <table className="xl:w-[1520px] md:w-[1130px] md:h-auto h-[497px] px-[1rem] bg-[#29303F] rounded-[30px]">
                  <thead className="text-dimWhite w-[1084px] h-[51px]">
                    <tr>
                      <th className="text-start pl-[4rem]">Request ID</th>
                      <th className="text-start pl-[4rem]">Date</th>
                      <th className="text-start">Bank</th>
                      <th className="pl-[4rem] text-start">Account Number</th>
                      <th className="text-start pl-[4rem]">Amount</th>
                      <th className="text-start pl-[4rem]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-lightWhite w-[1084px] h-[81px]">
                    {withdrawalReq
                      .filter((row) => row.requestAction !== "A")
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((row, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-[#18181B]" : ""}
                        >
                          <td className="pl-[4rem] font-[500] text-[16px] leading-[18px]">
                            {Math.floor(row.id.length * 1110000)}
                          </td>
                          <td className="pl-[4rem] font-[500] text-[16px] leading-[18px]">
                            {formatDate(row.withdrawalRequestDate)}
                          </td>
                          <td className="w-[143px] h-[36px] font-[500] text-[16px] leading-[18px]">
                            {row.bankDetails?.bankname || row.bankDetails?.upI_ID}
                          </td>
                          <td className="px-[4rem] w-[143px] h-[36px] font-[500] text-[16px] leading-[18px]">
                            {row.bankDetails?.accountNumber ||
                              row.bankDetails?.upI_ID}
                          </td>
                          <td className="pl-[4rem] w-[105px] h-[18px] font-[500] text-[16px] leading-[18px]">
                            {row.amount}
                          </td>
                          <td
                            className={`pl-[4rem] ${
                              row.status === "Pending"
                                ? "bg-red-500"
                                : "bg-transparent text-[#E24966]"
                            }`}
                          >
                            {row.status === "Pending" ? (
                              <div>{getStatusText(row.requestAction)}</div>
                            ) : (
                              <button
                                onClick={() =>
                                  row.requestAction === "R" &&
                                  openEditUpiDialog(row)
                                }
                              >
                                {getStatusText(row.requestAction)}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    {isEditUpiOpen &&
                      selectedRow &&
                      selectedRow.requestAction === "R" && (
                        <RejectUpiOpen
                          isOpen={isEditUpiOpen}
                          onClose={closeDialog}
                          withdrawalReq={selectedRow}
                        />
                      )}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wallet;
