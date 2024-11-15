import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./style";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Dashboard, Subscription, Wallet, Setting } from "./components";
import SignUp from "./components/SignUp";
import ForgetPassword from "./components/ForgetPassword";
import NewPassword from "./components/NewPassword";
import ConfirmPassword from "./components/ConfirmPassword";
import AnalysisBoard from "./components/AnalysisBoard";
import Webinar from "./components/Webinar";
import Chats from "./components/Chats";
import ChatsHistory from "./components/ChatsHistory";
import TelegramChannel from "./components/TelegramChannel";
import StandardQues from "./components/StandardQues";
import CallPost from "./components/CallPost/CallPost";
import FeedPost from "./components/FeedPost/FeedPost";
import { useAuth } from "./authContext";
import ProtectedRoute from "./ProtectedRoute";
import api from "./api";
import SignalRCallMessage from "./components/SignalRCallMessage";
import SignalRCallMessage2 from "./components/SignalRCallMessage2";
import LiveFeature from "./components/CallPost/LiveFeature/LiveFeature";

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(!isSmallScreen);
  const [telegramData, setTelegramData] = useState([]);
  const location = useLocation();
  const signUp = sessionStorage.getItem('visitedSignUp');
  const isSignUpPage = location.pathname === "/signup";
  const isResetPage = location.pathname === "/reset";
  const isNewPasswordPage = location.pathname === "/forget";
  const isConfirmPasswordPage = location.pathname === "/set-new-password";
  const { authState } = useAuth();
  const stackholderId = authState.stackholderId;
  const token = authState.token;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const stackholderId = authState.stackholderId;
      const TELEGRAM_CHAT_API = `/TelegramMessage/${stackholderId}?userType=RA&page=1&pageSize=100000`;

      api.get(TELEGRAM_CHAT_API)
        .then(response => {
          setTelegramData(response.data.data);
        })
        .catch(error => {
          console.error("Error fetching the data", error);
        });
    }
  }, [authState]);

  return (
    <div className={`bg-gradient overflow-hidden`}>
      <div className="flex">
        <div className="flex-grow">
          <>
            {!isSignUpPage && !isResetPage && !isNewPasswordPage && !isConfirmPasswordPage && (
              <Navbar activeTab={activeTab} toggleSidebar={toggleSidebar} />
            )}
            {!isSignUpPage && !isResetPage && !isNewPasswordPage && !isConfirmPasswordPage && showSidebar && (
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowSidebar={setShowSidebar}
                telegramData={telegramData}
              />
            )}
            <Routes>
  <Route
    path="/"
    element={<ProtectedRoute element={<Dashboard token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/analysis_board"
    element={<ProtectedRoute element={<AnalysisBoard token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/Live-Feature"
    element={<ProtectedRoute element={<LiveFeature token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/call_post"
    element={<ProtectedRoute element={<CallPost token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/feed_post"
    element={<ProtectedRoute element={<FeedPost token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/subscription"
    element={<ProtectedRoute element={<Subscription token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/wallet"
    element={<ProtectedRoute element={<Wallet token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/chats"
    element={<ProtectedRoute element={<Chats token={token} stackholderId={stackholderId} />} />}
  />
  {/* {telegramData.length > 0 && (
    <Route
      path="/telegram_channel"
      element={<ProtectedRoute element={<TelegramChannel token={token} stackholderId={stackholderId} />} />}
    />
  )} */}
  <Route
    path="/standard_questions"
    element={<ProtectedRoute element={<StandardQues token={token} stackholderId={stackholderId} />} />}
  />
  <Route
    path="/setting"
    element={<ProtectedRoute element={<Setting token={token} stackholderId={stackholderId} />} />}
  />

  {/* Public Routes */}
  <Route
    path="/signup"
    element={<SignUp setIsSignedUp={() => sessionStorage.setItem('visitedSignUp', 'true')} />}
  />
  <Route path="/chat" element={<SignalRCallMessage token={token} stackholderId={stackholderId} />} />
  <Route path="/chatPremium" element={<SignalRCallMessage2 token={token} stackholderId={stackholderId} />} />
  <Route path="/reset" element={<ForgetPassword token={token} stackholderId={stackholderId} />} />
  <Route path="/forget" element={<NewPassword token={token} stackholderId={stackholderId} />} />
  <Route path="/set-new-password" element={<ConfirmPassword token={token} stackholderId={stackholderId} />} />
</Routes>
          </>
        </div>
      </div>
    </div>
  );
}

export default App;
