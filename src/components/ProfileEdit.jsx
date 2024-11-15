import React, { useState, useEffect } from "react";
import { closeIcon, dropdown } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api";

const ProfileEdit = ({ closeDialog, stackholderId, myCard, fetchDetails }) => {
  const [expertTypeId, setExpertTypeId] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [freeTelegramLink, setFreeTelegramLink] = useState("");
  const [membersInTelegram, setMembersInTelegram] = useState("");
  const [chatIdC, setChatIdC] = useState("");
  const [chatIdE, setChatIdE] = useState("");
  const [chatIdFO, setChatIdFO] = useState("");
  const [premiumTelegramLinkC, setPremiumTelegramLinkC] = useState("");
  const [premiumTelegramLinkE, setPremiumTelegramLinkE] = useState("");
  const [premiumTelegramLinkFO, setPremiumTelegramLinkFO] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [sebiRegNo, setSebiRegNo] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [originalData, setOriginalData] = useState({});

  const expertTypeOptions = ["Commodity", "Equity", "Futures & Options"];
  const experienceOptions = [
    "1+ Year",
    "2+ Years",
    "3+ Years",
    "4+ Years",
    "5+ Years",
  ];

  const handleSuccess = () => {
    toast.success("Successfully Created!", {
      position: "top-right",
    });
  };

  useEffect(() => {
    if (myCard) {
      setName(myCard.name);
      setMobileNumber(myCard.mobileNumber);
      setEmail(myCard.email);
      setFreeTelegramLink(myCard.telegramChannel);
      setMembersInTelegram(myCard.telegramFollower);
      setChatIdC(myCard.chatId1);
      setChatIdE(myCard.chatId2);
      setChatIdFO(myCard.chatId3);
      setPremiumTelegramLinkC(myCard.premiumTelegramChannel1);
      setPremiumTelegramLinkE(myCard.premiumTelegramChannel2);
      setPremiumTelegramLinkFO(myCard.premiumTelegramChannel3);
      setImagePath(myCard.expertImagePath);
      setSebiRegNo(myCard.sebiRegNo);
      setExpertTypeId(expertTypeOptions[myCard.expertTypeId - 1] || "");
      setExperienceType(experienceOptions[myCard.experience - 1] || "");

      setOriginalData({
        name: myCard.name,
        mobileNumber: myCard.mobileNumber,
        email: myCard.email,
        freeTelegramLink: myCard.telegramChannel,
        membersInTelegram: myCard.telegramFollower,
        chatIdC: myCard.chatId1,
        chatIdE: myCard.chatId2,
        chatIdFO: myCard.chatId3,
        premiumTelegramLinkC: myCard.premiumTelegramChannel1,
        premiumTelegramLinkE: myCard.premiumTelegramChannel2,
        premiumTelegramLinkFO: myCard.premiumTelegramChannel3,
        imagePath: myCard.expertImagePath,
        sebiRegNo: myCard.sebiRegNo,
        expertTypeId: myCard.expertTypeId,
        experienceType: myCard.experience,
      });
    }
  }, [myCard]);

  const generatePatchOperations = (original, updated) => {
    const operations = [];
    for (const key in updated) {
      if (original[key] !== updated[key]) {
        operations.push({
          op: "replace",
          path: `${key}`,
          value: updated[key],
        });
      }
    }
    return operations;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://copartners.in:5134/api/AWSStorage?prefix=expertImagePath",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.presignedUrl; // Assuming the response contains the URL of the uploaded image
    } catch (error) {
      console.error("Image upload failed:", error.response ? error.response.data : error.message);
      throw new Error("Image upload failed");
    }
  };

  const handleChange = async () => {
    let uploadedImagePath = imagePath;

    if (typeof imagePath === "object") {
      try {
        uploadedImagePath = await uploadImage(imagePath);
      } catch (error) {
        setError("An error occurred while uploading the image.");
        return;
      }
    }

    const updatedData = {
      name: name,
      mobileNumber: mobileNumber,
      email: email,
      telegramChannel: freeTelegramLink,
      telegramFollower: parseInt(membersInTelegram),
      chatId1: chatIdC,
      chatId2: chatIdE,
      chatId3: chatIdFO,
      premiumTelegramChannel1: premiumTelegramLinkC,
      premiumTelegramChannel2: premiumTelegramLinkE,
      premiumTelegramChannel3: premiumTelegramLinkFO,
      expertImagePath: uploadedImagePath,
      sebiRegNo: sebiRegNo,
      expertTypeId: expertTypeOptions.indexOf(expertTypeId) + 1,
      experience: experienceOptions.indexOf(experienceType) + 1,
    };

    const patchOperations = generatePatchOperations(originalData, updatedData);

    try {
      await api.patch(`/Experts?Id=${stackholderId}`, patchOperations, {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      });
      setSuccess("Profile updated successfully!");
      fetchDetails();
      setError(null);
      setOriginalData(updatedData);
      closeDialog();
      handleSuccess();
    } catch (error) {
      console.error("Profile update failed:", error.response ? error.response.data : error.message);
      setError("An error occurred while updating the profile.");
      setSuccess(null);
    }
  };

  const handleSubClick = (option) => {
    setExpertTypeId(option);
    setIsSubscriptionOpen(false);
  };

  const handleExpClick = (year) => {
    setExperienceType(year);
    setIsExperienceOpen(false);
  };

  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionOpen(!isSubscriptionOpen);
  };

  const toggleExpDropdown = () => {
    setIsExperienceOpen(!isExperienceOpen);
  };

  const closeSubscriptionDropdown = () => {
    setIsSubscriptionOpen(false);
    setIsExperienceOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePath(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePath(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center">
      <div className="fixed inset-0 z-[999] flex items-center py-[8rem] justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-full h-[600px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[24px] leading-[51px] text-new ml-[-0.8rem]">
              Profile Edit
            </h2>
            <button onClick={closeDialog} className="mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] h-[35px]"
              />
            </button>
          </div>
          <div className="flex flex-col mt-8 gap-2 ml-[-1rem]">
            <span className="h-[23px] text-white md:text-[20px] text-[18px] font-inter font-[500] leading-[16px]">
              Upload Profile Image
            </span>
            <label
              htmlFor="fileInput"
              className="relative md:w-[482px] w-[342px] h-[142px] border-2 border-dotted border-[#ffffff] opacity-[50%] rounded-[10px] cursor-pointer"
            >
              <input
                id="fileInput"
                type="file"
                className="absolute inset-0 opacity-0 w-full h-full"
                onChange={handleFileChange}
              />
              <span className="flex items-center justify-center py-14 font-inter font-[400] text-[13px] leading-[16px] text-white opacity-[50%]">
                Select
              </span>
            </label>

            {imagePath && typeof imagePath === "string" && (
              <div className="mt-4">
                <img
                  src={imagePath}
                  alt="Profile Preview"
                  className="w-[100px] h-[100px] rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex md:flex-row flex-col md:justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[80px] w-[60px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="text"
                  id="default-input"
                  placeholder="Name"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[130px] w-[110px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Mobile Number
                </label>
                <input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="number"
                  id="default-input"
                  placeholder="Enter Mobile Number"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[80px] w-[70px] md:h-[26px] h-[25px] rounded-[8px] font-[400] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  MAIL ID
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="email"
                  id="default-input"
                  placeholder="Enter your Mail ID"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="expertTypeId"
                className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[110px] w-[90px] md:h-[26px] h-[25px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
              >
                Expertise In
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    id="expertTypeId"
                    value={expertTypeId}
                    disabled
                    onClick={toggleSubscriptionDropdown}
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                  <img
                    src={dropdown}
                    alt="DropDown"
                    className="absolute inset-y-0 right-3 w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                  />
                </div>
                {isSubscriptionOpen && (
                  <div className="absolute z-10 mt-2 w-[482px] rounded-md bg-white shadow-lg">
                    <ul className="py-1">
                      {expertTypeOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => handleSubClick(option)}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <label
                htmlFor="experienceType"
                className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                    md:w-[100px] w-[80px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] leading-[16px] text-center"
              >
                Experience
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    id="experienceType"
                    value={experienceType}
                    readOnly
                    onClick={toggleExpDropdown}
                    className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  />
                  <img
                    src={dropdown}
                    alt="DropDown"
                    className="absolute inset-y-0 right-3 w-[14px] h-[14px] top-[50%] transform -translate-y-1/2"
                  />
                </div>
                {isExperienceOpen && (
                  <div className="absolute z-10 mt-2 w-[482px] rounded-md bg-white shadow-lg">
                    <ul className="py-1">
                      {experienceOptions.map((year) => (
                        <li
                          key={year}
                          onClick={() => handleExpClick(year)}
                          className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {year}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[220px] w-[190px] md:h-[26px] h-[25px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Free Telegram Channel Link
                </label>
                <input
                  value={freeTelegramLink}
                  onChange={(e) => setFreeTelegramLink(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="link"
                  id="default-input"
                  placeholder="Telegram Channel Link"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[235px] w-[210px] md:h-[26px] h-[25px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Members In Telegram Channel
                </label>
                <input
                  value={membersInTelegram}
                  onChange={(e) => setMembersInTelegram(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="text"
                  id="default-input"
                  placeholder="Enter Members"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[200px] w-[180px] h-[26px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  SEBI Registration Number
                </label>
                <input
                  value={sebiRegNo}
                  onChange={(e) => setSebiRegNo(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="number"
                  id="default-input"
                  placeholder="Enter SEBI Registration Number"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[275px] w-[210px] md:h-[26px] h-[25px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Commodity Premium Telegram Channel
                </label>
                <input
                  value={premiumTelegramLinkC}
                  onChange={(e) => setPremiumTelegramLinkC(e.target.value)}
                  type="link"
                  disabled
                  id="default-input"
                  placeholder="Paste Link"
                  className="md:w-[482px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[140px] w-[80px] h-[26px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Commodity Chat ID
                </label>
                <input
                  value={chatIdC}
                  onChange={(e) => setChatIdC(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="number"
                  disabled
                  id="default-input"
                  placeholder="Enter ChatID"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[245px] w-[210px] md:h-[26px] h-[25px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Equity Premium Telegram Channel
                </label>
                <input
                  value={premiumTelegramLinkE}
                  onChange={(e) => setPremiumTelegramLinkE(e.target.value)}
                  type="link"
                  disabled
                  id="default-input"
                  placeholder="Paste Link"
                  className="md:w-[482px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[110px] w-[80px] h-[26px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  Equity Chat ID
                </label>
                <input
                  value={chatIdE}
                  onChange={(e) => setChatIdE(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="number"
                  disabled
                  id="default-input"
                  placeholder="Enter ChatID"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[235px] w-[210px] md:h-[26px] h-[25px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  F & O Premium Telegram Channel
                </label>
                <input
                  value={premiumTelegramLinkFO}
                  onChange={(e) => setPremiumTelegramLinkFO(e.target.value)}
                  type="link"
                  disabled
                  id="default-input"
                  placeholder="Paste Link"
                  className="md:w-[482px] w-[345px] py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
            <div className="relative">
              <div className="mb-0">
                <label
                  className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%]
                  md:w-[110px] w-[80px] h-[26px] rounded-[8px] font-[400] text-[14px] md:text-[14px] text-[13px] leading-[16px] text-center"
                >
                  F & O Chat ID
                </label>
                <input
                  value={chatIdFO}
                  onChange={(e) => setChatIdFO(e.target.value)}
                  onClick={closeSubscriptionDropdown}
                  type="number"
                  disabled
                  id="default-input"
                  placeholder="Enter ChatID"
                  className="md:w-[482px] w-[345px] px-4 py-2 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between md:mt-8 mt-4 ml-[-16px] md:gap-0 gap-4">
            <button
              onClick={handleChange}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </div>

          {error && <div className="text-red-500 mt-4">{error}</div>}
          {success && <div className="text-green-500 mt-4">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
