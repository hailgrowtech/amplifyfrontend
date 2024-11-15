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

const AddRALogin = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [raList, setRaList] = useState([]);

  const fetchRAList = async () => {
    try {
      const response = await fetch("https://copartners.in:5132/api/Experts?page=1&pageSize=10000");
      const result = await response.json();
      if (result.isSuccess) {
        setRaList(result.data);
      } else {
        throw new Error("Failed to fetch RA list");
      }
    } catch (error) {
      console.error("Error fetching RA list:", error);
      toast.error("Failed to fetch RA list");
    }
  };

  useEffect(() => {
    fetchRAList();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSelectChange = (e) => {
    const selectedRA = raList.find((ra) => ra.id === e.target.value);
    setFormData({
      ...formData,
      name: selectedRA.name,
      email: selectedRA.email,
      mobile: selectedRA.mobileNumber,
      raId: selectedRA.id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAdmin = {
      userId: formData.raId,
      stackholderId: formData.raId,
      userType: "RA",
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
        const errorText = await saveResponse.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to save RA admin data");
      }

      console.log(result);
      onSave();
      toast.success("RA admin added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(`${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-left">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            Add Login Credentials
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
              value={formData.raId}
              onChange={handleSelectChange}
              label="Name"
            >
              {raList.map((ra) => (
                <MenuItem key={ra.id} value={ra.id}>
                  {ra.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="email"
            label="Email ID"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            disabled
          />
          <TextField
            id="mobile"
            label="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
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

export default AddRALogin;
