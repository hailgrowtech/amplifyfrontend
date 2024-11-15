import React, { useEffect, useState } from "react";
import { close } from "../../assets";

const LinkPopup = ({ onClose, inviteLink }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    // Disable scroll on the body when the popup is open
    document.body.style.overflow = "hidden";

    // Re-enable scroll when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleInviteLink = (link) => {
    window.location.reload();
    localStorage.removeItem("inviteLink");
    window.open(link, "_blank");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#18181b] border-[1px] border-[#ffffff24] rounded shadow-md w-[90%] md:w-[400px] relative">
        <button className="absolute top-3 right-1" onClick={handleClose}>
          <img src={close} alt="close" className="h-8 w-8" />
        </button>
        <div className="border-b-2 py-3 px-6">
          <h2 className="md:text-2xl text-xl font-bold subheading-color text-left">
            Join Your Telegram Channel
          </h2>
        </div>
        <div className="flex flex-col px-6 py-3">
          <div className="text-sm mb-4 text-white">
            Click the button below to join the Telegram channel:
          </div>
          {inviteLink ? (
            <button
              onClick={() => handleInviteLink(inviteLink)}
              className="justify-center items-center flex mb-4 md:mb-2 md:text-lg text-sm rounded-lg py-4 text-white bg-[#0081F1] hover:bg-[#006bbd] transition-colors duration-300"
            >
              Join Now
            </button>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkPopup;
