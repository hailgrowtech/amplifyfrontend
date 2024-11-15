import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import closeIcon from "../../assets/close.png";
import { toast } from "react-toastify";

const AddAffiliatePartner = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [apList, setApList] = useState([]);

  const fetchAPList = async () => {
    try {
      const response = await fetch(
        "https://copartners.in:5133/api/AffiliatePartner?page=1&pageSize=10000"
      );
      const result = await response.json();
      if (result.isSuccess) {
        setApList(result.data);
      } else {
        throw new Error("Failed to fetch affiliate partner list");
      }
    } catch (error) {
      console.error("Error fetching affiliate partner list:", error);
      toast.error("Failed to fetch affiliate partner list");
    }
  };

  useEffect(() => {
    fetchAPList();
  }, []);

  const handleSelectChange = (e) => {
    const selectedAP = apList.find((ap) => ap.id === e.target.value);
    setFormData({
      ...formData,
      name: selectedAP.name,
      email: selectedAP.email,
      mobile: selectedAP.mobileNumber,
      apId: selectedAP.id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAdmin = {
      userId: formData.apId,
      stackholderId: formData.apId,
      userType: "AP",
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile,
      password: "Copartner@1234#",
      isActive: true,
    };

    try {
      const saveResponse = await fetch("https://copartners.in:5130/api/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });
      const result = await saveResponse.json();

      if (!result.isSuccess) {
        throw new Error("Failed to save affiliate partner data");
      }
      console.log(result);
      onSave();
      toast.success("Affiliate partner added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save affiliate partner data");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-left">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            Add Affiliate Partner
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={closeIcon} alt="Close" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-12 py-4 grid grid-cols-2 gap-8"
        >
          <FormControl variant="outlined" fullWidth required>
            <InputLabel id="name-label">Name</InputLabel>
            <Select
              labelId="name-label"
              id="name"
              value={formData.apId}
              onChange={handleSelectChange}
              label="Name"
            >
              {apList.map((ap) => (
                <MenuItem key={ap.id} value={ap.id}>
                  {ap.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="email"
            label="Email ID"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            variant="outlined"
            fullWidth
            required
            disabled
          />
          <TextField
            id="mobile"
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            variant="outlined"
            fullWidth
            required
            disabled
          />
          <div className="flex col-span-2 justify-center">
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAffiliatePartner;
