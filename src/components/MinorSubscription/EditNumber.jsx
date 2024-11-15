import React, { useState, useEffect } from "react";
import { back } from "../../assets";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserSession } from "../../constants/userContext";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const EditNumber = ({
  onClose,
  mobileNumber,
  userId,
  setOtpPopup,
  setIsEditing,
  subscriptionTempId,
  onCloseEdit,
}) => {
  const [otp, setOtp] = useState("");
  const { userData } = useUserSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(25);
  const inviteLink = sessionStorage.getItem("inviteLink");
  const navigate = useNavigate();

  const sendPostRequest = async (phoneNumber) => {
    const url = "https://backend.aisensy.com/campaign/t1/api/v2";
    const data = {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmM5ZWNiOTNhMmJkMGFlZTVlMGZiMiIsIm5hbWUiOiJIYWlsZ3JvIHRlY2ggc29sdXRpb25zIHB2dC4gbHRkLiIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjJjOWVjYjkzYTJiZDBhZWU1ZTBmYWIiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNDIwMDI2N30.fQE69zoffweW2Z4_pMiXynoJjextT5jLrhXp6Bh1FgQ",
      campaignName: "kyc_incomplete",
      destination: phoneNumber,
      userName: "Hailgro tech solutions pvt. ltd.",
      media: {
        url: "https://s3.eu-north-1.amazonaws.com/copartners-storage/Images/IMG_0698.jpg",
        filename: "kycIncomplete",
      },
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendSMS = async (mobileNumber, inviteLink) => {
    try {
      const inviteCode = encodeURIComponent(
        inviteLink.split("https://t.me/")[1]
      );

      if (!inviteCode) {
        throw new Error("Invalid invite link format");
      }

      const response = await fetch(
        `https://www.fast2sms.com/dev/bulkV2?authorization=1UGuIy5W4D3vA2wZfB90ibrcsOCeYS7nptj8EVhLodKJqxXNMHLIermYdE6vHzpBRaXOl274SfAbsw5Z&route=dlt&sender_id=COPTNR&message=169464&variables_values=${inviteCode}&flash=0&numbers=${mobileNumber}`
      );
      if (response.ok) {
        console.log(
          `SMS sent to mobile ${mobileNumber} with invite link ${inviteCode}`
        );
      } else {
        console.log(response.error);
      }
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  };

  const sendPaidTelegramLinkMessage = async (phoneNumber, link) => {
    const url = "https://backend.aisensy.com/campaign/t1/api/v2";
    const data = {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmM5ZWNiOTNhMmJkMGFlZTVlMGZiMiIsIm5hbWUiOiJIYWlsZ3JvIHRlY2ggc29sdXRpb25zIHB2dC4gbHRkLiIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjJjOWVjYjkzYTJiZDBhZWU1ZTBmYWIiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNDIwMDI2N30.fQE69zoffweW2Z4_pMiXynoJjextT5jLrhXp6Bh1FgQ",
      campaignName: "⁠⁠paid_telegram_link (Upon KYC completion) (TEXT)",
      destination: phoneNumber,
      userName: "Hailgro tech solutions pvt. ltd.",
      templateParams: [`${link}`],
      source: "new-landing-page form",
      media: {
        url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/IMAGE/6353da2e153a147b991dd812/5442184_confidentmansuit.png",
        filename: "sample_media",
      },
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

  const fetchUserId = async (mobileNumber) => {
    try {
      const response = await axios.get(
        `https://copartners.in:5131/api/User/GetUpdatedUser?mobileNumber=${mobileNumber}`
      );

      if (response.data.isSuccess) {
        const userId = response.data.data.id;
        return userId;
      } else {
        console.error(
          "Error:",
          response.data.displayMessage || "Failed to retrieve user data"
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const userKYC = async (userId) => {
    try {
      const response = await fetch(
        `https://copartners.in:5131/api/User/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      return data.data.isKYC;
    } catch (error) {
      console.error("Error fetching user KYC data:", error.message);
      return null;
    }
  };

  const processTempSubscription = async (userId, subscriberId) => {
    try {
      const url = `https://copartners.in:5009/api/Subscriber/ProcessTempSubscription?userId=${userId}&subscriberId=${subscriberId}`;
      const response = await axios.post(url);

      if (response.data.isSuccess) {
        localStorage.removeItem("otp");
        const isKYC = await userKYC(userId);
        if (!isKYC) {
          await sendPostRequest(mobileNumber);
        } else {
          await sendSMS(mobileNumber, inviteLink);
          await sendPaidTelegramLinkMessage(mobileNumber, inviteLink);
        }
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to process subscription");
        navigate("/contact_us");
        return null;
      }
    } catch (error) {
      console.error("Error making subscription request:", error);
      navigate("/contact_us");
      return null;
    }
  };

  const handleSave = async () => {
    try {
      const newId = await fetchUserId(mobileNumber);
      if (newId) {
        localStorage.removeItem("userId");
        localStorage.setItem("userId", newId);
        console.log(newId, subscriptionTempId);
        await processTempSubscription(newId, subscriptionTempId);
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
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
      setSuccess("OTP verified successfully.");
      handleSave();
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setError("Failed to verify OTP. Please try again.");
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
        setSuccess("OTP has been resent. Please check your mobile.");
        setTimer(25);
      }
    } catch (error) {
      console.error(
        "There was a problem with the resend OTP operation:",
        error
      );
      setError("Failed to resend OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const isFormEmpty = () => {
    return otp.trim() === "";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white border-[1px] border-gray-300 m-4 p-8 rounded-lg w-[25rem] relative text-center shadow-lg">
        <div className="absolute top-3 left-2 text-right">
          <div onClick={onClose}>
            <IoArrowBackCircleOutline className="w-8 h-8" />
          </div>
        </div>
        <div className="mb-1">
          <h2 className="text-2xl font-semibold text-black">
            Verify Your Number
          </h2>
        </div>
        <p className="text-gray-700 text-center mb-4">
          Enter the verification code we just sent to your mobile number
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
            {loading ? <FaSpinner size={24} /> : "Verify"}
          </button>
          <button
            type="button"
            className={`mt-2 text-black ${
              timer > 0 ? "opacity-50" : ""
            } md:text-base text-sm underline`}
            onClick={handleResendOTP}
            disabled={timer > 0}
          >
            Resend OTP {timer > 0 && `in ${timer}s`}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditNumber;
