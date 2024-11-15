import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import close from "../../assets/close.png";

function AdAgencyPopup({ onClose, onSubmit, selectedAgency }) {
  const [agencyName, setAgencyName] = useState("");
  const [landingPageLink, setLandingPageLink] = useState("");

  useEffect(() => {
    if (selectedAgency) {
      setAgencyName(selectedAgency.agencyName);
      setLandingPageLink(selectedAgency.link);
    } else {
      setAgencyName("");
      setLandingPageLink("");
    }
  }, [selectedAgency]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!agencyName.trim() || !landingPageLink.trim()) {
      alert(`Input fields cannot be empty!`);
      return;
    }
    const formData = { agencyName, link: landingPageLink };

    if (selectedAgency) {
      const updatedAgency = { ...selectedAgency, ...formData };
      onSubmit(updatedAgency);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            {selectedAgency ? "Edit" : "Add"}
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={close} alt="" />
          </button>
        </div>
        <div className="font-semibold text-2xl px-12 py-4 flex flex-col gap-12 text-left">
          <div className="relative flex flex-col w-1/2">
            <TextField
              id="agency-name"
              label="Agency Name"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div className="flex flex-col">
            <TextField
              id="landing-page-link"
              label="Landing Page Link"
              value={landingPageLink}
              onChange={(e) => setLandingPageLink(e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              required
            />
          </div>
        </div>
        <button
          className="px-12 bg-blue-500 text-white py-2 border-2 rounded-lg mb-8"
          onClick={handleSubmit}
        >
          {selectedAgency ? "Save Changes" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default AdAgencyPopup;
