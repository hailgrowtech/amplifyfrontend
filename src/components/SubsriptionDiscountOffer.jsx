import React, { useState, useEffect } from "react";
import { deleteIcon } from "../assets";
import SubscriptionEditDiscount from "./SubscriptionEditDiscount";
import axios from "axios";
import { toast } from "react-toastify";
import SubscriptionChat from "./SubscriptionChat";
import api from "../api";

const SubsriptionDiscountOffer = () => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [discount, setDiscount] = useState([]);

  const stackholderId = sessionStorage.getItem("stackholderId");
  const SUB_TABLE = `https://copartners.in:5009/api/Subscription/GetByExpertsId/${stackholderId}`;

  const axiosServiceData = async () => {
    try {
      const res = await axios.get(SUB_TABLE);
      setDiscount(res.data.data || []);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    axiosServiceData();
  }, []);

  const handleSuccess = () => {
    toast.success("Successfully Updated!", {
      position: "top-right",
    });
  };

  const handleDeleteTable = async (id) => {
    const PATCH_URL = `/Subscription?Id=${id}`;
    const patchData = [
      {
        path: "discountValidFrom",
        op: "replace",
        value: ""
      },
      {
        path: "discountValidTo",
        op: "replace",
        value: ""
      },
      {
        path: "discountPercentage",
        op: "replace",
        value: "0"
      }
    ];

    try {
      const response = await api.patch(PATCH_URL, patchData, {
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      });

      if (response.status === 200) {
        axiosServiceData();
        handleSuccess();
      } else {
        console.error("Failed to update subscription, status:", response.status);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const addCourse = () => {
    axiosServiceData();
    closeDialog();
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
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

  return (
    <div className="md:pt-[5rem] py-[4rem] bg-gradient">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex items-center justify-between md:py-0 py-6">
        <span className="md:w-[240px] w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Service Discount Offers
        </span>
        <button
          onClick={openDialog}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isDialogOpen && (
          <SubscriptionEditDiscount
            addCourse={addCourse}
            closeDialog={closeDialog}
          />
        )}
      </div>

      <div className="flex md:mt-[2rem] mt-1">
        {smallScreen ? (
          <div className="flex flex-wrap justify-center items-center ml-[-22px]">
            {discount.filter((row) => row.discountPercentage > 0).map((row, index) => (
              <div
                key={index}
                className="flex flex-col justify-around h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 w-[90%] max-w-sm"
              >
                <div className="flex flex-row justify-between">
                  <p className="w-[173px] h-[26px] font-[600] text-[16px] leading-[25px] text-lightWhite">
                    {row.planType}
                  </p>
                  <div className="flex gap-3">
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
                  <span className="text-dimWhite">DATE:</span> {formatDate(row.createdOn)}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">START DATE:</span>{" "}
                  {new Date(row.discountValidFrom).toLocaleString()}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">END DATE:</span> {new Date(row.discountValidTo).toLocaleString()}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">PLAN:</span> {row.planType}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">SERVICE TYPE:</span> {getSubscriptionTypeLabel(row.serviceType)}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DISCOUNT %:</span> 
                  {row.discountPercentage
                        ? `${row.discountPercentage}%`
                        : "N/A"}
                </span>
                <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                  <span className="text-dimWhite">DISCOUNTED AMT.:</span>{" "}
                  {row.discountedAmount}
                </span>
              </div>
            ))}
            <button className="mt-6 md:w-[147px] md:h-[40px] md:flex items-center justify-center flex w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px]">
              Show More
            </button>
          </div>
        ) : (
          <table className="xl:w-[1520px] md:w-[1130px] h-[230px] bg-[#29303F] rounded-[30px]">
            <thead className="text-[#BABABA] font-inter font-[600] text-[14px] leading-[20px] h-[51px]">
              <tr>
                <th className="text-center">DATE</th>
                <th className="text-center">START DATE</th>
                <th className="text-center">END DATE</th>
                <th className="text-center">PLAN</th>
                <th className="text-center">SERVICE TYPE</th>
                <th className="text-center">DISCOUNT %</th>
                <th className="text-center">DISCOUNTED AMT.</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {discount
                .filter((row) => row.discountPercentage > 0)
                .map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}
                  >
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {formatDate(row.createdOn)}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {new Date(row.discountValidFrom).toLocaleString()}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {new Date(row.discountValidTo).toLocaleString()}
                    </td>
                    <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                      {row.planType}
                    </td>
                    <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                    {getSubscriptionTypeLabel(row.serviceType)}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.discountPercentage
                        ? `${row.discountPercentage}%`
                        : "N/A"}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.discountedAmount}
                    </td>
                    <td className="flex flex-row items-center justify-center gap-2 py-[2rem]">
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
      <SubscriptionChat />
    </div>
  );
};

export default SubsriptionDiscountOffer;
