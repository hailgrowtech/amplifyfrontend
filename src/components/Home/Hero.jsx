import React, { useState, useEffect, useContext } from "react";
import styles from "../../style";
import { arrow, closeImg, telegram, userBck, stars } from "../../assets";
import Expertise from "./Expertise";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useUserData } from "../../constants/context";
import { useUserSession } from "../../constants/userContext";
import KYCPopup from "../Subscription RA/KYCPopup";
import { SubscriptionContext } from "../../constants/subscriptionContext";
import SignUp from "../SignUp";
import { motion } from "framer-motion";

const Hero = ({ hasVisitedSignUp, userId, token }) => {
  const [showDialog, setShowDialog] = useState(false);
  const userData = useUserData();
  const dataUser = useUserSession().userData;
  const [nameData, setNameData] = useState("");
  const [emailData, setEmailData] = useState("");
  const [showKYCDialog, setShowKYCDialog] = useState(false);
  const { transactionTable } = useContext(SubscriptionContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  useEffect(() => {
    const apid = searchParams.get("apid");
    const raid = searchParams.get("raid");
    const landingPageUrl = searchParams.get("apurl");

    if (apid) {
      sessionStorage.setItem("apid", apid);
    }

    if (raid) {
      sessionStorage.setItem("raid", raid);
    }

    if (landingPageUrl) {
      sessionStorage.setItem("landingPageUrl", landingPageUrl);
    }
  }, [searchParams]);

  const getExpertType = (typeId) => {
    switch (typeId) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Futures & Options";
      default:
        return "Unknown";
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUserSave = async (e) => {
    e.preventDefault();

    const patchData = [
      {
        path: "/name",
        op: "replace",
        value: nameData,
      },
      {
        path: "/email",
        op: "replace",
        value: emailData,
      },
    ];

    try {
      const resUser = await fetch(
        `https://copartners.in:5131/api/User?Id=${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(patchData),
        }
      );

      if (!resUser.ok) {
        throw new Error(`HTTP error! status: ${resUser.status}`);
      }

      const data = await resUser.json();

      if (!data.isSuccess) {
        console.log("Error messages:", data.errorMessages);
      } else {
        console.log("Success! User saved successfully");
        setShowDialog(false);
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (dataUser) {
        if (!dataUser?.name || !dataUser?.email) {
          setShowDialog(true);
        } else {
          sessionStorage.setItem("isDialogClosed", "true");
          setShowDialog(false);
        }
      }
    };

    const KYCCheck = () => {
      if (
        (dataUser?.isKYC === null || dataUser?.isKYC === false) &&
        transactionTable.length > 0
      ) {
        setShowKYCDialog(true);
      } else {
        setShowKYCDialog(false);
      }
    };

    const isDialogClosed = sessionStorage.getItem("isDialogClosed");

    if (dataUser) {
      setNameData(dataUser.name || "");
      setEmailData(dataUser.email || "");
    }

    if (!hasVisitedSignUp && isDialogClosed !== "true") {
      fetchUserData();
    }

    // if (dataUser && transactionTable && dataUser?.name && dataUser?.email) {
    //   KYCCheck();
    // }
  }, [dataUser, hasVisitedSignUp, transactionTable]);

  useEffect(() => {
    if (userData.length > 0) {
      // setLoading(false);
    }
  }, [userData]);

  const handleClosed = (e) => {
    e.stopPropagation();
    sessionStorage.setItem("isDialogClosed", "true");
    setShowDialog(false);
  };

  const handleTelegram = (e, link) => {
    e.stopPropagation();
    if (userId) {
      window.open(link);
    } else {
      setShowSignUp(true);
    }
  };

  const handleSignUpComplete = (e, link) => {
    e.stopPropagation();
    setShowSignUp(false);
    window.open(link, "_blank");
    window.location.reload();
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slicedData = isMobile ? userData.slice(0, 4) : userData.slice(0, 3);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className={`flex md:flex-col ${styles.paddingX} flex-col ${styles.paddingY}`}
    >
      {showDialog && (
        <div className="fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center">
          <div className="md:w-[416px] md:h-[381px] w-[340px] h-[360px] flex flex-col gap-2 bg-white text-center p-8 rounded-lg shadow-lg">
            <button
              onClick={handleClosed}
              className="font-[700] text-[20px] flex md:ml-[20rem] ml-[15rem] z-50"
            >
              <img
                src={closeImg}
                alt="CloseIcon"
                className="w-[32px] h-[32px] flex items-end"
              />
            </button>
            <div className="flex flex-col md:w-[342px] md:h-[69px] flex flex-row items-center gap-[1rem] md:mt-[-1rem] mt-[-2rem] pb-4">
              <h2 className="text-[24px] leading-[24px] font-[500] text-gray-900 z-10">
                Profile Details
              </h2>
              <p className="text-gray-700 font-[400] text-[16px] leading-[16px]">
                Please fill the below data.
              </p>
            </div>
            <div className="flex flex-col md:w-[342px] md:h-[290px] md:gap-3 gap-5">
              <input
                onChange={(e) => setNameData(e.target.value)}
                value={nameData}
                type="text"
                placeholder="Enter Your Name"
                className="border border-solid border-gray-300 rounded-[12px] md:w-[342px] h-[60px] text-center p-1 bg-white text-start md:pl-[15px] pl-[10px]"
                style={{ color: "gray-900" }}
              />
              <input
                onChange={(e) => setEmailData(e.target.value)}
                type="email"
                value={emailData}
                placeholder="Enter Your Email ID"
                className="border border-solid border-gray-300 rounded-[12px] md:w-[342px] h-[60px] text-center p-1 bg-white text-start md:pl-[15px] px-[15px]"
                style={{ color: "gray-900" }}
              />
              <button
                onClick={handleUserSave}
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-[500] md:w-[342px] md:h-[60px] h-[60px] text-[16px] rounded-[12px]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showKYCDialog && <KYCPopup />}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className={`${styles.flexStart} flex-col relative`}
      >
        <div className="flex flex-col justify-between pb-4">
          <span
            className="font-inter md:text-5xl text-3xl text-[#24243F] md:w-full md:h-full font-[700]"
          >
            Get Daily Calls from SEBI Registered Research Analysts
          </span>
          {/* <p className="font-inter md:w-[876px] md:h-[28px] sm:w-[360px] sm:h-[17px] text-gray-700 md:text-[18px] text-[13px] md:leading-[28px] leading-[16px]">
            Get partnered with our SEBI Registered Research Analysts to start
            your profitable trading journey.
          </p> */}
        </div>
      </motion.div>
      <Expertise userId={userId} />
    </motion.div>
  );
};

export default Hero;
