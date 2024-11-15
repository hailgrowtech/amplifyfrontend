import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

const LoginSignupPopup = ({
  onComplete,
  onClose,
  subscriptionIdParams,
  freeCalls,
  liveChatPop,
  planMonthlyPrice,
}) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [timer, setTimer] = useState(25);
  const inputRef = useRef(null);
  const continueButtonRef = useRef(null);
  const navigate = useNavigate();

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
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmM5ZWNiOTNhMmJkMGFlZTVlMGZiMiIsIm5hbWUiOiJIYWlsZ3JvIHRlY2ggc29sdXRpb25zIHB2dC4gbHRkLiIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjJjOWVjYjkzYTJiZDBhZWU1ZTBmYWIiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNDIwMDI2N30.fQE69zoffweW2Z4_pMiXynoJjextT5jLrhXp6Bh1FgQ",
      campaignName: "⁠new_signup_1 (On Sign Up) (TEXT)",
      destination: phoneNumber,
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
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
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

  const responseUser = async (token) => {
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
          "Authorization": `Bearer ${token}`
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

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);

    if (value.length > 10) {
      setValidationMessage("Mobile number must have more than 10 digits");
    } else {
      setValidationMessage("");
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10 || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError("Mobile number should have exactly 10 digits.");
      return;
    }
    setError("");
    setLoading(true);

    const postData = {
      countryCode: "IN",
      mobileNumber: mobileNumber,
      otp: "",
    };

    try {
      const response = await fetch(
        "https://copartners.in:5181/api/SignIn/GenerateOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setShowOtpField(true);
      setTimer(25); // Reset OTP resend timer
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setError("Failed to send OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setValidationMessage("");
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    setLoading(true);

    const postData = {
      countryCode: "IN",
      mobileNumber: mobileNumber,
      otp: otp,
    };

    try {
      const response = await fetch(
        "https://copartners.in:5181/api/SignIn/ValidateOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();
      if (!data.isSuccess) {
        setError(data.errorMessages);
        return;
      }
      const token = data.data.token;
      localStorage.setItem("authToken", token);
      responseUser(token);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    const postData = {
      countryCode: "IN",
      mobileNumber: mobileNumber,
      otp: "",
    };
    try {
      const response = await fetch(
        "https://copartners.in:5181/api/SignIn/GenerateOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();
      if (!data.isSuccess) {
        setError("Failed to resend OTP. Please try again.");
      } else {
        setValidationMessage("OTP has been resent. Please check your mobile.");
        setTimer(25); // Reset timer after resending OTP
      }
    } catch (error) {
      console.error(
        "There was a problem with the resend OTP operation:",
        error
      );
    }
  };

  const isFormEmpty = () => {
    return otp.trim() === "";
  };

  const handleBack = () => {
    setShowOtpField(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-sm border-2 border-dashed border-black bg-white rounded-xl shadow-lg mx-4">
        {/* Stepper */}
        <div className="flex justify-between bg-[#E8F6FF] rounded-t-lg items-center p-6">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center bg-white">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-green-500 text-[10px]">Login</span>
          </div>
          {!freeCalls && <div className="flex-1 flex justify-between items-center mx-2">
            <div className="border-t-2 border-dashed border-gray-300 w-full mb-3"></div>
          </div>}
          {!freeCalls && !liveChatPop && <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-500 text-[10px]">Payment</span>
          </div>}
          {!liveChatPop && <div className="flex-1 flex justify-between items-center mx-2">
            <div className="border-t-2 border-dashed border-gray-300 w-full mb-3"></div>
          </div>}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-500 text-[10px]">{freeCalls ? "Channel Link" : liveChatPop ? "Chat" : "Premium Link"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-4">
          {showOtpField ? (
            <button
              onClick={handleBack}
              className="text-gray-700 hover:text-gray-900"
            >
              <FiArrowLeft size={24} />
            </button>
          ) : (
            <span />
          )}
          {!showOtpField && (
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900"
            >
              <FiX size={24} />
            </button>
          )}
        </div>

        {/* Form */}
        <div className="pb-6 px-8">
          <h2 className="text-2xl font-semibold mb-4">Login/Signup</h2>
          <div className="mb-4">
            <input
              ref={inputRef}
              type="number"
              className="w-full p-4 border border-gray-300 rounded-xl mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter Your Number"
              value={mobileNumber}
              onChange={handleMobileChange}
              disabled={showOtpField}
              maxLength={10}
            />
          </div>

          {validationMessage && (
            <p className="text-green-500 mt-2">{validationMessage}</p>
          )}
          {error && (
            <div className="text-center text-red-500 mt-2">{error}</div>
          )}

          {showOtpField && (
            <div className="mb-4">
              <label className="block text-gray-700">Verify Your OTP</label>
              <input
                type="number"
                className="w-full p-4 border border-gray-300 rounded-xl mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Enter Your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              {/* {validationMessage && (
                <p className="text-green-500 mt-2">{validationMessage}</p>
              )}
              {error && (
                <div className="text-center text-red-500 mt-2">{error}</div>
              )} */}
              <button
                onClick={handleOtpSubmit}
                className={`w-full py-4 mt-4 md:text-lg text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 ${
                  isFormEmpty() || loading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isFormEmpty() || loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                className={`mt-2 text-black text-center w-full ${
                  timer > 0 ? "opacity-50" : ""
                } text-sm`}
                onClick={handleResendOTP}
                disabled={timer > 0}
              >
                Didn't get OTP?{" "}
                <span className="text-[#0081F1]">
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend"}
                </span>
              </button>
            </div>
          )}

          {!showOtpField && (
            <button
              onClick={handleContinue}
              className="w-full py-4 md:text-lg text-base mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600"
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPopup;
