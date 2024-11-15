import React, { useEffect, useRef, useState } from "react";
import Otp from "./Otp";
import { closeImg, signupBg } from "../assets";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";
import axios from "axios";

const SignUp = ({ onComplete }) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [timer, setTimer] = useState(25);
  const navigate = useNavigate();
  const signedUp = sessionStorage.getItem("visitedSignUp", "true");
  const inputRef = useRef(null); // Reference for the input field
  const continueButtonRef = useRef(null);

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

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Automatically click the continue button when mobile number length is 10
    if (mobile.length === 10 && continueButtonRef.current) {
      continueButtonRef.current.click();
    }
  }, [mobile]);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);

    if (value.length > 10) {
      setValidationMessage("Mobile number must have exactly 10 digits");
    } else {
      setValidationMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      setError("Mobile number should have exactly 10 digits.");
      return;
    }
    setError("");
    setLoading(true);

    const postData = {
      countryCode: "IN",
      mobileNumber: mobile,
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
      mobileNumber: mobile,
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
      responseUser();
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    } finally {
      setLoading(false);
    }
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

  const responseUser = async () => {
    try {
      const userData = {
        mobileNumber: mobile,
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
        handleRemoveCookies();
        navigate("/");
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
          phoneNumber: mobile,
        });
        sendCampaignMessage(mobile);
        sendSignupMessage(mobile);
        // navigate(window.location.pathname);
        try {
          if (typeof onComplete === "function") {
            onComplete();
          }
        } catch (error) {
          console.error("Error in onComplete function:", error);
        }
        handleRemoveCookies();
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    const postData = {
      countryCode: "IN",
      mobileNumber: mobile,
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
    return !mobile;
  };

  const handleClosePopups = () => {
    setShowOtp(false);
  };

  const handleClose = () => {
    if (!signedUp) {
      sessionStorage.setItem("visitedSignUp", "true");
      navigate("/");
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    setShowOtpField(false);
  };

  return (
    <>
      <div
        className="h-screen"
        // style={{
        //   backgroundImage: `url(${signupBg})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        // }}
      ></div>
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 w-screen h-screen`}
      >
        <div className="bg-white border-2 border-dashed border-black m-4 p-6 rounded-xl w-96 relative text-center shadow-lg">
          <div className="absolute top-3 right-3 text-right">
            <button
              onClick={() => {
                handleClose();
                scrollToTop();
              }}
              className="text-gray-400 w-8 h-8 cursor-pointer hover:text-black"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-black">Login/Signup</h2>
          </div>
          <p className="text-gray-700 text-center mb-4">
            Get access to daily free calls from India's SEBI Registered Research
            Analysts.
          </p>

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
          </div>

          {/* Form Content */}
          <div className="pb-6">
            <div className="mb-4">
              <input
                ref={inputRef}
                type="number"
                className="w-full p-4 border border-gray-300 rounded-xl mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Enter Your Number"
                value={mobile}
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
                onClick={handleSubmit}
                className="w-full py-4 md:text-lg text-base mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
