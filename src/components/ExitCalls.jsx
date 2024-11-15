import React, { useState, useEffect } from "react";
import axios from "axios";
import { commentIcon, exit } from "../assets";
import CommentPopup from "./CommentPopup";
import CallExitDialog from "./CallPost/CallExitDialog";
import api from "../api";

const ExitCalls = ({ stackholderId }) => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [showSubscriptionType, setShowSubscriptionType] = useState("3");
  const [shareListData, setShareListData] = useState([]); // Store the shareList data
  const [error, setError] = useState(null); // For error state
  const [isDialogExitOpen, setIsDialogExitOpen] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [selectedCallPost, setSelectedCallPost] = useState(null);
  const [selectedCallPostId, setSelectedCallPostId] = useState(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Function to handle subscription type changes and fetch data
  const handleSubscriptionChange = async (type) => {
    setShowSubscriptionType(type);
    let callType;
    switch (type) {
      case "1":
        callType = "Commodity";
        break;
      case "2":
        callType = "Equity";
        break;
      case "3":
        callType = "Options";
        break;
      default:
        callType = "Options";
    }
    // Fetch data based on selected subscription type
    await fetchCallData(callType);
  };

  const openCommentPopup = (callPostId) => {
    setSelectedCallPostId(callPostId);
    setIsCommentPopupOpen(true);
  };

  const closeDialog = () => {
    // setIsDialogOpen(false);
    setIsDialogExitOpen(false);
    setSelectedCallPost(null);
  };

  // Function to close the comment popup
  const closeCommentPopup = () => {
    setIsCommentPopupOpen(false);
    setSelectedCallPostId(null);
  };

  const openExitDialog = (row) => {
    setSelectedCallPost(row); // Set the selected row to display in the dialog
    setIsDialogExitOpen(true);
  };

  // Function to fetch data from the API
  const fetchCallData = async (callType) => {
    setError(null); // Reset error

    try {
      const response = await api.get(
        `/CallPost/GetExitCall?ExpertsId=${stackholderId}&CallType=${callType}&HideFromApp=false`
      );
      if (response.data.isSuccess) {
        const fetchedData = response.data.data.flatMap(
          (item) => item.shareList
        );
        setShareListData(fetchedData);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("Error fetching data");
    }
  };

  // UseEffect to fetch the default data (Commodity) when the component mounts
  useEffect(() => {
    fetchCallData("Options"); // Fetch Commodity data by default
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="md:py-[2rem] py-[4rem] bg-gradient">
      <div className="flex flex-col md:gap-4 gap-2 md:mt-[3rem] mt-8">
        <span className="text-white text-[22px] font-[600] leading-[26.5px]">
          Exit Calls
        </span>
        <div className="flex md:flex-row flex-col md:items-center md:gap-[39rem] gap-2">
          <div className="flex flex-row md:gap-4 gap-8">
            <button
              onClick={() => handleSubscriptionChange("3")}
              className={`md:w-[140px] w-[120px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                showSubscriptionType === "3"
                  ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                  : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
              }`}
            >
              Futures & Options
            </button>
            <button
              onClick={() => handleSubscriptionChange("2")}
              className={`md:w-[90px] w-[70px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                showSubscriptionType === "2"
                  ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                  : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
              }`}
            >
              Equity
            </button>
            <button
              onClick={() => handleSubscriptionChange("1")}
              className={`md:w-[120px] w-[100px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
                showSubscriptionType === "1"
                  ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                  : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
              }`}
            >
              Commodity
            </button>
          </div>
        </div>

        <div className="flex md:mt-[3rem] mt-1">
          {smallScreen ? (
            <div className="flex flex-col flex-wrap justify-center items-center ml-[-12px]">
              {shareListData.map((row, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[350px] justify-around h-auto bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 max-w-sm"
                >
                  {/* DATE */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DATE:</span>{" "}
                    {new Date(row.createdOn).toLocaleDateString()}
                  </span>

                  {/* NAME */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">NAME:</span> {row.name}
                  </span>

                  {/* TARGET HIT */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">TARGET HIT:</span>
                    <span>{row.targetHit}</span>
                  </span>

                  {/* ABOVE */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">ABOVE:</span> {row.above}
                  </span>

                  {/* SL */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">SL:</span> {row.stopLoss}
                  </span>

                  {/* ACTION */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">ACTION:</span> {row.action}
                  </span>

                  {/* EXIT BUTTON */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">EXIT:</span>
                    <button onClick={() => openExitDialog(row)}>
                      <img
                        src={exit}
                        alt="Exit"
                        className="w-[24px] h-[24px]"
                      />
                    </button>
                    {isDialogExitOpen && (
                      <CallExitDialog
                        isDialogOpen={isDialogExitOpen}
                        closeDialog={closeDialog}
                        callPostId={selectedCallPost}
                      />
                    )}
                  </span>

                  {/* COMMENT BUTTON */}
                  <span className="flex items-center my-2 justify-between sm:w-[305px] font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">COMMENT:</span>
                    <button
                      className="rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px]"
                      onClick={() => openCommentPopup(row.callPostId)}
                    >
                      <img
                        src={commentIcon}
                        alt="Comment"
                        className="w-[24px] h-[24px]"
                      />
                    </button>
                    {isCommentPopupOpen &&
                      selectedCallPostId === row.callPostId && (
                        <CommentPopup
                          isOpen={isCommentPopupOpen}
                          closePopup={closeCommentPopup}
                          callPostId={selectedCallPostId}
                          stackholderId={stackholderId}
                        />
                      )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <table className="xl:w-[1520px] md:w-[1100px] h-[230px] bg-[#29303F] rounded-[30px]">
              <thead className="text-[#BABABA] font-inter font-[600] text-[14px] leading-[20px] h-[51px]">
                <tr>
                  <th className="text-center">DATE</th>
                  <th className="text-center">NAME</th>
                  <th className="text-center">TARGET HIT</th>
                  <th className="text-center">ABOVE</th>
                  <th className="text-center">SL</th>
                  <th className="text-center">ACTION</th>
                  <th className="text-center">EXIT</th>
                  <th className="text-center">COMMENT</th>
                </tr>
              </thead>
              <tbody className="text-lightWhite h-[81px]">
                {shareListData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}
                  >
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {new Date(row.createdOn).toLocaleDateString()}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.name}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.targetHit}
                    </td>
                    <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                      {row.above}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.stopLoss}
                    </td>
                    <td className="font-[500] text-center text-[16px] leading-[18px]">
                      {row.action}
                    </td>
                    <td className="text-center">
                      <button onClick={() => openExitDialog(row)}>
                        <img
                          src={exit}
                          alt="Exit"
                          className="w-[24px] h-[24px]"
                        />
                      </button>
                      {isDialogExitOpen && (
                      <CallExitDialog
                        isDialogOpen={isDialogExitOpen}
                        closeDialog={closeDialog}
                        callPostId={selectedCallPost}
                      />
                    )}
                    </td>
                    <td className="text-center">
                      <button onClick={() => openCommentPopup(row.callPostId)}>
                        <img
                          src={commentIcon}
                          alt="Comment"
                          className="w-[24px] h-[24px]"
                        />
                      </button>
                      {isCommentPopupOpen &&
                      selectedCallPostId === row.callPostId && (
                        <CommentPopup
                          isOpen={isCommentPopupOpen}
                          closePopup={closeCommentPopup}
                          callPostId={selectedCallPostId}
                          stackholderId={stackholderId}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitCalls;
