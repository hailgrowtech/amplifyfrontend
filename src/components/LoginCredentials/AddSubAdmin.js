import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import closeIcon from "../../assets/close.png";
import { toast } from "react-toastify";

const AddSubAdmin = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Validate fields
    if (id === "email") {
      validateEmail(value);
    } else if (id === "mobile") {
      validateMobile(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Invalid mobile number format",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.email || errors.mobile) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    const newAdmin = {
      userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      stackholderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      userType: "SA",
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
        throw new Error("Failed to save sub-admin data");
      }
      console.log(result);
      onSave();
      toast.success("Sub-admin added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save sub-admin data");
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
          className="px-12 py-4 grid grid-cols-2 gap-6"
        >
          <TextField
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            id="email"
            label="Email ID"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            id="mobile"
            label="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            variant="outlined"
            type="number"
            fullWidth
            required
            error={!!errors.mobile}
            helperText={errors.mobile}
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

export default AddSubAdmin;
