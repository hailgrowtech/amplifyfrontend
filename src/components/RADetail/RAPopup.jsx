import React, { useState, useEffect } from "react";
import { Input, MenuItem, TextField, Switch, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "../../assets/close.png";

function RAPopup({ onClose, onSave, mode, initialValues }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [copartnerChecked, setCopartnerChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const isViewMode = currentMode === "view";
  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    sebiRegNo: "",
    mobileNumber: "",
    email: "",
    expertTypeId: "",
    experience: "",
    channelName: "",
    rating: "",
    telegramFollower: "",
    fixCommission: "",
    telegramChannel: "",
    premiumTelegramChannel1: "",
    premiumTelegramChannel2: "",
    premiumTelegramChannel3: "",
    expertImagePath: null,
    sebiRegCertificatePath: null,
    pan: "",
    address: "",
    state: "",
    signatureImage: null,
    gst: "",
    isCoPartner: true,
    isActive: true,
    chatId1: "",
    chatId2: "",
    chatId3: "",
  });
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (initialValues && (mode === "edit" || mode === "view")) {
      setFormData({ ...initialValues });
      setOriginalData({ ...initialValues });
      setCopartnerChecked(initialValues.isCoPartner);
    }
  }, [mode, initialValues]);

  const handleCopartnerChange = () => {
    setCopartnerChecked(!copartnerChecked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "mobileNumber") {
      const mobilePattern = /^[0-9]{10}$/;
      if (!mobilePattern.test(value)) {
        newErrors.mobileNumber = "Invalid mobile number";
      } else {
        delete newErrors.mobileNumber;
      }
    }

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        newErrors.email = "Invalid email address";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "fixCommission") {
      if (parseInt(value) > 20) {
        newErrors.fixCommission = "Commission fix cannot exceed 20%";
      } else {
        delete newErrors.fixCommission;
      }
    }

    setErrors(newErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file, file.name);

        const response = await fetch(
          "https://copartners.in:5134/api/AWSStorage?prefix=Images",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const data = await response.json();
        const presignedURL = data.data.presignedUrl;

        console.log(`File uploaded successfully: ${presignedURL}`);

        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: presignedURL,
        }));

        toast.success(`${name} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${name}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert("Please correct the inputs before submitting.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      isCoPartner: copartnerChecked,
    };

    const url =
      currentMode === "add"
        ? "https://copartners.in:5132/api/Experts"
        : `https://copartners.in:5132/api/Experts?Id=${formData.id}`;
    const method = currentMode === "add" ? "POST" : "PATCH";

    let patchData = [];

    if (currentMode === "edit") {
      for (const key in dataToSubmit) {
        if (dataToSubmit[key] !== originalData[key]) {
          patchData.push({
            path: key,
            op: "replace",
            value: dataToSubmit[key],
          });
        }
      }
    }

    try {
      setLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(method === "PATCH" ? patchData : dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      onSave();
      toast.success("Data saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = (fields) => {
    return fields.map((field) => {
      const isFieldFilled = !!formData[field.name];
      const isDisabled =
        currentMode === "view" ||
        (currentMode === "edit" &&
          (field.name === "name" || field.name === "sebiRegNo")) ||
        (field.name === "fixCommission" && !copartnerChecked);

      const inputClasses = `w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ${
        isFieldFilled && !isViewMode ? "bg-gray-100" : ""
      }`;

      return (
        <div key={field.name}>
          {field.type === "file" ? (
            <div>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              {isFieldFilled && currentMode === "edit" ? (
                <div>
                  <a
                    href={formData[field.name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View {field.label}
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        [field.name]: "",
                      }))
                    }
                    className="ml-4 text-blue-500 underline"
                  >
                    Change {field.label}
                  </button>
                </div>
              ) : (
                <Input
                  type="file"
                  name={field.name}
                  fullWidth
                  required={field.required}
                  disabled={isDisabled}
                  inputProps={{ ...field.inputProps, id: field.name }}
                  onChange={handleFileChange}
                  className={inputClasses}
                />
              )}
            </div>
          ) : field.name === "expertTypeId" ? (
            <TextField
              select
              label={field.label}
              value={formData[field.name]}
              name={field.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required={field.required}
              disabled={isDisabled}
              className={`${inputClasses} h-14`}
            >
              <MenuItem value={1}>Commodity</MenuItem>
              <MenuItem value={2}>Equity</MenuItem>
              <MenuItem value={3}>Futures & Options</MenuItem>
            </TextField>
          ) : (
            <TextField
              label={field.label}
              value={formData[field.name]}
              name={field.name}
              onChange={handleChange}
              type={field.type || "text"}
              variant="outlined"
              fullWidth
              required={field.required}
              disabled={isDisabled}
              inputProps={field.inputProps}
              className={inputClasses}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
            />
          )}
        </div>
      );
    });
  };

  const formFields = [
    { name: "name", label: "R.A Name", required: true },
    { name: "legalName", label: "Legal Name", required: true },
    { name: "sebiRegNo", label: "SEBI No.", required: true },
    {
      name: "mobileNumber",
      label: "Mobile Number",
      required: true,
      type: "number",
    },
    { name: "email", label: "Mail ID", required: true },
    { name: "expertTypeId", label: "Type", required: true },
    { name: "experience", label: "Experience", required: true, type: "number" },
    { name: "channelName", label: "Channel Name", required: true },
    { name: "rating", label: "Rating", required: true, type: "number" },
    {
      name: "telegramFollower",
      label: "Followers",
      required: true,
      type: "number",
    },
    {
      name: "fixCommission",
      label: "Commission Fix",
      type: "number",
    },
    { name: "telegramChannel", label: "Telegram Channel Link", required: true },
    { name: "premiumTelegramChannel1", label: "Premium Channel C Link" },
    { name: "premiumTelegramChannel2", label: "Premium Channel E Link" },
    { name: "premiumTelegramChannel3", label: "Premium Channel FO Link" },
    { name: "chatId1", label: "Chat ID C" },
    { name: "chatId2", label: "Chat ID E" },
    { name: "chatId3", label: "Chat ID FO" },
    {
      name: "pan",
      label: "PAN Card",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      required: true,
    },
    {
      name: "state",
      label: "State",
      required: true,
    },
    {
      name: "gst",
      label: "GST Number",
    },
    {
      name: "expertImagePath",
      label: "Profile Image",
      type: "file",
      required: true,
      inputProps: { accept: "image/*" },
    },
    {
      name: "signatureImage",
      label: "Signature Image",
      type: "file",
      required: true,
      inputProps: { accept: "image/*" },
    },
    {
      name: "sebiRegCertificatePath",
      label: "SEBI Reg. Certificate",
      type: "file",
      required: true,
      inputProps: { accept: "image/*" },
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 max-h-screen overflow-y-auto text-center">
        <div className="bg-[#dddddd] z-10 px-4 py-2 rounded-t-lg flex justify-between items-center sticky top-0">
          <h2 className="text-left font-semibold text-2xl">
            {currentMode === "add"
              ? "Add RA"
              : currentMode === "edit"
              ? "Edit RA"
              : "View RA"}
          </h2>
          <div className="flex items-center">
            {(currentMode === "edit" || currentMode === "view") && (
              <div className="flex items-center mr-4">
                <span className="mr-2">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  color="primary"
                  disabled={currentMode === "view"}
                />
              </div>
            )}
            <button onClick={onClose}>
              <img className="w-8 h-8" src={close} alt="close" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-12 py-4 grid grid-cols-2 gap-x-4 gap-y-2 text-left"
        >
          {renderFields(formFields)}
          <div className="relative flex items-center col-span-2">
            <input
              type="checkbox"
              id="copartnerCheckbox"
              checked={copartnerChecked}
              onChange={handleCopartnerChange}
              className="md:w-4 w-6 md:h-4 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="copartnerCheckbox"
              className="ml-3 text-sm text-gray-500 dark:text-gray-400"
            >
              Become Copartner
            </label>
          </div>
          {currentMode !== "view" ? (
            <button
              className={`col-span-2 mx-auto ${
                loading ? "bg-blue-400" : "bg-blue-500"
              } hover:bg-blue-700 text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline`}
              type="submit"
              disabled={loading}
            >
              {currentMode === "add" ? "Add" : "Save Changes"}
            </button>
          ) : (
            <button
              className={`col-span-2 mx-auto ${
                loading ? "bg-blue-400" : "bg-blue-500"
              } hover:bg-blue-700 text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline`}
              onClick={() => setCurrentMode("edit")}
              disabled={loading || currentMode === "edit"}
            >
              Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default RAPopup;
