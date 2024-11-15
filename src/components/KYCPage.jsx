import React, { useEffect, useState } from "react";
import { useUserSession } from "../constants/userContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiCheck, FiCopy, FiLock } from "react-icons/fi";
import styles from "../style";
import { Tooltip } from "react-tooltip";
import MobileNumberPopup from "./MinorSubscription/MobileNumberPopup";
import { useNavigate } from "react-router-dom";
import { kycDone } from "../assets";

const KYCPage = ({userId, token}) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    pan: "",
    address: "",
    state: "",
  });
  const [error, setError] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [mobileNum, setMobileNum] = useState("");
  // const [subscriptionTempId, setSubscriptionTempId] = useState(null);
  const { userData, loading } = useUserSession();
  const telegramLink = sessionStorage.getItem("inviteLink");
  const navigate = useNavigate();

  const otpDone = localStorage.getItem("otp");
  const mobile = userData?.mobileNumber;

  // useEffect(() => {
  //   const subscriberSession = sessionStorage.getItem("subscriptionTempId");
  //   if (subscriberSession) {
  //     setSubscriptionTempId(subscriberSession);
  //   } else {
  //     console.error("No subscriber session ID found.");
  //   }
  // }, []);

  useEffect(() => {
    if (userData) {
      setFormValues({
        name: userData.name || "",
        email: userData.email || "",
        pan: userData.pan || "",
        address: userData.address || "",
        state: userData.state || "",
      });
      setMobileNum(userData.mobileNumber);
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && userData) {
      const paymentSuccess = checkPaymentStatus();
      if (paymentSuccess) {
        clearURLParams();
      }
    }
  }, [loading, userData]);

  const fetchSubscriptionDetail = async (subscriptionId) => {
    if (subscriptionId) {
      try {
        const response = await fetch(
          `https://copartners.in:5009/api/Subscription/${subscriptionId}`
        );
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.log(error);
        return null;
      }
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
      if (!response.ok) {
        throw new Error(`Failed to send SMS: ${response.statusText}`);
      }
      console.log(`SMS sent to ${mobileNumber} with invite link ${inviteCode}`);
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
      if (response.status !== 200) {
        throw new Error("Failed to send Telegram message");
      }

      console.log(`Telegram message sent to ${phoneNumber}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkPaymentStatus = async () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const transactionId = params.get("transactionId");
    const inviteLink = params.get("inviteLink");
    const planType = params.get("planType");
    const amount = params.get("amount");
    const subscriptionId = params.get("subscriptionId");
    const subscriberId = params.get("subscriberId");
    const userId = localStorage.getItem("userId");

    const subscriptionData = await fetchSubscriptionDetail(subscriptionId);

    if (inviteLink) {
      const decodeLink = decodeURIComponent(inviteLink);
      sessionStorage.setItem("inviteLink", decodeLink);
    }

    if (status === "success") {
      toast.success(`Payment Success: ${transactionId}`);
      const trackierScript = document.createElement("script");
      trackierScript.src =
        "https://static-cdn.trackier.com/js/trackier-web-sdk.js";
      trackierScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "purchase",
          purchaseValue: amount,
          currency: "INR",
          planType: planType,
          serviceType: subscriptionData && subscriptionData.serviceType,
          RA_Name: subscriptionData && subscriptionData.experts.name,
        });
        if (
          window.TrackierWebSDK &&
          typeof window.TrackierWebSDK.trackConv === "function"
        ) {
          window.TrackierWebSDK.trackConv(
            "copartner.gotrackier.com",
            "662b93eae1a03b602b9163",
            {
              goal_value: "ftdpayment",
              txn_id: userId,
              is_iframe: true,
            }
          );
        } else {
          console.error(
            "TrackierWebSDK is not defined or trackConv function is missing."
          );
        }
      };

      trackierScript.onerror = () => {
        console.error("Failed to load Trackier script.");
      };

      document.body.appendChild(trackierScript);
      // if (subscriberId) {
      //   sessionStorage.setItem("subscriptionTempId", subscriberId);
      // }
      // const subscriberSession = sessionStorage.getItem("subscriptionTempId");
      // if (subscriberSession) {
      //   setSubscriptionTempId(subscriberSession);
      // } else {
      //   console.error("No subscriber session ID found.");
      // }
      navigate(window.location.pathname);
      return true;
    } else if (status === "failure") {
      toast.error(`Payment Failed: ${transactionId}`);
      return false;
    }

    return null;
  };

  const clearURLParams = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir",
  ];

  const handleSave = async () => {
    const { pan, state } = formValues;

    if (!pan || !state) {
      setError("All fields are required");
      return;
    }

    const patchData = [
      { path: "pan", op: "replace", value: pan },
      { path: "state", op: "replace", value: state },
      { path: "isKYC", op: "replace", value: true },
    ];

    try {
      const response = await axios.patch(
        `https://copartners.in:5131/api/User?Id=${userData.id}`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (response.status === 200) {
        toast.success("Details updated successfully!");
        setError(null);
        await Promise.all([
          sendSMS(mobileNum, telegramLink),
          sendPaidTelegramLinkMessage(mobileNum, telegramLink),
        ]);
        window.location.reload();
      } else {
        toast.error("Failed to update details!");
        setError("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Failed to update details!");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramLink);
    toast.success("Link copied to clipboard!");
  };

  const handleOpenLink = (e) => {
    e.preventDefault();
    window.open(telegramLink, "_blank");
  };

  return (
    <div className={`flex flex-col ${styles.paddingY} header-bg`}>
      <div
        className={`flex-1 ${styles.flexCenter} flex-col xl:px-0 sm:px-4 px-2 z-10 text-center`}
      >
        <div className="flex flex-col items-center justify-center bg-gray-100">
          <div className="w-full max-w-lg mx-auto border-2 border-dashed border-black bg-white rounded-lg shadow-lg">
            {/* Stepper */}
            <div className="flex justify-between bg-[#E8F6FF] items-center mb-6 p-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500">
                  <div className="w-3 h-3 rounded-full border-[1px] border-white flex items-center justify-center bg-green-500">
                    <FiCheck className="text-white w-3 h-3" />
                  </div>
                </div>
                <span className="text-green-500 text-[10px]">Login</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-green-500 mx-2 mb-3"></div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500">
                  <div className="w-3 h-3 rounded-full border-[1px] border-white flex items-center justify-center bg-green-500">
                    <FiCheck className="text-white w-3 h-3" />
                  </div>
                </div>
                <span className="text-green-500 text-[10px]">Payment</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-green-500 mx-2 mb-3"></div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full flex items-center justify-center border-2 border-green-500 text-white">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-green-500 text-[10px]">Premium Link</span>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-3xl text-left font-semibold text-gray-800">
                  KYC Verification
                </h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {userData?.isKYC ? (
                  <div className="text-center py-4">
                    <img
                      src={kycDone}
                      alt="KYC Approved"
                      className="mx-auto mb-4"
                      style={{ width: "100px", height: "100px" }} // Adjust the size as needed
                    />
                    <h3 className="text-base font-medium">
                      Congratulations your KYC is <span className="text-green-500">successfully</span> done.
                    </h3>
                  </div>
                ) : (
                  <form className="flex flex-col gap-4">
                    {/* <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div> */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        name="pan"
                        value={formValues.pan}
                        onChange={handleInputChange}
                        placeholder="PAN Card"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <select
                        name="state"
                        value={formValues.state}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          Select your state
                        </option>
                        {indianStates.map((state, index) => (
                          <option key={index} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* <input
                      type="text"
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                    <button
                      type="button"
                      onClick={handleSave}
                      className="w-full py-3 mt-4 md:text-lg text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>

              {/* Disclaimer */}
              {/* <p className="text-sm text-gray-500 mb-6">
                Disclaimer: Transferring any amount will not be refunded if the
                transaction is successful.
              </p> */}

              {/* Telegram Link */}
              <div className="mb-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                  Premium Telegram Channel Link
                </h2>
                <div className="relative text-center py-4">
                  <div
                    className={`flex items-center justify-between p-2 border rounded-lg ${
                      userData?.isKYC
                        ? "bg-white text-black"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onMouseEnter={() => {
                      if (!userData?.isKYC) {
                        setShowPopover(true);
                      }
                    }}
                    onMouseLeave={() => setShowPopover(false)}
                  >
                    {userData?.isKYC ? (
                      <span onClick={handleOpenLink} className="flex-1">
                        {telegramLink}
                      </span>
                    ) : (
                      <span className="flex-1 blur-sm">
                        *************************
                      </span>
                    )}
                    {userData?.isKYC && (
                      <button
                        onClick={handleCopy}
                        className="p-1 rounded-full text-black"
                      >
                        <FiCopy className="text-base" />
                      </button>
                    )}
                    {!userData?.isKYC && <FiLock />}
                  </div>
                  {showPopover && !userData?.isKYC && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 p-2 w-64 bg-red-50 border border-red-300 text-red-800 rounded-md shadow-lg">
                      Please complete your KYC to unlock the link.
                    </div>
                  )}
                  <button
                    disabled={!userData?.isKYC}
                    type="button"
                    onClick={handleOpenLink}
                    className={`w-full py-3 mt-8 ${
                      !userData?.isKYC ? "blur-sm" : ""
                    }  md:text-lg text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300`}
                  >
                    Join Now!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {otpDone === "false" && (
        <MobileNumberPopup
          // subscriptionTempId={subscriptionTempId}
          mobileNumber={mobile}
        />
      )} */}
      <Tooltip id="tooltip" />
      <ToastContainer />
    </div>
  );
};

export default KYCPage;
