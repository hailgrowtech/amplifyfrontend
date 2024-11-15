import React, { useState, useEffect, useRef } from "react";
import {
  threeDots,
  chatUser1,
  audio,
  sendChat,
  attachDoc,
  backImg,
} from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import ChatBubble from "./ChatBubble";
import { Link } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import api from "../api";

const ChatsHistory = ({stackholderId}) => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [myCard, setMyCard] = useState(null);
  const [email, setEmail] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [conversations, setConversations] = useState({});
  const [loading, setLoading] = useState(false);
  const [showHistoryButtons, setShowHistoryButtons] = useState(false);
  const [chatUserList, setChatUserList] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [activeSubTab, setActiveSubTab] = useState("Free");
  const [currentPaidPlanId, setCurrentPaidPlanId] = useState("");
  const [chatPlan, setChatPlan] = useState(null);
  const [currentPlanType, setCurrentPlanType] = useState("");
  const [currentPlanId, setCurrentPlanId] = useState("");
  const [countdowns, setCountdowns] = useState(
    JSON.parse(sessionStorage.getItem("countdowns")) || {}
  );
  const [isSendMessageDisabled, setIsSendMessageDisabled] = useState(false);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState(
    JSON.parse(localStorage.getItem("unseenMessagesCount")) || {}
  );

  const connectionRef = useRef({});
  const intervalRefs = useRef({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data: expertData } = await api.get(
          `/Experts/${stackholderId}`
        );
        setMyCard(expertData.data);
        setEmail(expertData.data.email);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [stackholderId]);

  useEffect(() => {
    const fetchChatPlan = async () => {
      try {
        const { data } = await api.get(
          `/ChatConfiguration/GetChatPlanByExpertsId/${stackholderId}?page=1&pageSize=100000`
        );
        setChatPlan(data.data);
      } catch (error) {
        console.error("Error fetching chat plan:", error);
      }
    };

    if (stackholderId) {
      fetchChatPlan();
    }
  }, [stackholderId]);

  const fetchChatUsers = async () => {
    try {
      const {
        data: { data: users },
      } = await api.get(
        `/ChatConfiguration/GetChatUsersById/${stackholderId}`
      );
  
      const filteredUsers = users.filter((user) => {
        // Filter users based on activeTab state
        if (activeTab === "Active") {
          return user.isActive === true;
        } else if (activeTab === "History") {
          return user.isActive === false;
        }
        return false; // Default case, should not occur
      });
  
      const userDetailsPromises = filteredUsers.map((user) =>
        api.get(`/User/${user.id}`)
      );
  
      const userDetailsResponses = await Promise.all(userDetailsPromises);
  
      const chatUsers = userDetailsResponses.map((response, index) => {
        const userDetails = response.data.data;
        const planTypeLabel = getPlanTypeLabel(filteredUsers[index].planType);
  
        // Get duration for the planId or set to 2 minutes if planType is "D"
        const duration =
          filteredUsers[index].planType === "D"
            ? 2
            : getPlanDuration(filteredUsers[index].planId);
  
        return {
          chatUserImg: userDetails?.userImagePath || chatUser1,
          chatUserName: userDetails?.name,
          mobileNumber: userDetails?.mobileNumber,
          timestamp: filteredUsers[index].timestamp,
          planTypeLabel: planTypeLabel,
          duration: duration,
          planType: filteredUsers[index].planType,
          isActive: filteredUsers[index].isActive, // Add isActive to user data
        };
      });
  
      // Sort users by timestamp in descending order
      chatUsers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
      setChatUserList(chatUsers);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  };

  useEffect(() => {
    if (chatPlan) {
      fetchChatUsers();
    }
  }, [chatPlan]);

  // Helper function to map planType to a label
  const getPlanTypeLabel = (planType) => {
    switch (planType) {
      case "D":
        return "Default";
      case "F":
        return "Free";
      case "P":
        return "Premium";
      default:
        return "No Subscription";
    }
  };

  // Helper function to get plan duration by planId
  const getPlanDuration = (planId) => {
    const plan = chatPlan?.find((plan) => plan.id === planId);
    return plan ? plan.duration : "Unknown";
  };

  useEffect(() => {
    const interval = setInterval(fetchChatUsers, 2000);
    return () => clearInterval(interval);
  }, [stackholderId, chatPlan,activeTab]);

  useEffect(() => {
    const storedPlanType = sessionStorage.getItem("planType");
    const storedPlanId = sessionStorage.getItem("planId");
    const storedStartTime = sessionStorage.getItem("startTime");
    const storedEndTime = sessionStorage.getItem("endTime");
    const storedActiveUserMobile = sessionStorage.getItem("activeUserMobile");
    const storedPaidPlanId = sessionStorage.getItem("paidPlanId");

    if (
      storedPlanType &&
      storedPlanId &&
      storedPaidPlanId &&
      storedStartTime &&
      storedEndTime &&
      storedActiveUserMobile
    ) {
      const now = Date.now();
      const timeLeft = Math.max(0, (storedEndTime - now) / 1000);

      setCurrentPlanType(storedPlanType);
      setCurrentPlanId(storedPlanId);
      setCurrentPaidPlanId(storedPaidPlanId);

      if (timeLeft > 0) {
        setCountdowns((prevCountdowns) => ({
          ...prevCountdowns,
          [storedActiveUserMobile]: Math.round(timeLeft),
        }));
        if (intervalRefs.current[storedActiveUserMobile]) {
          clearInterval(intervalRefs.current[storedActiveUserMobile]);
        }

        intervalRefs.current[storedActiveUserMobile] = setInterval(() => {
          const timeNow = Date.now();
          const newTimeLeft = Math.max(0, (storedEndTime - timeNow) / 1000);

          setCountdowns((prevCountdowns) => {
            if (newTimeLeft <= 0) {
              clearInterval(intervalRefs.current[storedActiveUserMobile]);
              delete intervalRefs.current[storedActiveUserMobile];

              const {
                [storedActiveUserMobile]: removedCountdown,
                ...remainingCountdowns
              } = prevCountdowns;

              // Clear countdowns when empty
              if (Object.keys(remainingCountdowns).length === 0) {
                sessionStorage.removeItem("planType");
                sessionStorage.removeItem("planId");
                sessionStorage.removeItem("paidPlanId");
                sessionStorage.removeItem("startTime");
                sessionStorage.removeItem("endTime");
                sessionStorage.removeItem("activeUserMobile");
                sessionStorage.removeItem("countdowns");

                setIsSendMessageDisabled(true);
              } else {
                sessionStorage.setItem(
                  "countdowns",
                  JSON.stringify(remainingCountdowns)
                );
              }

              return remainingCountdowns;
            }

            const updatedCountdowns = {
              ...prevCountdowns,
              [storedActiveUserMobile]: Math.round(newTimeLeft),
            };

            sessionStorage.setItem(
              "countdowns",
              JSON.stringify(updatedCountdowns)
            );
            return updatedCountdowns;
          });
        }, 1000);
      } else {
        setIsSendMessageDisabled(true);
      }
    }
  }, []);

  useEffect(() => {
    const connectToSignalR = async (user) => {
      if (!user) return;

      const receiver = user.mobileNumber;
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(
          `https://copartners.in:5137/chathub?username=${encodeURIComponent(
            email
          )}&chatPartnerUsername=${encodeURIComponent(receiver)}`
        )
        .withAutomaticReconnect()
        .build();

      connection.on(
        "ReceiveMessage",
        (
          user,
          message,
          planType,
          planId,
          paidPlanId,
          startDateTime,
          endDateTime
        ) => {
          console.log(
            "Message received from:",
            user,
            message,
            planId,
            planType,
            paidPlanId
          );

          const userName =
            chatUserList.find(
              (chatUser) => chatUser.mobileNumber === user
            )?.chatUserName || "Unknown User";

          // Always update unseen messages count
          setUnseenMessagesCount((prevCounts) => {
            const updatedCounts = {
              ...prevCounts,
              [user]: (prevCounts[user] || 0) + 1,
            };
            localStorage.setItem(
              "unseenMessagesCount",
              JSON.stringify(updatedCounts)
            );
            return updatedCounts;
          });

          // Always show a notification for new messages
          toast.info(`New message received from ${userName}`, {
            position: "top-right",
            autoClose: 5000,
          });

          // If a user is selected and the message is from the active user
          if (activeUser && user === activeUser.mobileNumber) {
            sessionStorage.setItem("planType", planType);
            sessionStorage.setItem("planId", planId);
            sessionStorage.setItem("paidPlanId", paidPlanId);

            setCurrentPlanType(planType);
            setCurrentPlanId(planId);
            setCurrentPaidPlanId(paidPlanId);

            const newMessage = {
              _id: chatMessages.length + 1,
              isOwnSender: false,
              sender: user,
              dateCreated: new Date(),
              type: "text",
              payload: { text: message },
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              planType: planType,
              planId: planId,
              paidPlanId: paidPlanId,
            };

            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setConversations((prevConversations) => {
              const updatedConversations = { ...prevConversations };
              if (!updatedConversations[user]) {
                updatedConversations[user] = [];
              }
              updatedConversations[user].push(newMessage);
              return updatedConversations;
            });

            if (planType === "D" || (chatPlan && chatPlan.id === planId)) {
              startCountdown(newMessage, user);
            }

            setIsSendMessageDisabled(false);
            scrollToBottom();
          }
        }
      );

      connection.on("LoadPreviousMessages", (messages) => {
        const formattedMessages = messages.map((message) => {
          const newMessage = {
            _id: message.id,
            isOwnSender: message.sender === email,
            sender: message.sender,
            dateCreated: new Date(message.timestamp),
            type: "text",
            payload: { text: message.content },
            planId: message.planId,
            planType: message.planType,
            paidPlanId: message.paidPlanId,
          };

          if (message.planId && message.planType && message.paidPlanId) {
            sessionStorage.setItem("planId", message.planId);
            sessionStorage.setItem("planType", message.planType);
            sessionStorage.setItem("paidPlanId", message.paidPlanId);

            setCurrentPlanType(message.planType);
            setCurrentPlanId(message.planId);
            setCurrentPaidPlanId(message.paidPlanId);
          }

          return newMessage;
        });

        console.log("My Data", formattedMessages);

        setChatMessages(formattedMessages);
        setConversations((prevConversations) => {
          const updatedConversations = { ...prevConversations };
          if (activeUser) {
            updatedConversations[activeUser.mobileNumber] = formattedMessages;
          }
          return updatedConversations;
        });

        setLoading(false);
        scrollToBottom();
      });

      connection.onreconnecting(() => {
        console.log("Reconnecting...");
      });
      connection.onreconnected(() => {
        console.log("Connected!");
      });
      connection.onclose(async () => {
        console.log("Disconnected. Attempting to reconnect...");
        await startConnection(connection);
      });

      await startConnection(connection);
      connectionRef.current[receiver] = connection;
    };

    const startConnection = async (connection) => {
      try {
        await connection.start();
        console.log("Connected to the SignalR hub!");
      } catch (err) {
        console.log("Error starting connection: ", err.toString());
        setTimeout(() => startConnection(connection), 5000);
      }
    };

    const handleActiveUserChange = async () => {
      if (activeUser && connectionRef.current[activeUser.mobileNumber]) {
        await connectionRef.current[activeUser.mobileNumber].stop();
        delete connectionRef.current[activeUser.mobileNumber];
      }
      setChatMessages([]);
      setLoading(true);
      if (activeUser) {
        await connectToSignalR(activeUser);

        // Reset unseen message count for the selected user
        setUnseenMessagesCount((prevCounts) => {
          const updatedCounts = { ...prevCounts, [activeUser.mobileNumber]: 0 };
          localStorage.setItem(
            "unseenMessagesCount",
            JSON.stringify(updatedCounts)
          );
          return updatedCounts;
        });
      }
    };

    handleActiveUserChange();
  }, [activeUser]);

  const startCountdown = (message, user) => {
    const mobileNumber = user.mobileNumber;

    if (!chatPlan && message.planType !== "D") {
      console.log(
        "No chat plan found or planType is not 'D'. Countdown not started."
      );
      return;
    }

    let durationInMinutes;

    if (message.planType === "D") {
      durationInMinutes = 2;
    } else {
      const plan = chatPlan.find((p) => p.id === message.planId);
      if (!plan) {
        console.log("No matching plan found for Plan ID:", message.planId);
        return;
      }
      durationInMinutes = plan.duration;
    }

    if (countdowns[mobileNumber] !== undefined) {
      console.log("Countdown already running for user:", mobileNumber);
      return;
    }

    const durationInSeconds = durationInMinutes * 60;
    const startTime = Date.now();
    const endTime = startTime + durationInSeconds * 1000;

    setCountdowns((prevCountdowns) => {
      const updatedCountdowns = {
        ...prevCountdowns,
        [mobileNumber]: durationInSeconds,
      };
      sessionStorage.setItem("countdowns", JSON.stringify(updatedCountdowns));
      sessionStorage.setItem("startTime", startTime);
      sessionStorage.setItem("endTime", endTime);
      sessionStorage.setItem("activeUserMobile", mobileNumber);
      return updatedCountdowns;
    });

    if (intervalRefs.current[mobileNumber]) {
      clearInterval(intervalRefs.current[mobileNumber]);
    }

    intervalRefs.current[mobileNumber] = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, (endTime - now) / 1000);

      setCountdowns((prevCountdowns) => {
        if (timeLeft <= 0) {
          clearInterval(intervalRefs.current[mobileNumber]);
          delete intervalRefs.current[mobileNumber];

          const { [mobileNumber]: removedCountdown, ...remainingCountdowns } =
            prevCountdowns;

          // Clear session storage when countdowns is empty
          if (Object.keys(remainingCountdowns).length === 0) {
            sessionStorage.removeItem("planType");
            sessionStorage.removeItem("planId");
            sessionStorage.removeItem("paidPlanId");
            sessionStorage.removeItem("startTime");
            sessionStorage.removeItem("endTime");
            sessionStorage.removeItem("activeUserMobile");
            sessionStorage.removeItem("countdowns");

            setCurrentPlanType("");
            setCurrentPlanId("");
            setCurrentPaidPlanId("");

            setIsSendMessageDisabled(true);
          } else {
            sessionStorage.setItem(
              "countdowns",
              JSON.stringify(remainingCountdowns)
            );
          }

          return remainingCountdowns;
        }

        const updatedCountdowns = {
          ...prevCountdowns,
          [mobileNumber]: Math.round(timeLeft),
        };

        sessionStorage.setItem("countdowns", JSON.stringify(updatedCountdowns));
        return updatedCountdowns;
      });
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isSendMessageDisabled && messageInput.trim() !== "") {
      const receiver = activeUser.mobileNumber;
      const planType = currentPlanType;
      const planId = currentPlanId;
      const paidPlanId = currentPaidPlanId;

      const newMessage = {
        _id: chatMessages.length + 1,
        isOwnSender: true,
        sender: email,
        dateCreated: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        payload: { text: messageInput },
        planType: planType,
        planId: planId,
        paidPlanId: paidPlanId,
      };

      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setConversations((prevConversations) => {
        const updatedConversations = { ...prevConversations };
        if (!updatedConversations[receiver]) {
          updatedConversations[receiver] = [];
        }
        // updatedConversations[receiver].push(newMessage);
        return updatedConversations;
      });

      console.log("Sending message with parameters:", {
        email,
        receiver,
        message: messageInput,
        planType,
        planId,
        paidPlanId,
      });

      if (connectionRef.current[activeUser.mobileNumber]) {
        try {
          await connectionRef.current[activeUser.mobileNumber].invoke(
            "SendMessage",
            email,
            receiver,
            messageInput,
            planType,
            planId,
            paidPlanId
          );
        } catch (err) {
          console.error("SignalR Send Message Error: ", err.message);
          toast.error("Failed to send message. Please try again.", {
            position: "top-right",
          });
        }
      }

      startCountdown(newMessage, activeUser);

      setMessageInput("");
      scrollToBottom();
    }
  };

  const handleActiveClick = () => {
    setActiveTab("Active");
    setActiveSubTab("Free");
    setShowHistoryButtons(false);
    fetchChatUsers(); // Fetch data only when Active tab is clicked
  };
  
  const handleHistoryClick = () => {
    setActiveTab("History");
    setActiveSubTab("PremiumHistory");
    setShowHistoryButtons(true);
    fetchChatUsers(); // Fetch data only when History tab is clicked
  };  

  const selectUser = (user) => {
    setActiveUser(user);
    setLoading(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Filter chatUserList based on activeSubTab
  const filteredChatUserList = chatUserList.filter((user) => {
    if (activeSubTab === "Premium") {
      return user.planType === "P";
    } else if (activeSubTab === "Free") {
      return user.planType === "D" || user.planType === "F";
    }
    return true; // Default case, if needed
  });

  return (
    <div className="xl:pl-[18rem] md:pl-[16rem] pl-[1rem] md:py-[3rem] py-[2rem] bg-gradient min-h-screen">
      <div
        className={`flex ${
          smallScreen ? "flex-col" : "flex-row"
        } bg-[#272F3D] p-4 rounded-[18px] xl:w-[1520px] md:w-[1100px] w-[360px] gap-12`}
      >
        {(!smallScreen || !activeUser) && (
          <div className="w-[300px] h-[560px] bg-[#272F3D]">
            <div className="flex flex-col gap-4 justify-between">
              <div className="flex gap-4 md:ml-[1px] ml-0 bg-white p-2 w-[330px] rounded-[12px]">
                <div
                  className={`w-[70px] cursor-pointer h-[40px] text-center flex items-center justify-center rounded-[10px] text-black ${
                    activeTab === "Active"
                      ? "bg-blue-500 text-white font-[600] font-inter text-[12px]"
                      : "bg-transparent font-[600] font-inter text-[12px]"
                  }`}
                  onClick={handleActiveClick}
                >
                  Chats
                </div>
                <div
                  className={`w-[70px] cursor-pointer h-[40px] text-center flex items-center justify-center rounded-[10px] text-black ${
                    activeTab === "History"
                      ? "bg-blue-500 text-white font-[600] font-inter text-[12px]"
                      : "bg-transparent font-[600] font-inter text-[12px]"
                  }`}
                  onClick={handleHistoryClick}
                >
                  History
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <ul className="flex flex-row md:gap-10 gap-4">
                  {activeTab === "Active" && (
                    <>
                    <li
                        className={`w-[70px] cursor-pointer h-[40px] text-center flex items-center justify-center rounded-[10px] border-solid border-[1px] border-white text-black ${
                          activeSubTab === "Free"
                            ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                            : "bg-transparent text-white font-[600] font-inter text-[12px]"
                        }`}
                        onClick={() => setActiveSubTab("Free")}
                      >
                        Free
                      </li>
                      <li
                        className={`w-[70px] cursor-pointer h-[40px] text-center flex items-center justify-center rounded-[10px] border-solid border-[1px] border-white text-black ${
                          activeSubTab === "Premium"
                            ? "bg-[#ffffff] font-[600] font-inter text-[12px]"
                            : "bg-transparent text-white font-[600] font-inter text-[12px]"
                        }`}
                        onClick={() => setActiveSubTab("Premium")}
                      >
                        Premium
                      </li>
                      
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="w-[362px] max-h-[500px] flex gap-4 flex-col mt-4 overflow-y-auto">
              {filteredChatUserList.map((users) => {
                const isActive =
                  activeUser && activeUser.mobileNumber === users.mobileNumber;
                return (
                  <div
                    key={users.mobileNumber}
                    className={`flex max-h-[490px] flex-row gap-4 cursor-pointer ${
                      isActive ? "bg-[#2E374B]" : "bg-transparent"
                    } p-2 rounded`}
                    onClick={() => selectUser(users)}
                  >
                    <img
                      src={users.chatUserImg}
                      alt="User Name"
                      className="w-[58px] h-[58px] rounded-full"
                    />
                    <div className="flex flex-col w-[267px] h-[57px]">
                      <div className="flex gap-6">
                        <span className="font-inter font-[400] text-[17.5px] text-white">
                          {users.chatUserName}
                        </span>
                        {unseenMessagesCount[users.mobileNumber] > 0 && (
                          <span className="bg-white text-black rounded-full w-[30px] flex items-center justify-center font-[600]">
                            {unseenMessagesCount[users.mobileNumber]}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <span className="text-white opacity-[50%] font-[500] font-inter text-[15px] leading-[23px]">
                          {users.planTypeLabel} ({users.duration} mins)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="w-full md:h-[600px] h-auto flex flex-col">
          {activeUser ? (
            <>
              <div className="w-[702px] h-[83px] flex justify-between flex-row items-center">
                <div className="h-[65px] flex flex-row gap-4">
                  {smallScreen && (
                    <button
                      onClick={() => setActiveUser(null)}
                      className="text-white mb-4"
                    >
                      <img
                        src={backImg}
                        className="w-[30px] h-[30px]"
                        alt="back"
                      />
                    </button>
                  )}
                  <img
                    src={activeUser.chatUserImg}
                    alt="CHAT_USER"
                    className="w-[58px] h-[58px] rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-[500] text-[20px] leading-[32px]">
                      {activeUser.chatUserName}
                    </span>
                    <div className="flex flex-row gap-2 items-center">
                      <span className="font-[500] text-[17px] leading-[28px] text-white opacity-[50%]">
                        Duration:
                      </span>
                      <span className="font-[500] text-[17px] text-[#28A7E7]">
                        {countdowns[activeUser.mobileNumber] !== undefined
                          ? formatTime(countdowns[activeUser.mobileNumber])
                          : "Start Chat"}
                      </span>
                    </div>
                  </div>
                </div>
                <button>
                  <img
                    src={threeDots}
                    alt="options"
                    className="w-[27px] h-[27px]"
                  />
                </button>
              </div>

              <div
                className="bg-[#222A38] w-full h-[500px] rounded-[18px] flex-grow overflow-y-auto"
                style={{ maxHeight: "100%" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading">
                      <div className="bounceball"></div>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <ChatBubble
                      key={message._id}
                      isOwnSender={message.isOwnSender}
                      _id={message._id}
                      sender={message.sender}
                      dateCreated={message.dateCreated}
                      type={message.type}
                      payload={message.payload}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="w-full h-[58px] bg-[#272F3D] rounded-[6px] flex items-center px-2 py-2">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="flex-grow h-[43px] bg-[#1F2735] text-white placeholder-gray-400 px-4 rounded-[6px] focus:outline-none border-none"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isSendMessageDisabled) {
                      handleSendMessage(e);
                    }
                  }}
                  disabled={isSendMessageDisabled}
                />
                <button
                  className="ml-2"
                  onClick={handleSendMessage}
                  disabled={isSendMessageDisabled}
                >
                  <img
                    src={sendChat}
                    alt="Send"
                    className="md:w-[35px] w-[23px] h-[23px] md:h-[35px]"
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-[#222A38] w-full h-full rounded-[18px] items-center justify-center md:flex hidden">
              <span className="text-white text-[20px] font-[500]">
                Select a user to start chatting
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsHistory;
