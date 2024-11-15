import React, { useState, useEffect } from "react";
import { Switch, TextField, Button, Input, InputLabel } from "@mui/material";
import close from "../../assets/close.png";
import { toast } from "react-toastify";

function APDetailPopup({
  onClose,
  onSave,
  mode,
  initialValues1,
  onChangeMode,
}) {
  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    mobileNumber: "",
    email: "",
    pan: "",
    gst: "",
    fixCommission1: "",
    fixCommission2: "",
    isActive: true,
    affiliatePartnerImagePath: null,
    kycVideoPath: null,
    address: "",
    state: "",
    referralCode: "",
    referralLink: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInitialValues = async () => {
      if (initialValues1?.id) {
        try {
          const response = await fetch(
            `https://copartners.in:5133/api/AffiliatePartner/${initialValues1.id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch AP data for ${initialValues1.id}`);
          }
          const data = await response.json();
          setFormData({ ...formData, ...data.data });
        } catch (error) {
          console.log(error);
        }
      } else {
        setFormData({
          name: "",
          legalName: "",
          mobileNumber: "",
          email: "",
          pan: "",
          gst: "",
          fixCommission1: "",
          fixCommission2: "",
          isActive: true,
          affiliatePartnerImagePath: null,
          kycVideoPath: null,
          address: "",
          state: "",
          referralCode: "",
          referralLink: "",
        });
      }
    };

    fetchInitialValues();
  }, [initialValues1?.id]);

  const handleChange = async (e) => {
    const { id, value, files } = e.target;
    const newErrors = { ...errors };

    if (files && files.length > 0) {
      const file = files[0];
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
        const data = await response.json();
        const presignedURL = data.data.presignedUrl;

        setFormData((prevFormData) => ({
          ...prevFormData,
          [id]: presignedURL,
        }));

        toast.success(`${id} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${id}`);
      }
    } else {
      if (id === "mobileNumber") {
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(value)) {
          newErrors.mobileNumber = "Invalid mobile number";
        } else {
          delete newErrors.mobileNumber;
        }
      }

      if (id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors.email = "Invalid email address";
        } else {
          delete newErrors.email;
        }
      }

      if (id === "fixCommission1") {
        if (parseInt(value) > 80) {
          newErrors.fixCommission1 = "Commission fix cannot exceed 80%";
        } else {
          delete newErrors.fixCommission1;
        }
      }

      if (id === "fixCommission2") {
        if (parseInt(value) > 80) {
          newErrors.fixCommission2 = "Commission fix cannot exceed 80%";
        } else {
          delete newErrors.fixCommission2;
        }
      }

      setErrors(newErrors);
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert("Please correct the inputs before submitting.");
      return;
    }

    const dataToSubmit = { ...formData };

    const url =
      mode === "add"
        ? "https://copartners.in:5133/api/AffiliatePartner"
        : `https://copartners.in:5133/api/AffiliatePartner?Id=${initialValues1.id}`;
    const method = mode === "add" ? "POST" : "PATCH";

    let patchData = [];

    if (mode === "edit") {
      for (const key in dataToSubmit) {
        if (dataToSubmit[key] !== initialValues1[key]) {
          patchData.push({
            path: key,
            op: "replace",
            value: dataToSubmit[key],
          });
        }
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(method === "PATCH" ? patchData : dataToSubmit),
      });

      console.log(patchData, "patchdata", dataToSubmit, "datato sumbmit");

      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }
      onSave();
    } catch (error) {
      console.error("Error saving A.P. details:", error);
      toast.error(`Failed to save A.P. details: ${error.message}`);
    }
  };

  const fields = [
    { id: "name", label: "A.P", required: true },
    { id: "legalName", label: "Legal Name", required: true },
    {
      id: "mobileNumber",
      label: "Mobile Number",
      required: true,
      type: "number",
    },
    { id: "email", label: "Mail ID", required: true },
    { id: "pan", label: "PAN Card Number", required: true },
    { id: "gst", label: "GST Number" },
    {
      id: "fixCommission1",
      label: "CM. Fix 1",
      required: true,
      type: "number",
    },
    {
      id: "fixCommission2",
      label: "CM. Fix 2",
      required: true,
      type: "number",
    },
    { id: "address", label: "Address", required: true },
    { id: "state", label: "State", required: true },
    {
      id: "affiliatePartnerImagePath",
      label: "Profile Image",
      type: "file",
      inputProps: { accept: "image/*" },
    },
    {
      id: "kycVideoPath",
      label: "KYC Video",
      type: "file",
      inputProps: { accept: "video/*" },
    },
    {
      id: "referralLink",
      label: "Referral Link",
      type: "text",
      displayInModes: ["edit", "view"],
    },
    {
      id: "referralCode",
      label: "Referral Code",
      type: "text",
      displayInModes: ["edit", "view"],
    },
  ];

  const inputClasses = `w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center max-h-screen overflow-y-auto">
        <div className="bg-[#dddddd] z-10 px-4 py-2 rounded-t-lg flex justify-between items-center sticky top-0">
          <h2 className="text-left font-semibold text-2xl">
            {mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"}
          </h2>
          <div className="flex items-center">
            {(mode === "edit" || mode === "view") && (
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
                  disabled={mode === "view"}
                />
              </div>
            )}
            <Button onClick={onClose}>
              <img className="w-8 h-8" src={close} alt="close" />
            </Button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-12 py-4 grid grid-cols-2 gap-6 text-left"
        >
          {fields.map((field) => {
            const shouldDisplay =
              !field.displayInModes || field.displayInModes.includes(mode);

            if (!shouldDisplay) return null;

            const isDisabled =
              mode === "view" ||
              field.id === "referralLink" ||
              field.id === "referralCode";

            return field.type === "file" ? (
              <div key={field.id}>
                <InputLabel htmlFor={field.id}>{field.label}</InputLabel>
                <Input
                  id={field.id}
                  type={field.type}
                  onChange={handleChange}
                  required={field.required && mode === "add"}
                  {...field.inputProps}
                  disabled={isDisabled}
                  className={`${inputClasses} ${
                    !!formData[field.id] && mode === "view" ? "bg-gray-100" : ""
                  }`}
                />
                {formData[field.id] && (
                  <div className="mt-2">
                    <a
                      href={formData[field.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View {field.label}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <TextField
                key={field.id}
                id={field.id}
                label={field.label}
                value={formData[field.id] || ""}
                type={field.type || "text"}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required={field.required}
                disabled={isDisabled}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                className={`${inputClasses} ${
                  !!formData[field.id] && mode === "view" ? "bg-gray-100" : ""
                }`}
              />
            );
          })}
          {mode === "view" ? (
            <button
              className="col-span-2 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline"
              onClick={onChangeMode}
              disabled={mode === "edit"}
            >
              Change
            </button>
          ) : (
            <button
              className="col-span-2 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {mode === "add" ? "Add" : "Save Changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default APDetailPopup;
