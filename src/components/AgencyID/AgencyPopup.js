import { MenuItem, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import close from "../../assets/close.png";
import { toast } from "react-toastify";

const AgencyPopup = ({ onClose, selectedAgency, onSubmit, agencyId }) => {
  const [RAName, setRAName] = useState("");
  const [link, setLink] = useState("");
  const [RAList, setRAList] = useState([]);

  useEffect(() => {
    if (selectedAgency) {
      setRAName(selectedAgency.expertsId);
      setLink(selectedAgency.link);
    } else {
      setRAName("");
      setLink("");
    }
  }, [selectedAgency]);

  useEffect(() => {
    const fetchRAList = async () => {
      try {
        const response = await fetch('https://copartners.in:5132/api/Experts?page=1&pageSize=10000');
        if (!response.ok) {
          throw new Error('Failed to fetch RA list');
        }
        const data = await response.json();
        setRAList(data.data);
      } catch (error) {
        console.error('Error fetching RA list:', error);
      }
    };

    fetchRAList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!RAName.trim() || !link.trim()) {
      alert("Please fill out all fields");
      return;
    }

    const formData = {
      advertisingAgencyId: agencyId,
      expertsId: RAName,
      link: link,
      isActive: true,
    };

    const url = selectedAgency
      ? `https://copartners.in:5134/api/ExpertsAdvertisingAgency/${selectedAgency.id}`
      : `https://copartners.in:5134/api/ExpertsAdvertisingAgency`;

    const method = selectedAgency ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success(`Agency ${selectedAgency ? 'updated' : 'added'} successfully!`);
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${selectedAgency ? 'update' : 'add'} agency: ${error.message}`);
    }
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
        <div className="font-semibold text-2xl px-12 py-4 flex flex-col gap-4 text-left">
          <div className="relative flex flex-col w-1/2">
            <TextField
              select
              id="RA-name"
              label="RA"
              value={RAName}
              onChange={(e) => setRAName(e.target.value)}
              variant="outlined"
              fullWidth
              required
            >
              {RAList.map((ra) => (
                <MenuItem key={ra.id} value={ra.id}>
                  {ra.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="flex flex-col">
            <TextField
              id="link"
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
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
};

export default AgencyPopup;
