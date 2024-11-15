import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import closeIcon from "../../assets/close.png";
import { toast } from "react-toastify";

const AddPopup = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    email: "",
    document: null,
    mobile: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        image: initialData.imagePath,
        name: initialData.name,
        email: initialData.email,
        document: initialData.documentPath,
        mobile: initialData.mobile,
      });
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData({
      ...formData,
      [id]: files[0],
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const uploadFile = async (file, prefix) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const uploadResponse = await fetch(
      `https://copartners.in:5134/api/AWSStorage?prefix=${prefix}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    const uploadData = await uploadResponse.json();
    return uploadData.data.presignedUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = formData.image instanceof File ? await uploadFile(formData.image, "Images") : formData.image;
      const documentUrl = formData.document instanceof File ? await uploadFile(formData.document, "Documents") : formData.document;

      const newManager = {
        imagePath: imageUrl,
        documentPath: documentUrl,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
      };

      const requestUrl = initialData
        ? `https://copartners.in:5134/api/RelationshipManager/${initialData.id}`
        : "https://copartners.in:5134/api/RelationshipManager";

      const requestMethod = initialData ? "PUT" : "POST";

      const saveResponse = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newManager),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save relationship manager");
      }

      onSave();
      toast.success(`Relationship manager ${initialData ? "updated" : "added"} successfully!`);
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(`Failed to ${initialData ? "update" : "add"} relationship manager`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-left">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            {initialData ? "Edit" : "Add"} Relationship Manager
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={closeIcon} alt="Close" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-12 py-4 grid grid-cols-2 text-left gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              required={!initialData}
            />
            {formData.image && <a className="text-blue-500 underline" target="_blank" rel="noreferrer" href={formData.image}>View Image</a>}
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
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="document">Upload Document</label>
            <input
              type="file"
              id="document"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              required={!initialData}
            />
            {formData.document && <a className="text-blue-500 underline" target="_blank" rel="noreferrer" href={formData.document}>View Document</a>}
            <TextField
              id="mobile"
              label="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <Button type="submit" variant="contained" color="primary">
              {initialData ? "Save Changes" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPopup;
