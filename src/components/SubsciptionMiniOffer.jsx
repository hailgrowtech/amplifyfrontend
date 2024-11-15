import React, { useState, useEffect } from "react";
import SubsciptionMiniOfferDialog from "./SubsciptionMiniOfferDialog";
import { deleteIcon, Link } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import SubsriptionDiscountOffer from "./SubsriptionDiscountOffer";
import SubscriptionCourse from "./SubscriptionCourse";

const SubsciptionMiniOffer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [subTable, setSubTable] = useState([]); // Ensure initial state is an empty array
  const [activeUser, setActiveUser] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [planTypeCounts, setPlanTypeCounts] = useState({});
  const [showSubscriptionType, setShowSubscriptionType] = useState("1"); // Default to Commodity
  const [copiedMessage, setCopiedMessage] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [copiedRow, setCopiedRow] = useState(null);

  const stackholderId = sessionStorage.getItem("stackholderId");
  const SUB_TABLE = `https://copartners.in:5009/api/Subscription/GetByExpertsId/${stackholderId}`;
  const ACTIVE_USER = `https://copartners.in:5132/api/RADashboard/GetDashboardRAListingData/${stackholderId}?page=1&pageSize=100000`;

  const handleSuccess = () => {
    toast.success("Successfully Deleted!", {
      position: "top-right",
    });
  };

  useEffect(() => {
    const fetchActiveUser = async () => {
      try {
        const res = await axios.get(ACTIVE_USER);
        const filteredUsers = res.data.data.filter(
          (user) => user.subscription !== "No Subscrption"
        );
        setActiveUser(filteredUsers);
        countPlanTypes(filteredUsers, showSubscriptionType);
      } catch (error) {
        console.error("Error fetching active user:", error);
      }
    };

    fetchActiveUser();
  }, [ACTIVE_USER, showSubscriptionType]);

  const axiosServiceData = async () => {
    try {
      const res = await axios.get(SUB_TABLE);
      setSubTable(res.data.data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    axiosServiceData();
  }, [SUB_TABLE]);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const openEditDialog = (subscription) => {
    setCurrentSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
  };

//   const handleDeleteTable = async (id) => {
//     const DELETE_TABLE = `https://copartners.in:5009/api/Subscription/${id}`;

//     try {
//       handleSuccess();
//       const response = await axios.delete(DELETE_TABLE);
//       if (response.status === 200) {
//         console.log("Subscription deleted successfully");
//         setSubTable(subTable.filter((subscription) => subscription.id !== id));
//       } else {
//         console.error(
//           "Failed to delete subscription, status:",
//           response.status
//         );
//       }
//     } catch (error) {
//       console.error("Error deleting subscription:", error);
//     }
//   };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getSubscriptionTypeLabel = (type) => {
    switch (type) {
      case "3":
        return "Futures & Options";
      case "1":
        return "Commodity";
      case "2":
        return "Equity";
      default:
        return "Select Subscription Type";
    }
  };

  const countPlanTypes = (data, subscriptionType) => {
    const counts = data.reduce((acc, item) => {
      if (item.subscription === subscriptionType) {
        acc[item.planType] = (acc[item.planType] || 0) + 1;
      }
      return acc;
    }, {});
    setPlanTypeCounts(counts);
  };

  const handleCopyLink = (id, rowIndex) => {
    const link = `https://copartner.in:443/ra-detail2/${id}?raid=${stackholderId}`;
    navigator.clipboard
      .writeText(link)
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

  const filteredSubTable = (subTable || [])
    .filter((row) => row.serviceType === showSubscriptionType)
    .filter((row) => row.isSpecialSubscription); // Only include special subscriptions

  const sortedSubTable = filteredSubTable.sort((a, b) => a.amount - b.amount);

  // Filter active users based on the selected subscription type
  const activeUserCount = activeUser.filter(
    (user) => user.subscription === showSubscriptionType
  ).length;

  const handleMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
    setCopiedRow(null);
  };

  return (
    <div className="md:py-[5rem] py-[4rem] bg-gradient">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex items-center justify-between">
        <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Mini Services
        </span>
        <button
          onClick={openDialog}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isDialogOpen && (
          <SubsciptionMiniOfferDialog
            axiosServiceData={axiosServiceData}
            isDialogOpen={isDialogOpen}
            closeDialog={closeDialog}
            subTable={subTable}
          />
        )}
      </div>

      <div className="flex md:flex-row flex-col md:justify-between md:gap-0 gap-0 md:mt-[3rem] mt-4">
        <div className="flex flex-row md:gap-4 gap-6">
          <button
            onClick={() => setShowSubscriptionType("1")}
            className={`md:w-[120px] w-[100px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
              showSubscriptionType === "1"
                ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
            }`}
          >
            Commodity
          </button>
          <button
            onClick={() => setShowSubscriptionType("2")}
            className={`md:w-[90px] w-[70px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
              showSubscriptionType === "2"
                ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
            }`}
          >
            Equity
          </button>
          <button
            onClick={() => setShowSubscriptionType("3")}
            className={`md:w-[140px] w-[120px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
              showSubscriptionType === "3"
                ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
            }`}
          >
            Futures & Options
          </button>
        </div>
      </div>

      <div className="flex md:mt-[3rem] mt-1">
        {smallScreen ? (
          <div className="flex flex-wrap justify-center items-center ml-[-22px]">
            {sortedSubTable.map((row, index) => (
              <div
                key={index}
                className="flex flex-col justify-around w-[361px] h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 w-[90%] max-w-sm"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-row justify-between">
                  <p className="w-[173px] h-[26px] font-[600] text-[16px] leading-[25px] text-lightWhite">
                    {getSubscriptionTypeLabel(row.serviceType)}
                  </p>
                  <div className="flex gap-3">
                    {/* <button onClick={() => openEditDialog(row)}>
                      <img
                        src={edit}
                        alt=""
                        className="w-[24px] h-[24px] text-white"
                      />
                    </button>
                    {isEditDialogOpen && (
                      <SubscriptionEditService
                        isEditDialogOpen={isEditDialogOpen}
                        closeDialog={closeDialog}
                        subTable={row}
                        axiosServiceData={axiosServiceData}
                      />
                    )} */}
                    {/* <button onClick={() => handleDeleteTable(row.id)}>
                      <img
                        src={deleteIcon}
                        alt=""
                        className="w-[24px] h-[24px] text-white"
                      />
                    </button> */}
                  </div>
                </div>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DATE:</span>{" "}
                  {formatDate(row.createdOn)}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">SERVICE TYPE:</span>{" "}
                  {getSubscriptionTypeLabel(row.serviceType)}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">PLAN NAME:</span>{" "}
                  {row.planType}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DURATION:</span>{" "}
                  {row.durationMonth}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">AMOUNT:</span> {row.amount}
                </span>
                <span className="relative flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">LINK:</span>{" "}
                  <button onClick={() => handleCopyLink(row.id, index)}>
                    <img src={Link} alt="COPY_SUB" className="w-[18px] h-[18px]" />
                  </button>
                  {hoveredRow === index && (
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2">
                      {copiedRow === index ? "Copied" : "Copy"}
                    </span>
                  )}
                </span>
              </div>
            ))}
            {sortedSubTable.length > 0 && (
              <button className="mt-6 md:w-[147px] w-[95px] h-[20px] md:h-[40px] md:flex items-center justify-center flex w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px]">
                Show More
              </button>
            )}
          </div>
        ) : (
          <table className="xl:w-[1520px] md:w-[1130px] h-[230px] bg-[#29303F] rounded-[30px]">
            <thead className="text-[#BABABA] font-inter font-[600] text-[14px] leading-[20px] h-[51px]">
              <tr>
                <th className="text-center">DATE</th>
                <th className="text-center">SERVICE TYPE</th>
                <th className="text-center">PLAN NAME</th>
                <th className="text-center">DURATION</th>
                <th className="text-center">AMOUNT</th>
                <th className="text-center">LINK</th>
                {/* <th className="text-center">ACTION</th> */}
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {sortedSubTable.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {formatDate(row.createdOn)}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {getSubscriptionTypeLabel(row.serviceType)}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.planType}
                  </td>
                  <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                    {row.durationMonth}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.amount}
                  </td>
                  <td className="relative mr-[-2rem]">
                    <button onClick={() => handleCopyLink(row.id, index)}>
                      <img src={Link} alt="COPY_SUB" className="w-[20px] h-[20px] ml-[1.5rem]" />
                    </button>
                    {hoveredRow === index && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded py-1 px-2">
                        {copiedRow === index ? "Copied" : "Copy"}
                      </span>
                    )}
                  </td>
                  {/* <td className="flex flex-row items-center justify-center gap-2 py-[2rem]">
                    <button onClick={() => handleDeleteTable(row.id)}>
                      <img
                        src={deleteIcon}
                        alt=""
                        className="w-[21px] h-[21px] mx-auto flex items-center justify-center"
                      />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {copiedMessage && <p className="text-center text-green-500 mt-2">{copiedMessage}</p>}
      <SubsriptionDiscountOffer />
    </div>
  );
};

export default SubsciptionMiniOffer;
