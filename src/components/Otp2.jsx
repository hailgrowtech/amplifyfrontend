import React, { useEffect, useState } from "react";
import { back } from "../assets";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Otp2 = ({ onClose, onCloseAll, mobileNumber, onComplete, subscriptionIdParams }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(25);
  const navigate = useNavigate();

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

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRemoveCookies = () => {
    Cookies.remove("apid", { path: "/" });
    Cookies.remove("raid", { path: "/" });
    Cookies.remove("landingPageUrl", { path: "/" });
    localStorage.removeItem("apid");
    localStorage.removeItem("raid");
    localStorage.removeItem("landingPageUrl");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // const userId = data.data.id;
      // responseUser(userId);
      const token = data.data.token;
      localStorage.setItem("authToken", token);
      responseUser(token);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    } finally {
      setLoading(false);
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
        subscriptionIdParams && navigate(`/${subscriptionIdParams}`)
        onComplete();
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
        onComplete();
      }
      handleRemoveCookies();
      window.location.reload();
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
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
        setSuccess("OTP has been resent. Please check your mobile.");
        setTimer(25);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div className="bg-white border-[1px] border-gray-300 m-4 p-8 rounded-lg w-[25rem] relative text-center shadow-lg">
        <div className="absolute top-3 left-2 text-right">
          <div
            onClick={onClose}
            className="text-gray-600 w-8 text-[20px] cursor-pointer hover:text-black"
          >
            <img src={back} alt="" />
          </div>
        </div>
        <div className="mb-1">
          <h2 className="text-2xl font-semibold text-black">
            OTP Verification
          </h2>
        </div>
        <p className="text-gray-600 text-center mb-4">
          Enter the verification code we just sent to your mobile number
        </p>
        {error && (
          <p className="text-red-500 mb-4">
            {error === "User already exists for given mobile and email."
              ? "Kindly refresh the page."
              : error}
          </p>
        )}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form
          className="flex flex-col gap-4 text-black"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black bg-transparent text-center"
            maxLength={6}
          />
          <button
            type="submit"
            className={`bg-black hover:bg-gray-800 text-white transition duration-300 font-semibold text-[20px] py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFormEmpty() || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isFormEmpty() || loading}
          >
            {loading ? "Verifying" : "Verify"}
          </button>
          <button
            type="button"
            className={`mt-2 text-black ${
              timer > 0 ? "opacity-50" : ""
            } md:text-base text-sm underline`}
            onClick={handleResendOTP}
            disabled={timer > 0}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp2;
