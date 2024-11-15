import React, { useState, useEffect } from "react";
import axios from "axios";
import { commentIcon, exit } from "../../assets";
import PremiumCallPost from "./PremiumCallPost";
import CallPostDialog from "./CallPostDialog";
import CallPostNotoficationDialog from "./CallPostNotoficationDialog";
import CallDialog from "./CallDialog";
import CallExitDialog from "./CallExitDialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import CommentPopup from "../CommentPopup";
import api from "../../api";
import { toast } from "react-toastify";
import ExitCalls from "../ExitCalls";
import Stories from "../Stories";

const CallPost = ({ stackholderId, token }) => {
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogExitOpen, setIsDialogExitOpen] = useState(false);
  const [isFreeCallsDialogOpen, setIsFreeCallsDialogOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [showSubscriptionType, setShowSubscriptionType] = useState("3");
  const [selectedCallPost, setSelectedCallPost] = useState(null);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [selectedCallPostId, setSelectedCallPostId] = useState(null);
  const [subTable, setSubTable] = useState([]);
  const [chatId, setChatId] = useState("");
  const [sendTelegramMessage, setSendTelegramMessage] = useState(false);
  const navigate = useNavigate();
  const handleGoLive = () => {
    navigate("/live-feature");
  }; // New state to store the fetched data

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/Story?page=1&pageSize=10000");
      if (response.data.isSuccess) {
        setStories(response.data.data);
      } else {
        setError("Failed to fetch stories.");
      }
    } catch (err) {
      setError("An error occurred while fetching stories.");
    } finally {
      setLoading(false);
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

  const openNotificationDialog = () => {
    setIsNotificationDialogOpen(true);
  };

  const openFreeCallsDialog = () => {
    setIsFreeCallsDialogOpen(true);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const openExitDialog = (row) => {
    setSelectedCallPost(row);
    setIsDialogExitOpen(true);
  };

  const closeDialog = () => {
    setIsNotificationDialogOpen(false);
    setIsDialogOpen(false);
    setIsFreeCallsDialogOpen(false);
    setIsDialogExitOpen(false);
  };

  const fetchChatId = async () => {
    try {
      const response = await api.get(`/Experts/${stackholderId}`);
      const { data } = response.data;

      // Dynamically select the chatId based on showSubscriptionType
      const selectedChatId = data[`chatId${showSubscriptionType}`];
      setChatId(selectedChatId);
    } catch (error) {
      toast.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchCallData("Options");
    fetchChatId();
  }, []);

  // Function to fetch data based on subscription type
  const fetchCallData = async (subscriptionType) => {
    try {
      const response = await api.get(
        `/CallPost?callMode=F&expertsId=${stackholderId}&callType=${subscriptionType}&page=1&pageSize=1000000`
      );

      if (response.data.isSuccess) {
        // Map the fetched data into subTable format
        const mappedData = response.data.data.flatMap((item) => {
          return item.shareList
            .filter((share) => !share.exitCall)
            .map((share) => ({
              callPostId: share.id,
              createdOn: new Date(share.createdOn).toLocaleString(),
              serviceType: share.name,
              amount: share.above, // Modify this if you want a different value
              sl: share.stopLoss,
              action: share.action,
              targetHit: share.targetHit,
              targetStopLoss: share.targetStopLoss,
              initialTargetStopLoss: share.targetStopLoss,
              target1: share.target1,
              target2: share.target2,
              target3: share.target3,
              target4: share.target4,
              likeCount: share.likeCount,
            }));
        });
        setSubTable(mappedData); // Update the subTable state with the mapped data
      }
    } catch (error) {
      toast.error("Error fetching call data", error.message);
    }
  };

  // Handler to change subscription type and fetch relevant data
  const handleSubscriptionChange = (type) => {
    setShowSubscriptionType(type);
    const subscriptionTypeLabel = getSubscriptionTypeLabel(type);
    fetchCallData(subscriptionTypeLabel); // Fetch data based on subscription type
  };

  const getSubscriptionTypeLabel = (type) => {
    switch (type) {
      case "3":
        return "Options";
      case "1":
        return "Commodity";
      case "2":
        return "Equity";
      default:
        return "Options";
    }
  };

  const handleSLChange = (index, newValue) => {
    const updatedTable = [...subTable];
    updatedTable[index].sl = newValue;
    updatedTable[index].targetStopLoss = newValue;
    setSubTable(updatedTable);
  };

  const handleTargetHitChange = (index, newValue) => {
    const updatedTable = [...subTable];
    updatedTable[index].targetHit = newValue;
    setSubTable(updatedTable);
  };

  const handleActionChange = (index, newValue) => {
    const updatedTable = [...subTable];
    updatedTable[index].action = newValue;
    setSubTable(updatedTable);
  };

  const handleOpenPopup = (row) => {
    setSelectedRow(row);
    setPopupVisible(true);
  };

  const handleConfirmSendMessage = async () => {
    if (selectedRow) {
      await handleSendMessage(selectedRow.callPostId, selectedRow);
      setPopupVisible(false);
      setSelectedRow(null);
    }
  };

  const handleSendMessage = async (callPostId, row) => {
    if (!row.action || !row.sl || !row.targetHit) {
      toast.error("Select the required fields!");
      return;
    }
    try {
      await makePostRequest(
        callPostId,
        row.action,
        row.amount,
        row.sl,
        row.targetHit,
        row.serviceType,
        row.initialTargetStopLoss
      );
    } catch (error) {
      toast.error("Error sending message", error.message);
    }
  };

  const makePostRequest = async (
    callPostId,
    action,
    above,
    stopLoss,
    targetHit,
    serviceType,
    initialTargetStopLoss
  ) => {
    const postData = {
      expertsId: stackholderId,
      callPostId: callPostId,
      action: action,
      stopLoss: stopLoss,
      targetHit: targetHit,
      exitCall: false,
    };

    try {
      // First API Call: SendMessageFree
      await api.post("/CallNotification/SendMessageFree", postData);
      toast.success("Message sent successfully");

      // Second API Call: sendTargetHitMessage
      const messageData = {
        name: serviceType,
        action: action,
        above: above,
        targetHit: targetHit,
        stopLoss: stopLoss,
        chatId: chatId,
      };

      if (sendTelegramMessage) {
        if (stopLoss !== initialTargetStopLoss) {
          const messageSlData = {
            name: serviceType,
            action: action,
            targetStopLoss: initialTargetStopLoss,
            stopLoss: stopLoss,
            chatId: chatId,
          };

          const slResponse = await axios.post(
            "https://phonepe.copartner.in/api/sendSLMessage",
            messageSlData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (slResponse.status === 200) {
            toast.success("SL message sent successfully");
          } else {
            toast.error("Failed to send SL message:", slResponse.data);
          }
        }

        const response = await axios.post(
          "https://phonepe.copartner.in/api/sendTargetHitMessage",
          messageData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.success);
        } else {
          toast.error("Failed to send target hit message:", response.data);
        }
      }
    } catch (error) {
      toast.error("Error with POST request:", error);
    }
  };

  const openCommentPopup = (callPostId) => {
    setSelectedCallPostId(callPostId);
    setIsCommentPopupOpen(true);
  };

  // Close comment popup
  const closeCommentPopup = () => {
    setIsCommentPopupOpen(false);
    setSelectedCallPostId(null);
  };

  const handleToggle = () => {
    setSendTelegramMessage((prev) => !prev);
  };

  return (
    <div className="pb-[5rem] xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen w-screen">
      <div className="flex md:flex-row flex-row justify-between items-center mr-20 gap-2">
        <span className="font-inter text-[22px] font-[600] leading-[27px] text-white">
          Story
        </span>
        <div className="flex gap-1">
          <button
            className="md:w-30 w-36 md:h-10 h-8 rounded-lg text-white font-semibold font-inter md:text-sm text-base border border-[#6469FA]"
            style={{
              background: "linear-gradient(to right, #6469FA, #0181F1)",
            }}
            onClick={handleGoLive}
          >
            {" "}
            Go Live
          </button>
          <button
            onClick={openNotificationDialog} // Open notification dialog on click
            className="md:w-[120px] w-[140px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white"
          >
            Send Notification
          </button>
          {isNotificationDialogOpen && (
            <CallPostNotoficationDialog
              isDialogOpen={isNotificationDialogOpen}
              closeDialog={closeDialog}
            />
          )}

          <button
            onClick={openDialog} // Open CallPostDialog on click
            className="md:w-[100px] w-[100px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white"
          >
            +Add Story
          </button>
          {isDialogOpen && (
            <CallPostDialog
              fetchStories={fetchStories}
              isDialogOpen={isDialogOpen}
              closeDialog={closeDialog}
              stackholderId={stackholderId}
            />
          )}
        </div>
      </div>
      <Stories
        fetchStories={fetchStories}
        stories={stories}
        loading={loading}
        error={error}
      />

      <div className="flex flex-col md:gap-4 gap-2 md:mt-[3rem] mt-8">
        <div className="flex justify-between md:mr-40">
          <div className="text-white text-[22px] font-[600] leading-[26.5px]">
            Free Calls
          </div>
          <button
            onClick={openFreeCallsDialog}
            className="md:w-[100px] w-[90px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-0 mr-2"
          >
            +Add Calls
          </button>
          {isFreeCallsDialogOpen && (
            <CallDialog
              isDialogOpen={isFreeCallsDialogOpen}
              closeDialog={closeDialog}
              stackholderId={stackholderId}
              chatId={chatId}
              fetchCallData={fetchCallData}
              sendTelegramMessage={sendTelegramMessage}
            />
          )}
        </div>
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
        <div className="flex gap-2 items-center justify-end md:w-5/6 mx-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={sendTelegramMessage}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 peer-focus:ring-4 peer-focus:ring-blue-300 transition duration-300 ease-in-out">
              <div
                className={`${
                  sendTelegramMessage ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-300`}
              ></div>
            </div>
          </label>
          <p className="text-white">
            Status: {sendTelegramMessage ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>

      <div className="flex md:mt-[3rem] mt-1">
        {smallScreen ? (
          <div className="flex md:mt-[3rem] mt-1">
            <div className="flex flex-col flex-wrap justify-center items-center ml-[-12px]">
              {subTable.map((row, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[350px] justify-around h-auto bg-[#18181B] bg-opacity-[50%] rounded-[30px] md:m-4 m-[10px] p-4 max-w-sm" // Changed padding to p-6
                >
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">DATE:</span> {row.createdOn}
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">NAME:</span>{" "}
                    {row.serviceType}
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">TARGET HIT:</span>
                    <select
                      className="md:w-[100px] w-[70px] md:h-[44px] h-[34px] rounded-[10px] bg-black text-center text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white" // Increased height by 4px
                      value={row.targetHit || ""}
                      onChange={(e) =>
                        handleTargetHitChange(index, e.target.value)
                      }
                    >
                      <option value="">{"Select Target"}</option>
                      <option value={row.target1}>{row.target1}</option>
                      <option value={row.target2}>{row.target2}</option>
                      <option value={row.target3}>{row.target3}</option>
                      <option value={row.target4}>{row.target4}</option>
                    </select>
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">ABOVE:</span> {row.amount}
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">SL:</span>
                    <input
                      type="number"
                      className="md:w-[100px] w-[70px] md:h-[44px] h-[34px] rounded-[10px] bg-black text-center text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white" // Increased height by 4px
                      value={row.targetStopLoss || row.sl || ""}
                      onChange={(e) => handleSLChange(index, e.target.value)}
                    />
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">ACTION:</span>
                    <select
                      className="md:w-[100px] w-[70px] md:h-[44px] h-[34px] rounded-[10px] text-center text-white bg-black font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white" // Increased height by 4px
                      value={row.action || ""}
                      onChange={(e) =>
                        handleActionChange(index, e.target.value)
                      }
                    >
                      <option value="">Select Action</option>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                      <option value="HOLD">HOLD</option>
                    </select>
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">MESSAGE:</span>
                    <button
                      className="md:w-[100px] w-[70px] md:h-[44px] h-[34px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white" // Increased height by 4px
                      onClick={() => handleOpenPopup(row)}
                    >
                      Send Message
                    </button>
                    {popupVisible && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-[#29303F] text-gray-300 p-6 rounded-md shadow-md text-center">
                          <p className="mb-4 font-semibold text-lg">
                            Confirm Send Message
                          </p>
                          <p className="mb-2">
                            Action:{" "}
                            <span className="font-bold">
                              {selectedRow.action}
                            </span>
                          </p>
                          <p className="mb-2">
                            Amount:{" "}
                            <span className="font-bold">
                              {selectedRow.amount}
                            </span>
                          </p>
                          <p className="mb-2">
                            SL:{" "}
                            <span className="font-bold">{selectedRow.sl}</span>
                          </p>
                          <p className="mb-2">
                            Target Hit:{" "}
                            <span className="font-bold">
                              {selectedRow.targetHit}
                            </span>
                          </p>
                          <div className="flex justify-center gap-4 mt-4">
                            <button
                              onClick={handleConfirmSendMessage}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                              I Confirm
                            </button>
                            <button
                              onClick={() => setPopupVisible(false)}
                              className="px-4 py-2 bg-gray-300 text-black rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
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
                        fetchCallData={fetchCallData}
                        showSubscriptionType={showSubscriptionType}
                        chatId={chatId}
                        sendTelegramMessage={sendTelegramMessage}
                      />
                    )}
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">COMMENT:</span>
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
                  </span>
                  <span className="flex items-center my-2 justify-between sm:w-full font-[500] text-[14px] leading-[12px] text-lightWhite">
                    <span className="text-dimWhite">LIKES:</span>
                    <span className="text-dimWhite mr-4">{row.likeCount}</span>
                  </span>
                </div>
              ))}
            </div>
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
                <th className="text-center">MESSAGE</th>
                <th className="text-start">EXIT</th>
                <th className="text-start">COMTS.</th>
                <th className="text-start">LIKES</th>
              </tr>
            </thead>
            <tbody className="text-lightWhite h-[81px]">
              {subTable.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#1E1E22]" : ""}
                >
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.createdOn}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    {row.serviceType}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    <select
                      className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-center text-white bg-black font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-0 mr-2"
                      value={row.targetHit || ""}
                      onChange={(e) =>
                        handleTargetHitChange(index, e.target.value)
                      }
                    >
                      <option value="">{"Select Target"}</option>
                      <option value={row.target1}>{row.target1}</option>
                      <option value={row.target2}>{row.target2}</option>
                      <option value={row.target3}>{row.target3}</option>
                      <option value={row.target4}>{row.target4}</option>
                    </select>
                  </td>
                  <td className="py-2 text-center font-[500] text-[16px] leading-[18px]">
                    {row.amount}
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    <input
                      type="number"
                      className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-center text-white bg-black font-[600] font-inter md:text-[16px] text-[14px] border-solid border-[1px] border-white"
                      value={row.targetStopLoss || row.sl || ""}
                      onChange={(e) => handleSLChange(index, e.target.value)}
                    />
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    <select
                      className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-center text-white bg-black font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-0 mr-2"
                      value={row.action || ""}
                      onChange={(e) =>
                        handleActionChange(index, e.target.value)
                      }
                    >
                      <option value="">Select Action</option>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                      <option value="HOLD">HOLD</option>
                    </select>
                  </td>
                  <td className="font-[500] text-center text-[16px] leading-[18px]">
                    <button
                      className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-0 mr-2"
                      onClick={() => handleOpenPopup(row)}
                    >
                      Send Message
                    </button>
                    {popupVisible && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-[#29303F] text-gray-300 p-6 rounded-md shadow-md text-center">
                          <p className="mb-4 font-semibold text-lg">
                            Confirm Send Message
                          </p>
                          <p className="mb-2">
                            Action:{" "}
                            <span className="font-bold">
                              {selectedRow.action}
                            </span>
                          </p>
                          <p className="mb-2">
                            Amount:{" "}
                            <span className="font-bold">
                              {selectedRow.amount}
                            </span>
                          </p>
                          <p className="mb-2">
                            SL:{" "}
                            <span className="font-bold">{selectedRow.sl}</span>
                          </p>
                          <p className="mb-2">
                            Target Hit:{" "}
                            <span className="font-bold">
                              {selectedRow.targetHit}
                            </span>
                          </p>
                          <div className="flex justify-center gap-4 mt-4">
                            <button
                              onClick={handleConfirmSendMessage}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                              I Confirm
                            </button>
                            <button
                              onClick={() => setPopupVisible(false)}
                              className="px-4 py-2 bg-gray-300 text-black rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <button onClick={() => openExitDialog(row)}>
                      <img
                        src={exit}
                        alt="Exit"
                        className="w-[24px] h-[24px]"
                      />
                    </button>

                    {/* Call Exit Dialog */}
                    {isDialogExitOpen && (
                      <CallExitDialog
                        isDialogOpen={isDialogExitOpen}
                        closeDialog={closeDialog}
                        callPostId={selectedCallPost}
                        fetchCallData={fetchCallData}
                        showSubscriptionType={showSubscriptionType}
                        chatId={chatId}
                        sendTelegramMessage={sendTelegramMessage}
                      />
                    )}
                  </td>
                  <td className="text-center">
                    {/* Comment button */}
                    <button onClick={() => openCommentPopup(row.callPostId)}>
                      <img
                        src={commentIcon}
                        alt="Comment"
                        className="w-[24px] h-[24px]"
                      />
                    </button>
                    {/* Comment Popup */}
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
                  <td className="text-center">
                    <p>{row.likeCount}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PremiumCallPost stackholderId={stackholderId} />
      <ExitCalls stackholderId={stackholderId} />
    </div>
  );
};

export default CallPost;
