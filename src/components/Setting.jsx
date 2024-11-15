import React, { useEffect, useState } from "react";
import {
  edit,
  mail,
  phone,
  sebi,
  telegramIcon,
  arrow,
  userBck,
  stars,
  card,
  location,
  location1,
  pancard,
} from "../assets";
import ProfileEdit from "./ProfileEdit";
import BankEditDialog from "./BankEditDialog";
import AddBankDialog from "./AddBankDialog";
import AddUpiDialog from "./AddUpiDialog";
import UpiEditDialog from "./UpiEditDialog";
import axios from "axios";
import DocumentEditPopup from "./DocumentEditPopup";

const Setting = ({stackholderId}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditBankOpen, setIsEditBankOpen] = useState(false);
  const [isEditUpiOpen, setIsEditUpiOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [isAddUpiOpen, setIsAddUpiOpen] = useState(false);
  const [myCard, setMyCard] = useState(null);
  const [relationId, setRelationId] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [upiDetails, setUpiDetails] = useState(null);
  const [withdrawalAmount, setWithDrawalAmount] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [documentEdit, setDocumentEdit] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const withdrawal_api = `https://copartners.in:5135/api/Withdrawal/BankUPIByUserId/${stackholderId}?userType=RA&page=1&pageSize=100000`;

  const fetchData = async () => {
    try {
      const res = await axios.get(withdrawal_api);
      setWithDrawalAmount(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [withdrawal_api]);

  const deleteBankDetails = () => {
    console.log("Delete it");
  };

  const fetchDetails = async () => {
    try {
      const { data: expertData } = await axios.get(
        `https://copartners.in:5132/api/Experts/${stackholderId}`
      );
      setMyCard(expertData.data);

      const relationId = expertData.data.relationshipManagerId;
      const { data: relationshipManagerData } = await axios.get(
        `https://copartners.in:5134/api/RelationshipManager/${relationId}`
      );
      setRelationId(relationshipManagerData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [stackholderId]);

  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(
    "Hello, I am your trusted guide in Equity Trading. As a SEBI-registered research analyst with over a decade of experience, I have a  specialisation in making the stock market easy to understand and navigate. With a keen eye for market trends and a deep understanding of financial analysis I provide clear and reliable advice, helping you make informed investment decisions. Whether you're just starting out or looking to improve your trading skills, I  am here to support you on your journey to financial success."
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (event) => {
    setAboutText(event.target.value);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const openEditBankDialog = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsEditBankOpen(true);
  };

  const openEditUpiDialog = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsEditUpiOpen(true);
  };

  const openAddBankDialog = () => {
    setIsAddBankOpen(true);
  };
  const saveBankDetails = (details) => {
    setBankDetails(details);
  };

  const saveUpiDetails = (details) => {
    setUpiDetails(details);
  };

  const openUpiDialog = () => {
    setIsAddUpiOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditBankOpen(false);
    setIsEditUpiOpen(false);
    setIsAddBankOpen(false);
    setIsAddUpiOpen(false);
  };

  const openEditPopup = () => {
    setDocumentEdit(true);
  };

  const closeEditPopup = () => {
    setDocumentEdit(false);
  };

  const getExpertType = (typeId) => {
    switch (typeId) {
      case 1:
        return "Commodity";
      case 2:
        return "Equity";
      case 3:
        return "Futures & Options";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="pb-[5rem] xl:pl-[18rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="xl:w-[1530px] md:w-[1122px] xl -h-[480px] md:h-[580px] w-[361px] h-[650px] md:ml-0 ml-[-8px] bg_cards p-4 rounded-[24px]">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="flex flex-col gap-2">
                <span className="font-inter font-[700] md:text-[47px] text-[26px] md:leading-[60px] leading-[30px] text-gradient">
                  {myCard && myCard.channelName}
                </span>
                <span className="text-white font-inter font-[500] md:text-[17px] text-[12px] md:leading-[22px]">
                  {myCard && myCard.name} -{" "}
                  {myCard && getExpertType(myCard.expertTypeId)}
                </span>
              </div>
              <div className="md:w-[278px] w-[176px] mt-2 md:h-[53px] h-[25px] flex flex-row justify-between">
                <div className="md:w-[84px] w-[54px] md:h-[53px] h-[25px] flex flex-col">
                  <span className="text-[#E4E4E7] opacity-[40%] font-[400] md:text-[14px] text-[10px] md:leading-[17px] leading-[12px] font-inter md:w-[83px] w-[56px] md:h-[17px]">
                    Experience
                  </span>
                  <span className="text-white md:w-[83px] w-[54px] md:h-[20] h-[12px] font-[600] md:text-[16px] text-[10px] text-center leading-[20px]">
                    {myCard && myCard.experience}+
                  </span>
                </div>
                <div className="bg-white w-[1px] md:h-[35px] h-[22px]"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[#E4E4E7] opacity-[40%] font-[400] md:text-[14px] text-[10px] md:leading-[17px] leading-[12px] font-inter md:w-[83px] w-[56px] md:h-[17px]">
                    Followers
                  </span>
                  <span className="text-white md:w-[83px] w-[54px] md:h-[20] h-[12px] font-[600] md:text-[16px] text-[10px] text-center leading-[20px]">
                    {`${myCard && myCard.telegramFollower / 1000}k`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-0 justify-between md:pt-0 pt-[1rem]">
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={mail}
                    alt="Mail"
                    className="md:w-[24px] w-[16px] md:h-[24px] h-[16px]"
                  />
                  <span className="text-white opacity-[50%] font-inter font-[500] md:text-[16px] text-[12px] leading-[28px]">
                    {myCard && myCard.email}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={phone}
                    alt="Phone"
                    className="md:w-[24px] w-[16px] md:h-[24px] h-[16px]"
                  />
                  <span className="text-white opacity-[50%] font-inter font-[500] md:text-[16px] text-[12px] leading-[28px]">
                    {myCard && myCard.mobileNumber}
                  </span>
                </div>
              </div>

              <div className="flex py-2 items-center gap-2">
                <img
                  src={sebi}
                  alt="SEDI_User"
                  className="md:w-[24px] w-[16px] md:h-[24px] h-[16px]"
                />
                <span className="text-white opacity-[50%] font-[500] font-inter md:text-[16px] text-[12px] leading-[28px]">
                  SEBI - {myCard && myCard.sebiRegNo}
                </span>
              </div>

              <div className="flex md:flex-row flex-col md:items-center gap-2 md:py-3 py-2">
                <div className="flex md:flex-row flex-col md:gap-8 gap-4">
                  <div className="text-white flex items-center gap-2">
                    <img src={card} alt="" className="w-[18px] h-[18px]" />
                    <span>{myCard && myCard.pan}</span>
                  </div>
                  <div className="text-white flex items-center gap-2">
                    <img src={location} alt=" " className="w-[18px] h-[18px]" />
                    <span>{myCard && myCard.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 md:py-3 py-2 md:ml-0 ml-[0.6rem]">
                <div className="flex flex-row gap-4">
                  <div className="text-white flex items-center gap-2 justify-center">
                    <img src={location1} alt="" className="w-[18px] h-[18px]" />
                    <span>{myCard && myCard.state}</span>
                  </div>
                  <div className="text-white flex items-center gap-2">
                    <img src={pancard} alt="" className="w-[18px] h-[18px]" />
                    <span>{myCard && myCard.gst}</span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-row flex-col md:ml-0 ">
                <div className="absolute flex md:flex-row z-[9] flex-col md:gap-4 justify-center md:items-center md:ml-0 ml-[-6px]">
                  <button className="md:w-[320px] md:h-[31px] h-[23px] flex items-center justify-center rounded-[21.5px] border-solid border-[1px] border-[#4e4e4ecc] mt-2 md:mt-0">
                    <button className="flex justify-center md:p-2 items-center gap-2">
                      <img
                        src={telegramIcon}
                        alt="Telegram"
                        className="md:w-[18.6px] w-[14px] h-[14px] md:h-[18.6px]"
                      />
                      <span className="md:w-[240px] h-[13px] md:h-[23px] text-white font-[400] md:text-[12px] text-[8px] md:leading-[22px] leading-[12px]">
                        {myCard && myCard.premiumTelegramChannel1}
                      </span>
                      <img
                        src={arrow}
                        alt="arrow"
                        className="md:w-[13px] w-[10px] h-[10px] md:h-[13px]"
                      />
                    </button>
                  </button>
                  <button className="md:w-[320px] w-[255px] md:h-[31px] h-[23px] flex items-center justify-center rounded-[21.5px] border-solid border-[1px] border-[#4e4e4ecc] mt-2 md:mt-0">
                    <button className="flex justify-center items-center gap-2">
                      <img
                        src={telegramIcon}
                        alt="Telegram"
                        className="md:w-[18.6px] w-[14px] h-[14px] md:h-[18.6px]"
                      />
                      <span className="md:w-[240px] h-[13px] md:h-[23px] text-white font-[400] md:text-[12px] text-[8px] md:leading-[22px] leading-[12px]">
                        {myCard && myCard.premiumTelegramChannel2}
                      </span>
                      <img
                        src={arrow}
                        alt="arrow"
                        className="md:w-[13px] w-[10px] h-[10px] md:h-[13px]"
                      />
                    </button>
                  </button>
                  <button className="md:w-[320px] w-[255px] md:h-[31px] h-[23px] flex items-center justify-center rounded-[21.5px] border-solid border-[1px] border-[#4e4e4ecc] mt-2 md:mt-0">
                    <button className="flex justify-center items-center gap-2">
                      <img
                        src={telegramIcon}
                        alt="Telegram"
                        className="md:w-[18.6px] w-[14px] h-[14px] md:h-[18.6px]"
                      />
                      <span className="md:w-[240px] h-[13px] md:h-[23px] text-white font-[400] md:text-[12px] text-[8px] md:leading-[22px] leading-[12px]">
                        {myCard && myCard.premiumTelegramChannel3}
                      </span>
                      <img
                        src={arrow}
                        alt="arrow"
                        className="md:w-[13px] w-[10px] h-[10px] md:h-[13px]"
                      />
                    </button>
                  </button>
                </div>
              </div>

              <span className="text-white opacity-[50%] font-[500] font-inter md:text-[20px] text-[14px] md:leading-[25px] md:mt-[3rem] mt-[7rem]">
                Your Relationship Manager
              </span>

              <div className="flex md:flex-row flex-col">
                <div className="flex absolute md:gap-6 gap-3 md:flex-row flex-col mt-4">
                  <div className="flex flex-row items-center md:w-[245px] w-[147px] md:h-[50px] h-[30px]">
                    <span className="text-white opacity-[50%] font-inter font-[500] md:text-[16px] text-[10px] md:leading-[28px] leading-[17px] md:w-[55px] w-[33px] md:h-[28px] h-[17px]">
                      Name:
                    </span>
                    <span className="bg-[#22262F] md:w-[180px] w-[108px] md:ml-0 ml-2 md:h-[50px] h-[30px] rounded-[30px] text-white font-[500] md:text-[16px] text-[10px] md:p-0 p-1 text-center flex items-center justify-center">
                      {relationId && relationId.name}
                    </span>
                  </div>
                  <div className="flex flex-row items-center md:w-[317px] w-[192px] md:h-[50px] h-[30px]">
                    <span className="text-white opacity-[50%] font-inter font-[500] md:text-[16px] text-[10px] md:leading-[28px] leading-[17px] md:w-[127px] w-[90px] md:h-[28px] h-[17px]">
                      Mobile Number:
                    </span>
                    <span className="bg-[#22262F] md:w-[180px] w-[108px] md:h-[50px] h-[30px] rounded-[30px] text-white font-[500] md:text-[16px] text-[10px] md:leading-[28px] leading-[17px] p-2 text-center">
                      {relationId && relationId.mobile}
                    </span>
                  </div>
                  <div className="flex flex-row gap-1 items-center md:w-[330px] w-[198px] md:h-[50px] h-[30px]">
                    <span className="text-white opacity-[50%] font-inter font-[500] md:text-[16px] text-[10px] md:leading-[28px] leading-[17px] md:w-[62px] w-[37px] md:h-[28px] h-[17px]">
                      Mail ID:
                    </span>
                    <span className="bg-[#22262F] md:w-[258px] w-[155px] md:h-[50px] h-[30px] rounded-[30px] text-white font-[500] md:text-[16px] text-[10px] md:leading-[28px] leading-[28px] md:p-2 text-center">
                      {relationId && relationId.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:h-[344px] sm:h-[240px] md:max-h-[250px] max-h-[180px] md:right-0 right-[2rem] relative profile-image_1 mb-4">
              <img
                src={userBck}
                alt="background"
                className="absolute top-0 md:left-0 w-full h-full object-contain rounded-t-[11px]"
              />
              <img
                src={myCard && myCard.expertImagePath}
                alt="User"
                className="absolute top-0 w-32 md:right-0 left-[2rem] md:w-full h-full object-contain rounded-t-[11px]"
              />
            </div>

            <div className="flex md:ml-[-4rem] ml-[-7rem] flex-col items-start md:gap-[16rem] gap-[10rem]">
              <div className="flex flex-row gap-2 w-[70px] h-[32px]">
                <img
                  src={stars}
                  alt={myCard && myCard.rating}
                  className="md:w-[25px] w-[14px] md:h-[25px] h-[14px]"
                />
                <span className="md:w-[38px] w-[22px] md:h-[32px] h-[19px] font-[600] md:text-[25px] text-[15px] md:leading-[31px] leading-[18px] text-[#E1E1E3]">
                  {myCard && myCard.rating}
                </span>
              </div>
              <div className="rounded-[36px] border border-[#fffff] flex justify-center items-center md:w-[80px] w-[50px]">
                <button
                  onClick={openDialog}
                  className="flex flex-row gap-2 justify-center items-center"
                >
                  <img
                    src={edit}
                    alt="Edit"
                    className="md:w-[16px] w-[8px] md:h-[16px] h-[8px]"
                  />
                  <span className="text-white font-[400] md:text-[15px] text-[7.5px] md:leading-[28px] leading-[14px]">
                    Edit
                  </span>
                </button>
                {isDialogOpen && (
                  <ProfileEdit
                    isDialogOpen={isDialogOpen}
                    closeDialog={closeDialog}
                    fetchDetails={fetchDetails}
                    stackholderId={stackholderId}
                    myCard={myCard}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:w-[1520px] md:w-[1120px] md:h-auto w-[363px] h-auto px-4 p-8 border-2 border-[#202F49] rounded-[30px] flex gap-4 flex-col md:mt-[4rem] mt-[2rem] md:ml-0 ml-[-0.5rem]">
        <div className="flex flex-row items-center justify-between">
          <span className="text-white font-inter font-[600] text-[22px] leading-[26px]">
            About
          </span>
          <div className="w-[93px] h-[32px] rounded-[36px] bg-gradient flex justify-center items-center md:mr-0 mr-[-8px]">
            {isEditing ? (
              <button
                className="flex flex-row gap-2 justify-center items-center w-[64px] md:h-[32px] h-[22px] rounded-[36px] bg-blue-600"
                onClick={handleSaveClick}
              >
                <button className="text-white md:text-[16px] text-[10px] md:leading-[26px] leading-[20px]">
                  Save
                </button>
              </button>
            ) : (
              <button
                className="flex flex-row md:w-[93px] w-[64px] md:h-[32px] h-[22px] rounded-[36px] border-solid border-[1px] border-white gap-2 justify-center items-center"
                onClick={handleEditClick}
              >
                <img
                  src={edit}
                  alt="Edit"
                  className="md:w-[16px] w-[12px] h-[12px] md:h-[16px]"
                />
                <button className="text-white md:text-[16px] text-[10px] md:leading-[26px] leading-[20px]">
                  Edit
                </button>
              </button>
            )}
          </div>
        </div>
        <div className="text-white opacity-[50%] flex flex-col">
          {isEditing ? (
            <textarea
              value={aboutText}
              onChange={handleInputChange}
              className="bg-transparent border-none resize-y outline-none text-white"
              style={{ height: "320px" }}
            />
          ) : (
            <span className="md:text-[20px] md:leading-[26px] text-[14px] leading-[18px]">
              {aboutText}
            </span>
          )}
        </div>
      </div>

      <div className="xl:w-[1520px] md:w-[1120px] md:h-auto w-[360px] px-4 p-8 border-2 border-[#202F49] rounded-[30px] flex gap-4 flex-col md:mt-[4rem] mt-[2rem] md:ml-0 ml-[-0.5rem]">
        <div className="flex flex-row justify-between">
          <span className="text-white font-inter font-[600] text-[22px] leading-[26px]">
            Documents
          </span>
          <div className="md:w-[93px] w-[64px] md:h-[32px] h-[22px] rounded-[36px] border border-[#fffff] flex justify-center items-center">
            <button
              className="flex flex-row items-center gap-2 justify-center"
              onClick={openEditPopup}
            >
              <img
                src={edit}
                alt="Edit"
                className="md:w-[16px] w-[12px] h-[12px] md:h-[16px]"
              />
              <span className="text-white md:text-[16px] text-[10px] md:leading-[26px] leading-[20px]">
                Edit
              </span>
            </button>
          </div>
        </div>

        <label
          htmlFor="fileInput"
          className="relative w-[236px] h-[180px] border-2 border-dotted border-[#ffffff]"
        >
          {!filePreview ? (
            <>
              <img
                src={myCard?.signatureImage} // Replace with your addDoc icon path
                alt=""
                className="w-[95px] h-[95px] ml-16 mt-[2rem]"
              />
            </>
          ) : (
            <div className="relative w-full h-full flex justify-center items-center">
              <img
                src={filePreview}
                alt="Preview"
                className="max-w-full max-h-full"
              />
            </div>
          )}
        </label>

        {documentEdit && (
          <DocumentEditPopup
            onClose={closeEditPopup}
            stackholderId={stackholderId}
          />
        )}
      </div>

      <div className="xl:w-[1520px] md:w-[1120px] md:h-[297px] w-[360px] px-4 p-8 border-2 border-[#202F49] rounded-[30px] rounded-[30px] flex gap-4 flex-col md:mt-[4rem] mt-[2rem] md:ml-0 ml-[-0.5rem]">
        <div className="flex flex-row justify-between">
          <span className="text-white font-inter font-[600] md:text-[22px] text-[18px] leading-[21px] md:leading-[26px]">
            Bank Details
          </span>
          <div className="md:w-[128px] w-[68px] h-[30px] md:h-[32p] rounded-[10px] border-2 border-dotted border-[#ffffff] flex justify-center items-center">
            <button
              onClick={openAddBankDialog}
              className="flex flex-row items-center gap-2 justify-center"
            >
              <span className="text-white font-[400] md:text-[15px] text-[10.5px] leading-[5.7px] md:leading-[28px]">
                +Add Bank
              </span>
            </button>

            {isAddBankOpen && (
              <AddBankDialog
                fetchData={fetchData}
                isOpen={isAddBankOpen}
                onClose={closeDialog}
                saveBankDetails={saveBankDetails}
              />
            )}
          </div>
        </div>

        <div className="flex flex-row items-center mt-4 justify-between">
          <button className="md:w-full w-[260px] md:h-[76px] rounded-[16px] border-[#40495C] flex md:flex-row flex-col gap-4">
            {withdrawalAmount.map((withdrawal, index) => {
              if (withdrawal.paymentMode === "Bank") {
                return (
                  <button
                    key={index}
                    onClick={() => openEditBankDialog(withdrawal)}
                    className="md:w-[310px] w-[200px] md:h-[70px] h-[70px] text-white rounded-[16px] border border-[#40495C] bg-[#282F3E]"
                  >
                    <div className="flex md:ml-8 ml-6 items-start md:flex-col">
                      <div className="flex flex-col md:items-start items-center">
                        <span className="text-[16px] font-[600]">
                          {withdrawal.bankName}
                        </span>
                        <span className="text-[14px]">
                          {withdrawal.accountNumber}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              } else {
                return null;
              }
            })}
          </button>
          {isEditBankOpen && (
            <BankEditDialog
              isEditBankOpen={isEditBankOpen}
              closeDialog={closeDialog}
              saveBankDetails={saveBankDetails}
              selectedWithdrawal={selectedWithdrawal}
              deleteBankDetails={deleteBankDetails}
              stackholderId={stackholderId}
              fetchData={fetchData}
            />
          )}
        </div>

        {/* <hr className="bg-white opacity-[50%] mt-6" /> */}

        {/* <div className="flex flex-row items-center mt-6 justify-between">
          <span className="text-white font-inter font-[600] md:text-[22px] text-[18px] leading-[21px] md:leading-[26px]">
            UPI Details
          </span>
          <button
            onClick={openUpiDialog}
            className="md:w-[128px] w-[68px] md:h-[32px] h-[30px] border-dotted border-[#ffffff] rounded-[10px] border text-white font-[600] font-inter text-[12px]"
          >
            <span className="text-white font-[400] md:text-[15px] text-[10.5px] leading-[5.7px] md:leading-[28px]">
              +Add UPI
            </span>
          </button>
          {isAddUpiOpen && (
            <AddUpiDialog
              isOpen={isAddUpiOpen}
              onClose={closeDialog}
              saveUpiDetails={saveUpiDetails}
              fetchData={fetchData}
            />
          )}
        </div> */}

        <div className="flex flex-row items-center mt-4 justify-between">
          <button className="md:w-full w-[260px] md:h-[76px] rounded-[16px] border-[#40495C] flex md:flex-row flex-col gap-4">
            {withdrawalAmount.map((withdrawal, index) => {
              if (withdrawal.paymentMode === "UPI") {
                return (
                  <button
                    key={index}
                    onClick={() => openEditUpiDialog(withdrawal)}
                    className="md:w-[310px] w-[200px]  h-[50px] text-white rounded-[16px] border border-[#40495C] bg-[#282F3E]"
                  >
                    <div className="flex justify-center items-start md:ml-4 md:flex-col">
                      <span className="text-[16px] font-[600]">
                        {withdrawal.upI_ID}
                      </span>
                    </div>
                  </button>
                );
              } else {
                return null;
              }
            })}
          </button>
          {isEditUpiOpen && (
            <UpiEditDialog
              isOpen={isEditUpiOpen}
              onClose={closeDialog}
              selectedWithdrawal={selectedWithdrawal}
              fetchData={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
