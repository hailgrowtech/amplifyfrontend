import React, { useState, useEffect } from "react";
import { close } from "../../assets";
import axios from "axios";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfilePopup = ({ isOpen, onClose, onUpdateProfile, userData, token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [panCard, setPanCard] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setImagePreview(userData.profileImage || null);
      setProfileImageUrl(userData.profileImage || null);
      setPanCard(userData.pan || "");
      setAddress(userData.address || "");
      setState(userData.state || "");
    }
  }, [userData]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        // Fetch presigned URL
        const presignedResponse = await axios.post(
          "https://copartners.in:5134/api/AWSStorage?prefix=Images",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!presignedResponse.data.isSuccess) {
          throw new Error("Unable to fetch presigned URL");
        }

        const { presignedUrl } = presignedResponse.data.data;

        setProfileImageUrl(presignedUrl);
        toast.success("Image uploaded");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!name || !email || !phone || !panCard || !address || !state) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const patchData = [
        { path: "name", op: "replace", value: name },
        { path: "email", op: "replace", value: email },
        { path: "mobileNumber", op: "replace", value: phone },
        { path: "pan", op: "replace", value: panCard },
        { path: "address", op: "replace", value: address },
        { path: "state", op: "replace", value: state },
        { path: "userImagePath", op: "replace", value: profileImageUrl },
      ];

      const response = await axios.patch(
        `https://copartners.in:5131/api/User?Id=${userId}`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      onUpdateProfile();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white border-2 border-gray-300 rounded-lg px-8 py-2 md:w-[50rem] w-[24rem] h-auto">
            <div className="edit-section flex justify-between items-center">
              <h2 className="font-bold md:text-[50px] text-[30px] text-black md:leading-[50px] leading-[51px]">
                Edit Profile
              </h2>
              <button onClick={onClose}>
                {/* <img src={close} alt="Close Icon" className="w-12 h-12" /> */}
              <IoMdCloseCircleOutline className="w-8 h-8" />
              </button>
            </div>
            {/* Profile Image Upload */}
            <div className="mb-4">
              <label htmlFor="profileImage" className="block mb-1 text-black">
                Upload Profile Picture
              </label>
              <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="uploadPhoto relative bg-[transparent] border-2 border-dashed border-gray-400 p-[60px] rounded-lg">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full mx-auto mb-4"
                    />
                    <button
                      className="absolute bottom-10 left-0 right-0 bg-[transparent] text-black mx-auto text-xl"
                      onClick={() =>
                        document.getElementById("profileImage").click()
                      }
                    >
                      Change
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-[transparent] text-black mx-auto text-3xl pl-9"
                    onClick={() =>
                      document.getElementById("profileImage").click()
                    }
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
            {/* Name Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                />
                <label
                  htmlFor="name"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Name
                </label>
              </div>
            </div>
            {/* Email and Phone Inputs */}
            <div className="mb-4 flex">
              <div className="w-1/2 mr-2">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Email
                  </label>
                </div>
              </div>
              <div className="w-1/2 ml-2">
                <div className="relative">
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=" "
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                    disabled
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Phone Number
                  </label>
                </div>
              </div>
            </div>
            {/* PAN Card Input */}
            <div className="flex mb-4">
              <div className="relative w-1/2 mr-2">
                <input
                  type="text"
                  id="panCard"
                  value={panCard}
                  onChange={(e) => setPanCard(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                />
                <label
                  htmlFor="panCard"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  PAN Card
                </label>
              </div>
              <div className="relative w-1/2 ml-2">
                <input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                />
                <label
                  htmlFor="state"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  State
                </label>
              </div>
            </div>
            {/* Address Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                />
                <label
                  htmlFor="address"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Address
                </label>
              </div>
            </div>
            {/* Change Button */}
            <div className="flex justify-center">
              <button
                className={`${
                  loading ? "bg-gray-500" : "bg-black"
                } text-white py-2 px-4 rounded-md`}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Change"}
              </button>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default EditProfilePopup;
