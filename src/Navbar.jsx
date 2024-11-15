// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import styles from "./style";
import {
  searchIcon,
  notificationSlider,
  notification,
  dummyUser,
  menu,
} from "./assets";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import api from "./api";

const Navbar = ({ activeTab, toggleSidebar }) => {
  const [showTab, setShowTab] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [openNotification, setOpenNotification] = useState(false);
  const [isCoPartner, setIsCoPartner] = useState(false);
  const [myCard, setMyCard] = useState(null);

  const stackholderId = sessionStorage.getItem("stackholderId");

  const location = useLocation(); // Step 2: Get current location

  useEffect(() => {
    if (stackholderId) {
      api
        .get(`/Experts/${stackholderId}`)
        .then((res) => {
          setMyCard(res.data.data);
          setIsCoPartner(res.data.data.isCoPartner);
        })
        .catch((error) => {
          console.error("Error fetching expert data:", error);
        });
    }
  }, [stackholderId]);

  const handleOpenNotification = () => setOpenNotification((cur) => !cur);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabClick = (tab) => {
    setShowTab(tab);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Step 3: Define paths where "Personal" should be hidden
  const hidePersonalPaths = ["/live-feature"];

  // Step 4: Determine if "Personal" should be hidden based on current path
  const shouldHidePersonal = hidePersonalPaths.includes(location.pathname);

  return (
    <div
      className={`fixed flex w-full justify-center items-center py-[1rem] ${
        isScrolled ? styles.transparentNavbar : styles.scrolledNavbar
      }`}
    >
      <nav className="flex md:w-[600px] md:ml-[15rem] xl:ml-[20rem] ml-8">
        <div
          onClick={scrollToTop}
          className="flex md:flex-row flex-col items-center sm:flex-col gap-[4px] md:gap-20 xl:gap-40"
        >
          {isSmallScreen ? (
            <div className="flex gap-12 items-center md:w-[360px] w-[380px] h-[50px]">
              <Link to="/setting">
                <img
                  src={myCard && myCard.expertImagePath}
                  alt="LoginUser"
                  className="w-[50px] h-[50px] bg-black rounded-full"
                />
              </Link>

              {/* Conditionally render "Personal" or "Copartner" button */}
              {!shouldHidePersonal && (
                <div className="w-[150px] h-[40px] rounded-[24px] overflow-hidden flex">
                  {isCoPartner ? (
                    <button
                      className={`w-full py-2 font-inter font-[600] text-[16px] leading-[19px] text-center bg-white`}
                      onClick={() => handleTabClick("copartner")}
                    >
                      Copartner
                    </button>
                  ) : (
                    <button
                      className={`w-full py-2 font-inter font-[600] text-[16px] leading-[19px] text-center bg-white`}
                      onClick={() => handleTabClick("personal")}
                    >
                      Personal
                    </button>
                  )}
                </div>
              )}

              <button onClick={toggleSidebar} className="md:ml-0 ml-[20px]">
                <img
                  src={menu}
                  alt="Menu"
                  className="w-[50px] h-[50px] rounded-full"
                />
              </button>
            </div>
          ) : (
            <div className="w-[265px] h-[50px] rounded-[24px] overflow-hidden flex">
              {!shouldHidePersonal && (
                <>
                  {isCoPartner ? (
                    <button
                      className={`w-full py-2 font-inter font-[600] text-[16px] leading-[19px] text-center bg-white`}
                      onClick={() => handleTabClick("copartner")}
                    >
                      Copartner
                    </button>
                  ) : (
                    <button
                      className={`w-full py-2 font-inter font-[600] text-[16px] leading-[19px] text-center bg-white`}
                      onClick={() => handleTabClick("personal")}
                    >
                      Personal
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {isSmallScreen ? (
            <div className="flex md:mr-8 mr-10 gap-[1rem]">
              {/* Search and Notification components can be added here */}
              {/* Example: Notification Icon */}
              <button onClick={handleOpenNotification} className="relative">
                <img src={notification} alt="Notification" className="w-6 h-6" />
                {openNotification && (
                  <div className="absolute top-8 right-0 bg-white text-black p-2 rounded shadow-lg">
                    {/* Notification Content */}
                    Notifications go here.
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="flex w-[540px] ml-[26rem] gap-[2rem]">
              {/* Search and Notification components can be added here */}
              {/* Example: Notification Icon */}
              <button onClick={handleOpenNotification} className="relative">
                <img src={notification} alt="Notification" className="w-6 h-6" />
                {openNotification && (
                  <div className="absolute top-8 right-0 bg-white text-black p-2 rounded shadow-lg">
                    {/* Notification Content */}
                    Notifications go here.
                  </div>
                )}
              </button>

              <Link to="/setting">
                <img
                  src={myCard && myCard.expertImagePath}
                  alt="LoginUser"
                  className="bg-black flex items-center justify-center w-[50px] h-[50px] rounded-full"
                />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;