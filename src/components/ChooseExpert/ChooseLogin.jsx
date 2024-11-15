// SignUpPopup.js
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SignUpPopup = ({ onComplete, onClose, subscriptionIdParams }) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [timer, setTimer] = useState(25);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const captureParams = () => {
      const params = new URLSearchParams(window.location.search);
      const apid = params.get("apid");
      const raid = params.get("raid");
      const landingPageUrl = params.get("apurl");

      if (apid) {
        sessionStorage.setItem("apid", apid);
        localStorage.setItem("apid", apid);
        Cookies.set("apid", apid, { expires: 7, path: "/" });
      }

      if (raid) {
        sessionStorage.setItem("raid", raid);
        localStorage.setItem("raid", raid);
        Cookies.set("raid", raid, { expires: 7, path: "/" });
      }

      if (landingPageUrl) {
        sessionStorage.setItem("landingPageUrl", landingPageUrl);
        localStorage.setItem("landingPageUrl", landingPageUrl);
        Cookies.set("landingPageUrl", landingPageUrl, {
          expires: 7,
          path: "/",
        });
      }
    };

    // Capture the params immediately
    captureParams();

    // Attach event listener for future URL changes
    window.addEventListener("popstate", captureParams);

    return () => {
      window.removeEventListener("popstate", captureParams);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const apid =
    Cookies.get("apid") ||
    localStorage.getItem("apid") ||
    sessionStorage.getItem("apid");
  const raid =
    Cookies.get("raid") ||
    localStorage.getItem("raid") ||
    sessionStorage.getItem("raid");
  const landingPageUrl =
    Cookies.get("landingPageUrl") ||
    localStorage.getItem("landingPageUrl") ||
    sessionStorage.getItem("landingPageUrl");

  const handleRemoveCookies = () => {
    Cookies.remove("apid", { path: "/" });
    Cookies.remove("raid", { path: "/" });
    Cookies.remove("landingPageUrl", { path: "/" });
    localStorage.removeItem("apid");
    localStorage.removeItem("raid");
    localStorage.removeItem("landingPageUrl");
  };

  const sendSignupMessage = async (phoneNumber) => {
    const url = "https://backend.aisensy.com/campaign/t1/api/v2";
    const data = {
      apiKey: "API_KEY_HERE",
      campaignName: "Sign Up Campaign",
      destination: phoneNumber,
    };
    try {
      await axios.post(url, data, { headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendCampaignMessage = async (phone) => {
    const url = "https://backend.aisensy.com/campaign/t1/api/v2";
    const data = {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmM5ZWNiOTNhMmJkMGFlZTVlMGZiMiIsIm5hbWUiOiJIYWlsZ3JvIHRlY2ggc29sdXRpb25zIHB2dC4gbHRkLiIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjJjOWVjYjkzYTJiZDBhZWU1ZTBmYWIiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNDIwMDI2N30.fQE69zoffweW2Z4_pMiXynoJjextT5jLrhXp6Bh1FgQ",
      campaignName: "singup_telegram_link(Just after signup campaign1)[TEXT]",
      destination: phone,
      userName: "Hailgro tech solutions pvt. ltd.",
      templateParams: [],
      source: "new-landing-page form",
      media: {},
      buttons: [],
      carouselCards: [],
      location: {},
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const responseUser = async () => {
    try {
      const userData = {
        mobileNumber: mobileNumber,
        referralMode: "CP",
        affiliatePartnerId: "",
        expertsID: "",
        landingPageUrl: "",
      };

      if (apid) {
        userData.referralMode = "AP";
        userData.affiliatePartnerId = apid;
        userData.landingPageUrl = landingPageUrl;
      } else if (raid) {
        userData.referralMode = "RA";
        userData.expertsID = raid;
      }

      const resUser = await fetch(`https://copartners.in:5131/api/User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log(userData);

      const data = await resUser.json();
      if (!data.isSuccess) {
        setError(data.errorMessages);
        console.log("Something");
        localStorage.setItem("userId", data.data.id);
        // navigate(window.location.pathname);
        try {
          if (typeof onComplete === "function") {
            onComplete();
          }
        } catch (error) {
          console.error("Error in onComplete function:", error);
        }
        subscriptionIdParams && navigate(`/${subscriptionIdParams}`);
        handleRemoveCookies();
        window.location.reload();
      } else {
        localStorage.setItem("userId", data.data.id);
        const userId = data.data.id;
        const scriptContent = `
      window.TrackierWebSDK.trackConv('copartner.gotrackier.com', '662b93eaeae1a03b602b9163', {"goal_value":"Registration","txn_id":"${userId}","is_iframe":true});
    `;
        const scriptElement = document.createElement("script");
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "signup",
          event_category: "User",
          event_action: "Signup",
          event_label: "Phone OTP Signup",
          phoneNumber: mobileNumber,
        });
        sendCampaignMessage(mobileNumber);
        sendSignupMessage(mobileNumber);
        // navigate(window.location.pathname);
        try {
          if (typeof onComplete === "function") {
            onComplete();
          }
        } catch (error) {
          console.error("Error in onComplete function:", error);
        }
        subscriptionIdParams && navigate(`/${subscriptionIdParams}`);
        handleRemoveCookies();
        window.location.reload();
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    const postData = { countryCode: "IN", mobileNumber, otp: "" };

    try {
      await fetch("https://copartners.in:5181/api/SignIn/GenerateOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      setShowOtpField(true);
      setTimer(25);
    } catch (error) {
      setError("Failed to send OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const postData = { countryCode: "IN", mobileNumber, otp };

    try {
      const response = await fetch("https://copartners.in:5181/api/SignIn/ValidateOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.isSuccess) {
        responseUser();
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (error) {
      setError("There was an error verifying OTP, please try again.");
    }
  };

  const handleResendOTP = async () => {
    const postData = { countryCode: "IN", mobileNumber, otp: "" };
    try {
      await fetch("https://copartners.in:5181/api/SignIn/GenerateOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      setTimer(25);
    } catch (error) {
      setError("Failed to resend OTP.");
    }
  };
  

  const handleBack = () => {
    setShowOtpField(false);
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-sm border-2 border-dashed border-black bg-white rounded-xl shadow-lg mx-4">
        <div className="flex justify-end py-1 pr-2 rounded-t-lg items-center">
          {/* <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full border-2 border-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-green-500 text-[10px]">Sign Up</span>
          </div> */}
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
            <FiX size={24} />
          </button>
        </div>

        <div className="pb-6 px-8">
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
          <input
            ref={inputRef}
            type="number"
            className="w-full p-4 border border-gray-300 rounded-xl mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter Your Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            disabled={showOtpField}
          />

          {error && <div className="text-red-500 mt-2">{error}</div>}
          {showOtpField ? (
            <div className="mb-4">
              <input
                type="number"
                className="w-full p-4 border border-gray-300 rounded-xl mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <button
                onClick={handleOtpSubmit}
                className={`w-full py-4 mt-4 text-[15px] md:text-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                className={`mt-2 text-sm text-center w-full ${
                  timer > 0 ? "opacity-50" : ""
                }`}
                onClick={handleResendOTP}
                disabled={timer > 0}
              >
                Resend OTP {timer > 0 ? `in ${timer}s` : ""}
              </button>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full py-4 mt-4 text-[15px] md:text-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl"
              disabled={mobileNumber.length === 0 || loading} // Disable if mobile number is empty
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPopup;
