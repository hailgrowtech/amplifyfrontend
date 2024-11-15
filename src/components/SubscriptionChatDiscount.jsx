import React, { useState, useEffect } from "react";
import axios from "axios";
import { deleteIcon } from "../assets";
import SubscriptionChatDiscountDialog from "./SubscriptionChatDiscountDialog";
import api from "../api";

const SubscriptionChatDiscount = () => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const stackholderId = sessionStorage.getItem("stackholderId");

  const fetchCourses = async () => {
    try {
      const response = await api.get(
        `/ChatConfiguration/GetChatPlanByExpertsId/${stackholderId}?page=1&pageSize=100000`
      );
      if (response.data && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        setError("Data format is incorrect");
      }
    } catch (error) {
      setError("Error fetching courses");
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const addCourse = (newCourse) => {
    setCourses([...courses, newCourse]);
    fetchCourses();
    closeDialog();
  };

  const handleDelete = async (id, planType) => {
    const DELETE_URL = `/ChatConfiguration/${id}`;
    const PATCH_URL = `/ChatConfiguration?Id=${id}`;
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
      if (planType === "F") {
        const response = await api.delete(DELETE_URL);

        if (response.status === 200) {
          setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
        } else {
          console.error("Failed to delete subscription, status:", response.status);
          setError("Failed to delete the chat. Please try again later.");
        }
      } else {
        const response = await api.patch(PATCH_URL, patchData, {
          headers: {
            'Content-Type': 'application/json-patch+json'
          }
        });

        if (response.status === 200) {
          setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
        } else {
          console.error("Failed to update subscription, status:", response.status);
          setError("Failed to update the chat. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error updating/deleting subscription:", error);
      setError("Error updating/deleting the chat. Please try again later.");
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [stackholderId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredCourses = courses.filter(
    (course) => course.discountPercentage > 0 || course.planType === "F"
  );

  return (
    <div className="bg-gradient md:pt-[5rem] py-[4rem]">
      <div className="xl:w-[1520px] md:w-[1130px] w-[350px] flex items-center justify-between">
        <span className="font-inter text-[22px] font-[600] leading-[27px] text-white md:ml-0 ml-2">
          Chat Discount Offer
        </span>
        <button
          onClick={openDialog}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isDialogOpen && (
          <SubscriptionChatDiscountDialog addCourse={addCourse} closeDialog={closeDialog} />
        )}
      </div>

      <div className="flex md:mt-[2rem] mt-1">
        {smallScreen ? (
          <div className="flex flex-wrap justify-center items-center ml-[-22px]">
            {error ? (
              <p className="text-white">{error}</p>
            ) : (
              filteredCourses.map((row, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-around h-[248px] bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 w-[90%] max-w-sm"
                >
                  <div className="flex flex-row justify-between">
                    <p className="w-[173px] h-[26px] font-[600] text-[14px] leading-[25px] text-lightWhite">
                      {row.planName}
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => handleDelete(row.id, row.planType)}>
                        <img src={deleteIcon} alt="delete" className="w-[24px] h-[24px] text-white" />
                      </button>
                    </div>
                  </div>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DATE:</span> {formatDate(row.createdOn)}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[34px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DURATION:</span> {row.duration}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">PRICE:</span> {row.price}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DISCOUNT %:</span> {row.discountPercentage}
                  </span>
                  <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">PLAN TYPE:</span> {row.planType}
                  </span>
                  {/* <span className="flex items-center justify-between sm:w-[305px] h-[13px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">SUBSCRIPTION TYPE:</span> {row.subscriptionType}
                  </span> */}
                </div>
              ))
            )}
            <button className="mt-6 md:w-[147px] md:h-[40px] md:flex items-center justify-center flex w-[110px] h-[30px] rounded-[6px] bg-lightWhite md:text-[14px] text-[10px] font-[500] md:leading-[16px] leading-[12px]">
              Show More
            </button>
          </div>
        ) : (
          <table className="xl:w-[1520px] md:w-[1130px] h-[230px] bg-[#29303F] rounded-[30px]">
            <thead className="text-[#BABABA] font-inter font-[600] text-[14px] leading-[20px] h-[51px]">
              <tr>
                <th className="text-center">DATE</th>
                <th className="text-center">PLAN NAME</th>
                <th className="text-center">DURATION</th>
                <th className="text-center">PRICE</th>
                <th className="text-center">DISCOUNT %</th>
                <th className="text-center">PLAN TYPE</th>
                {/* <th className="text-center">SUBSCRIPTION TYPE</th> */}
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {error ? (
                <tr>
                  <td colSpan="8" className="text-center text-white">
                    {error}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {formatDate(row.createdOn)}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.planName}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.duration}
                    </td>
                    <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                      {row.price}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.discountPercentage}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.planType}
                    </td>
                    {/* <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.subscriptionType}
                    </td> */}
                    <td className="flex flex-row items-center justify-center gap-2 py-[2rem]">
                      <button onClick={() => handleDelete(row.id, row.planType)}>
                        <img src={deleteIcon} alt="delete" className="w-[21px] h-[21px] mx-auto flex items-center justify-center" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubscriptionChatDiscount;
