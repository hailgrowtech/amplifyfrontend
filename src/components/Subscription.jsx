import React, { useState, useEffect } from "react";
import SubscriptionDialog from "./SubsciptionDialog";
import { deleteIcon, edit } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import SubsciptionMiniOffer from "./SubsciptionMiniOffer";
import api from "../api";

const Subscription = ({stackholderId}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [subTable, setSubTable] = useState([]); // Ensure initial state is an empty array
  const [activeUser, setActiveUser] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [planTypeCounts, setPlanTypeCounts] = useState({});
  const [showSubscriptionType, setShowSubscriptionType] = useState("1"); // Default to Commodity
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

  const handleDeleteTable = async (id) => {
    const DELETE_TABLE = `/Subscription/${id}`;

    try {
      handleSuccess();
      const response = await api.delete(DELETE_TABLE);
      if (response.status === 200) {
        console.log("Subscription deleted successfully");
        setSubTable(subTable.filter((subscription) => subscription.id !== id));
      } else {
        console.error(
          "Failed to delete subscription, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

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

  const filteredSubTable = (subTable || [])
    .filter((row) => row.serviceType === showSubscriptionType)
    .filter((row) => !row.isSpecialSubscription); // Only include non-special subscriptions

  const sortedSubTable = filteredSubTable.sort((a, b) => a.amount - b.amount);

  // Filter active users based on the selected subscription type
  const activeUserCount = activeUser.filter(
    (user) => user.subscription === showSubscriptionType
  ).length;

  return (
    <div className="pb-[5rem] xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex items-center justify-between">
        <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Service
        </span>
        <button
          onClick={openDialog}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isDialogOpen && (
          <SubscriptionDialog
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
                    <button onClick={() => handleDeleteTable(row.id)}>
                      <img
                        src={deleteIcon}
                        alt=""
                        className="w-[24px] h-[24px] text-white"
                      />
                    </button>
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
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">ACTIVE USER:</span>{" "}
                  {planTypeCounts[row.planType] || 0}/{activeUserCount}
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
                <th className="text-center">ACTIVE USER</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {sortedSubTable.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}
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
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {planTypeCounts[row.planType] || 0}/{activeUserCount}
                  </td>
                  <td className="flex flex-row items-center justify-center gap-2 py-[2rem]">
                    {/* <button onClick={() => openEditDialog(row)}>
                      <img
                        src={edit}
                        alt=""
                        className="w-[21px] h-[21px] mx-auto"
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
                    <button onClick={() => handleDeleteTable(row.id)}>
                      <img
                        src={deleteIcon}
                        alt=""
                        className="w-[21px] h-[21px] mx-auto flex items-center justify-center"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <SubsciptionMiniOffer />
      {/* <SubscriptionCourse /> */}
    </div>
  );
};

export default Subscription;
