import { useEffect, useState } from "react";
import EditNumber from "./EditNumber";
import { FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const MobileNumberPopup = ({ onClose, mobileNumber, subscriptionTempId }) => {
  const userId = localStorage.getItem("userId");
  const [isEditing, setIsEditing] = useState(false);
  const [otpPopup, setOtpPopup] = useState(false);
  const [newMobileNumber, setNewMobileNumber] = useState(mobileNumber);

  useEffect(() => {
    setNewMobileNumber(mobileNumber);
  }, [mobileNumber]);

  const handleGenerateOTP = async () => {
    const postData = {
      countryCode: "IN",
      mobileNumber: newMobileNumber,
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
      if (data.isSuccess) {
        setOtpPopup(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-white border-[1px] border-[#333333] m-4 p-8 rounded-lg w-[25rem] relative text-center shadow-lg">
          {isEditing && <div onClick={() => handleClose()}>
            <IoArrowBackCircleOutline className="w-8 h-8" />
          </div>}
          <div className="mb-1">
            <h2 className="text-2xl font-semibold text-black mb-4">
              Verify Your Number
            </h2>
          </div>
          <div className="mb-4 justify-center flex flex-col gap-2">
            <input
              type="text"
              value={newMobileNumber}
              disabled={!isEditing}
              onChange={(e) => setNewMobileNumber(e.target.value)}
              className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-4 py-3 border border-[#333333] rounded-xl focus:outline-none text-black focus:border-black bg-transparent"
              maxLength={10}
            />
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex mx-auto items-center gap-2 text-black opacity-75 py-2 px-4 rounded focus:outline-none focus:ring-2 text-base md:text-xl"
              >
                <FaPen />
                Edit
              </button>
            )}
          </div>
          <button
            onClick={handleGenerateOTP}
            className="w-full bg-black text-white hover:bg-gray-800 transition duration-300 font-semibold text-[20px] py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send OTP
          </button>
        </div>
      </div>
      {otpPopup && (
        <EditNumber
          onClose={() => setOtpPopup(false)}
          mobileNumber={newMobileNumber}
          userId={userId}
          setOtpPopup={setOtpPopup}
          setIsEditing={setIsEditing}
          subscriptionTempId={subscriptionTempId}
        />
      )}
    </>
  );
};

export default MobileNumberPopup;
