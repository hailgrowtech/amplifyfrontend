import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSession } from "../../constants/userContext";
import { exclamation } from "../../assets";
import LoadingScreen from "./LoadingScreen"; // Import the loading screen component
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";

const SubscriptionPaymentPopup = ({
  onClose,
  selectedMonthlyPlan,
  planMonthlyPrice,
  expertName,
  chatId,
  subscriptionId,
  userId,
  mobileNumber,
  isCustom,
  durationMonth,
  shouldNavigate,
}) => {
  const total = planMonthlyPrice || 0;
  const { userData } = useUserSession();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false); // State to manage the loading screen after payment
  const { subscriptionIdParams } = useParams();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const navigate = useNavigate();
  const [discountedTotal, setDiscountedTotal] = useState(total);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountError, setDiscountError] = useState(false);
  const [couponRefferMode, setCouponRefferMode] = useState("");
  const [isSpecialSubscription, setisSpecialSubscription] = useState(false);
  const [redError, setRedError] = useState(false);
  const [expertId, setExpertId] = useState(null);
  const [serviceType, setServiceType] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const fetchData = async (fetchId) => {
    try {
      const response = await axios.get(
        `https://copartners.in:5009/api/Subscription/${fetchId}`
      );
      setSubscriptionData(response.data.data);
      setExpertId(response.data.data.expertsId);
      setServiceType(response.data.data.serviceType);
      if (response.data.data.discountedAmount !== undefined) {
        setDiscountedTotal(response.data.data.discountedAmount);
      } else {
        setDiscountedTotal(total);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expert data:", error);
      setLoading(false);
    }
  };

  const checkSpecialSubscription = async (fetchId) => {
    try {
      const response = await axios.get(
        `https://copartners.in:5009/api/Subscription/${fetchId}`
      );
      setisSpecialSubscription(response.data.data.isSpecialSubscription);
    } catch (error) {
      console.error("Error fetching expert data:", error);
    }
  };

  useEffect(() => {
    subscriptionIdParams && fetchData(subscriptionIdParams);
    (subscriptionId || subscriptionIdParams) &&
      checkSpecialSubscription(subscriptionId || subscriptionIdParams);
  }, [subscriptionIdParams, subscriptionId]);

  const handlePay = async () => {
    if (loading) return; // Prevent multiple clicks

    setLoading(true); // Disable the button

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false); // Re-enable the button if there's an error
      return;
    }

    const transactionDate = new Date().toISOString();

    // Combine the subscription data and invite link data into one request payload
    const subscriberCreateDto = {
      subscriptionId: subscriptionData?.id || subscriptionId,
      userId: userData?.id || userId,
      gstAmount: subscriptionData?.gstAmount || 0,
      totalAmount: discountedTotal.toFixed(2),
      couponRefferalMode: couponRefferMode,
      couponDiscountPercentage: discountPercentage,
      discountPercentage: subscriptionData?.discountPercentage || 0,
      paymentMode: "UPI", // Assuming UPI as the payment mode
      transactionId: "T" + Date.now(),
      transactionDate,
      isActive: true,
      premiumTelegramChannel: subscriptionData?.premiumTelegramChannel || "",
    };

    const inviteLinkCreateDto = {
      chatId: subscriptionData?.chatId || chatId,
      durationMonths: subscriptionData?.durationMonth || durationMonth,
      isCustom:
        subscriptionData?.isCustom !== undefined
          ? subscriptionData.isCustom
          : isCustom,
      mobileNumber: userData?.mobileNumber || mobileNumber,
      userId: userData?.id || userId,
    };

    const orderRequestDto = {
      subscriberCreateDto,
      inviteLinkCreateDto,
    };

    console.log(orderRequestDto.subscriberCreateDto);

    try {
      // Step 1: Create order
      const response = await fetch(
        "https://copartners.in:5009/api/PaymentGateway/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderRequestDto),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resData = await response.json();
      console.log("Order creation response:", resData);

      if (resData.error) {
        alert(`Error: ${resData.error}`);
        return;
      }

      if (resData.orderId) {
        const options = {
          key: "rzp_live_D2N1nZHECBBkuW", // Replace with your Razorpay key ID
          amount: resData.amountInPaise, // Amount in paise
          currency: "INR",
          name: "Copartner",
          description: "Subscription",
          order_id: resData.orderId, // Order ID from backend
          handler: function (response) {
            console.log("Payment response:", response);
            capturePayment(response.razorpay_payment_id, resData.orderId); // Pass orderId to capturePayment
          },
          prefill: {
            name: userData?.name || "John Doe",
            email: userData?.email || "john.doe@example.com",
            contact: userData?.mobileNumber || "9999999999",
          },
          notes: {
            address: "Your address here",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        console.error("Payment initiation failed:", resData);
      }
    } catch (error) {
      console.error("Error in handlePay:", error);
    } finally {
      setLoading(false); // Re-enable the button once the process is complete
    }
  };

  // Function to capture the payment
  const capturePayment = async (paymentId, orderId) => {
    const amount = subscriptionData?.discountedAmount || total;

    const subscriberCreateDto = {
      subscriptionId: subscriptionData?.id || subscriptionId,
      userId: userData?.id || userId,
      gstAmount: subscriptionData?.gstAmount || 0,
      totalAmount: discountedTotal.toFixed(2),
      couponRefferalMode: couponRefferMode,
      couponDiscountPercentage: discountPercentage,
      discountPercentage: subscriptionData?.discountPercentage || 0,
      paymentMode: "UPI",
      transactionId: paymentId,
      transactionDate: new Date().toISOString(),
      isActive: true,
      premiumTelegramChannel: subscriptionData?.premiumTelegramChannel || "",
    };

    console.log({ subscriberCreateDto });

    try {
      setRedirecting(true);
      const response = await fetch(
        `https://copartners.in:5009/api/PaymentGateway/capture-payment?paymentId=${paymentId}&amount=${amount}&orderId=${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriberCreateDto),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment capture response:", data);

      if (data.success) {
        window.location.href = data.redirectUrl;
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      alert("Payment capture failed");
    } finally {
      setRedirecting(false);
    }
  };

  const handleClose = () => {
    if (shouldNavigate) {
      navigate(`/ra-detail/${expertId}?type=${serviceType}`); // Navigate to the homepage if the condition is true
    } else {
      onClose(); // Otherwise, just call the onClose function
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      return;
    }
    setDiscountError("");
    if (userData?.referralMode === "RA") {
      setDiscountError(
        "Coupons are not applicable for this user. Please try again later."
      );
      return;
    }
    if (isCouponApplied) {
      setCouponCode("");
      setIsCouponApplied(false);
      setDiscountedTotal(subscriptionData?.discountedAmount || total);
      setDiscountPercentage(0);
      setCouponRefferMode("");
    } else {
      try {
        const response = await axios.get(
          `https://copartners.in:5009/api/RefferalCoupon/GetByCouponCode?CouponCode=${couponCode}`
        );
        
        const coupons = response.data.data;  // Access the coupon list

        if (coupons.length === 1) {
          // Apply the coupon directly if only one coupon is found
          const coupon = coupons[0];
          applyCoupon(coupon);
        } else {
          // Multiple coupons found, match by referralMode
          const matchingCoupon = coupons.find(
            (coupon) =>
              coupon.referralMode === userData.referralMode &&
              (userData.referralMode !== "AP" || coupon.cpapId === userData.affiliatePartnerId)
          );

          if (matchingCoupon) {
            applyCoupon(matchingCoupon);
          } else {
            setDiscountError("Applicable discounts already applied.");
          }
        }
      } catch (error) {
        console.error("Error validating coupon code:", error);
        setRedError("Coupon you applied is incorrect.");
      }
    }
  };

const applyCoupon = (coupon) => {
  const discount = coupon.discountPercentage;
  const couponRefferalMode = coupon.referralMode;
  const newTotal =
    (subscriptionData?.discountedAmount || total) -
    ((subscriptionData?.discountedAmount || total) * discount) / 100;

  setDiscountPercentage(discount);
  setDiscountedTotal(newTotal);
  setIsCouponApplied(true);
  setCouponRefferMode(couponRefferalMode);
};

  return (
    <>
      {subscriptionIdParams && <div className="h-screen"></div>}
      {redirecting && <LoadingScreen />}{" "}
      {/* Show loading screen during redirection */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div className="bg-white border-2 border-dashed border-black rounded-xl shadow-md md:w-[380px] w-[90%] relative">
          <div className="flex justify-between bg-[#E8F6FF] rounded-t-lg items-center p-6">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500">
                <div className="w-3 h-3 rounded-full border-[1px] border-white flex items-center justify-center bg-green-500">
                  <FiCheck className="text-white w-3 h-3" />
                </div>
              </div>
              <span className="text-green-500 text-[10px]">Login</span>
            </div>
            <div className="flex-1 flex justify-between items-center mx-2">
              <div className="border-t-2 border-dashed border-green-500 w-full mb-3"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full border-2 border-green-500  flex items-center justify-center bg-white">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-green-500 text-[10px]">Payment</span>
            </div>
            <div className="flex-1 flex justify-between items-center mx-2">
              <div className="border-t-2 border-dashed border-gray-300 w-full mb-3"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
              <span className="text-gray-500 text-[10px]">Premium Link</span>
            </div>
          </div>
          <div className="p-6">
            <button
              onClick={handleClose}
              className="absolute top-24 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseCircleOutline className="w-6 h-6" />
            </button>

            <h2 className="md:text-2xl text-xl font-bold text-black text-left mb-4">
              Your Subscription Details
            </h2>

            <div className="text-left mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Note:</span> Once your payment
                is <span className="">successful</span> ,{" "}
                <span className="font-bold text-black">
                  please return to our site
                </span>{" "}
                to access your premium Telegram Channel link.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <label className="block text-sm text-gray-500 font-normal">
                  Subscription
                </label>
                <span className="text-sm text-black">
                  {subscriptionData?.planType ||
                    selectedMonthlyPlan ||
                    "Monthly"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm text-gray-500 font-normal">
                  Name
                </label>
                <span className="text-sm text-black">
                  {subscriptionData?.experts.name || expertName}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm text-gray-500 font-normal">
                  Amount
                </label>
                <span className="text-sm text-black">
                  ₹
                  {subscriptionData?.discountedAmount.toFixed(2) ||
                    planMonthlyPrice}
                </span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between mb-2">
                  <label className="block text-sm text-gray-500 font-normal">
                    Discount
                  </label>
                  <span className="text-sm text-green-500">
                    -₹
                    {(
                      ((subscriptionData?.amount || planMonthlyPrice) *
                        discountPercentage) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {!isSpecialSubscription && (
              <div className="relative">
                <div
                  className={`flex justify-between ${
                    discountError || redError ? "blur-sm" : ""
                  } items-center border-2 bg-[#A7D6F733] bg-opacity-50 px-4 py-2 rounded-2xl mb-4`}
                >
                  <input
                    type="text"
                    className="w-1/2 bg-transparent text-gray-500 text-sm outline-none flex-1"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied} // Disable input if coupon is applied
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`${
                      isCouponApplied
                        ? "bg-[#FF00001A] text-red-500"
                        : "bg-[#F1F2F5] text-black"
                    } px-4 py-2 text-sm rounded-xl border-2`}
                  >
                    {isCouponApplied ? "Remove" : "Apply"}
                  </button>
                </div>
                {isCouponApplied && (
                  <div className={`text-green-500 text-sm`}>
                    Coupon "{couponCode}" applied successfully! You saved{" "}
                    {discountPercentage}%.
                  </div>
                )}
                {discountError && (
                  <div className="absolute top-5 md:left-8 left-3 text-blue-500 text-sm">
                    {discountError}
                  </div>
                )}
                {redError && (
                  <div className="absolute top-5 md:left-8 left-3 text-red-500 text-sm">
                    {redError}
                  </div>
                )}

                <div className="flex justify-between py-2 mb-4 border-b-[1px] border-t-[1px] border-gray-300">
                  <label className="block text-lg text-black font-semibold">
                    Total
                  </label>
                  <span className="text-lg font-semibold text-black">
                    ₹
                    {discountedTotal !== undefined
                      ? discountedTotal.toFixed(2)
                      : total.toFixed(2)}
                  </span>
                </div>
                {(discountError || redError) && (
                  <div className="absolute top-0 right-0">
                    <IoIosCloseCircleOutline
                      onClick={() => {
                        setDiscountError(false);
                        setRedError(false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <button
              className={`w-full bg-gradient-to-r text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition duration-300 ${
                loading
                  ? "opacity-50 from-blue-800 to-purple-800 cursor-not-allowed"
                  : "from-blue-500 to-purple-500"
              }`}
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? "Paying..." : "Pay"}
            </button>

            <div className="flex items-start py-2 mt-4 text-gray-500 text-xs">
              <img src={exclamation} className="w-5 h-5 mr-2" alt="" />
              <p>
                Transferring any amount or communicating outside of Copartner
                may result in fraudulent experiences and potential loss of your
                money. Please pay or communicate exclusively through our
                platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPaymentPopup;
