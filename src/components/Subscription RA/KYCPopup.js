import React, { useEffect, useState } from "react";
import { close, exclamation } from "../../assets";
import { useUserSession } from "../../constants/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const KYCPopup = ({ onClose, inviteLink, token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState(null);
  const [showPrecautionPopup, setShowPrecautionPopup] = useState(false);
  const { userData } = useUserSession();

  useEffect(() => {
    // Disable scrolling on the body element when the popup is mounted
    document.body.style.overflow = "hidden";

    // Re-enable scrolling on the body element when the popup is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPan(userData.pan || "");
      setAddress(userData.address || "");
      setState(userData.state || "");
    }
  }, [userData]);

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
    if (!pan || !state) {
      setError("All fields are required");
      return;
    }

    const patchData = [
      // { path: "name", op: "replace", value: name },
      // { path: "email", op: "replace", value: email },
      { path: "pan", op: "replace", value: pan },
      // { path: "address", op: "replace", value: address },
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
        if (inviteLink) {
          await sendSMS(userData?.mobileNumber, inviteLink);
        }
        window.location.reload();
        onClose();
      } else {
        toast.error("Failed to update details!");
        setError("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
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

  const handleClosePrecautionPopup = () => {
    setShowPrecautionPopup(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white border-2 border-dashed border-black rounded shadow-md w-[90%] md:w-[400px] relative">
          <div className="border-b-2 py-3 px-6">
            <h2 className="md:text-2xl text-xl font-bold text-gray-900 text-left">
              KYC Verification
            </h2>
          </div>
          <div className="px-6 py-3">
            <div className="text-gray-900 mb-4">
              <p>
                <strong>Precaution:</strong> Closing this popup will lose the
                Telegram Channel Link!!! (if any)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* <div className="mb-4 md:col-span-1">
                <label htmlFor="name" className="block mb-1 text-sm text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block px-2.5 py-2 w-full text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
                />
              </div>
              <div className="mb-4 md:col-span-1">
                <label htmlFor="email" className="block mb-1 text-sm text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-2.5 py-2 w-full text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
                />
              </div> */}
              <div className="mb-4 md:col-span-1">
                <label
                  htmlFor="pan"
                  className="block mb-1 text-sm text-gray-900"
                >
                  PAN Card
                </label>
                <input
                  type="text"
                  id="pan"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="block px-2.5 py-2 w-full text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
                />
              </div>
              <div className="mb-4 md:col-span-1">
                <label
                  htmlFor="state"
                  className="block mb-1 text-sm text-gray-900"
                >
                  State
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block px-2.5 py-2 w-full text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
                >
                  <option value="" disabled>
                    Select your state
                  </option>
                  {indianStates.map((stateName, index) => (
                    <option key={index} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="mb-4 col-span-2">
                <label htmlFor="address" className="block mb-1 text-sm text-gray-900">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block px-2.5 py-2 w-full text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
                />
              </div> */}
              {error && (
                <div className="text-red-500 text-sm mb-2 col-span-2">
                  {error}
                </div>
              )}
              <button
                className="bg-gray-900 col-span-2 text-white py-3 px-2 rounded-sm hover:bg-black transition duration-300 md:text-[1rem] text-[12px]"
                onClick={handleSave}
              >
                Submit
              </button>
              <div className="flex col-span-2 items-start gap-2 text-gray-900 py-2 md:text-[12px] text-[10px]">
                <img src={exclamation} className="w-5 h-5" alt="Exclamation" />
                <span className="flex items-start">
                  Users are solely responsible for the accuracy and authenticity
                  of any documents or information submitted for Know Your
                  Customer (KYC) verification. Copartner assumes no liability
                  for any issues or consequences arising from the submission of
                  inaccurate or falsified documents.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPrecautionPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded shadow-md w-[90%] md:w-[400px] p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleClosePrecautionPopup}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Precaution
            </h2>
            <p className="mb-4 text-gray-900">
              Please make sure all the information provided is accurate. Going
              back may cause loss of unsaved changes. Do you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
                onClick={handleClosePrecautionPopup}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                onClick={() => setShowPrecautionPopup(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KYCPopup;
