import React, { useEffect, useRef, useState } from "react";
import { closeImg, signupBg } from "../assets";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Otp2 from "./Otp2";
import { IoMdCloseCircleOutline } from "react-icons/io";

const SignUp2 = ({ onComplete, onClose }) => {
  const [mobile, setMobile] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState("");
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

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);

    if (value.length > 10) {
      setValidationMessage("Mobile number must have more than 10 digits");
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
      setShowOtp(true);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setError("Failed to send OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormEmpty = () => {
    return !mobile;
  };

  const handleClosePopups = () => {
    setShowOtp(false);
  };

  const handleClose = () => {
    sessionStorage.setItem("visitedSignUp", "true");
    navigate("/");
    window.location.reload();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 w-screen h-screen`}
    >
      <div className="bg-white border-[1px] border-gray-300 m-4 p-6 rounded-lg w-96 relative text-center shadow-lg">
        <div className="flex justify-end" onClick={onClose}>
          <IoMdCloseCircleOutline className="w-8 h-8" />
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-black">Login/Signup</h2>
        </div>
        <p className="text-gray-600 text-center mb-4">
          Get access to daily free calls from varieties of India's SEBI
          Registered Research Analysts.
        </p>
        {showOtp ? (
          <Otp2
            mobileNumber={mobile}
            onClose={handleClosePopups}
            onCloseAll={handleClose}
            onComplete={onComplete}
          />
        ) : (
          <form
            className="flex flex-col gap-4 text-black"
            onSubmit={handleSubmit}
          >
            <input
              type="number"
              placeholder="Mobile Number"
              value={mobile}
              onChange={handleMobileChange}
              className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black bg-transparent"
              maxLength={10}
            />
            {validationMessage && (
              <p className="text-red-500 mt-2">{validationMessage}</p>
            )}
            <button
              type="submit"
              className={`bg-black hover:bg-gray-800 text-white transition duration-300 font-semibold text-[20px] py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFormEmpty() || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isFormEmpty() || loading}
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp2;
