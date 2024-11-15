import React, { useState } from "react";
import { editDocument } from "../assets";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";

const DocumentEditPopup = ({ onClose, stackholderId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.info("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post(
        "/AWSStorage?prefix=Images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.presignedUrl;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("File upload failed");
    }
  };

  const handleFileChangeInternal = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateSignatureImage = async (url) => {
    const patchData = [
      {
        path: "signatureImage",
        op: "replace",
        value: url,
      },
    ];

    try {
      const response = await api.patch(
        `/Experts?Id=${stackholderId}`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }
      );
      toast.success("Document uploaded and profile updated successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating the profile:", error);
      toast.error("Failed to update the profile.");
    }
  };

  const handleSaveInternal = async () => {
    try {
      const uploadedFilePath = await uploadFile();
      await updateSignatureImage(uploadedFilePath);
    } catch (error) {
      console.error("Error saving the document:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#2E374B] rounded-lg p-8 w-[80%] max-w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-2xl">Documents</h2>
          <button onClick={onClose} className="text-white text-xl">
            ×
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="fileInputPopup"
            className="relative w-[236px] h-[238px] border-2 border-dotted border-[#ffffff] cursor-pointer"
          >
            <input
              id="fileInputPopup"
              type="file"
              className="absolute inset-0 opacity-0 w-full h-full"
              onChange={(e) => {
                handleFileChangeInternal(e);
              }}
            />
            {!preview ? (
              <>
                <img
                  src={editDocument}
                  alt=""
                  className="w-[95px] h-[95px] ml-16 mt-[2rem]"
                />
                <span className="absolute bottom-4 left-0 right-0 text-center w-full font-inter font-[400] text-[13px] leading-[16px] text-white opacity-[50%] mb-[2rem]">
                  Upload Documents
                </span>
              </>
            ) : (
              <div className="relative w-full h-full flex justify-center items-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full"
                />
              </div>
            )}
          </label>
          <button
            onClick={handleSaveInternal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DocumentEditPopup;
