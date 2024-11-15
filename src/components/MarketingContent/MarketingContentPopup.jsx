import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import close from "../../assets/close.png";
import select from "../../assets/+ Add Currency.png";
import { toast } from "react-toastify";

function MarketingContentPopup({ onClose, contentType, onSave, content }) {
  const [loading, setLoading] = useState(false)
  const [inputLabel, setInputLabel] = useState("");
  const [contentName, setContentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialFileUrl, setInitialFileUrl] = useState("");

  useEffect(() => {
    setInputLabel(contentType === "Banner" ? "Banner Name" : "Video Name");

    if (content) {
      setContentName(content.bannerName || content.videoName);
      setInitialFileUrl(content.imagePath || content.videoPath);
    }
  }, [contentType, content]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!contentName.trim() || (!selectedFile && !initialFileUrl)) {
      alert("Please fill out all fields");
      return;
    }

    const uploadUrl = contentType === "Banner" ? "Images" : "Videos";
    let presignedURL = initialFileUrl;

    if (selectedFile) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);

        const uploadResponse = await fetch(
          `https://copartners.in:5134/api/AWSStorage?prefix=${uploadUrl}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }
        const uploadData = await uploadResponse.json();
        presignedURL = uploadData.data.presignedUrl;
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${contentType.toLowerCase()}`);
        return;
      } finally {
        setLoading(false)
      }
    }

    // Save marketing content details with the presigned URL
    const marketingContentData = {
      bannerName: contentName,
      contentType: contentType.toLowerCase(),
      imagePath: presignedURL,
    };

    const saveResponse = await fetch(
      content
        ? `https://copartners.in:5134/api/MarketingContent/${content.id}`
        : "https://copartners.in:5134/api/MarketingContent",
      {
        method: content ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marketingContentData),
      }
    );

    if (!saveResponse.ok) {
      console.error("Error saving data");
      toast.error(`Failed to save ${contentType.toLowerCase()}`);
      return;
    }

    const result = await saveResponse.json();
    onSave(result);
    setContentName("");
    setSelectedFile(null);
    onClose();
    toast.success(`${contentType} ${content ? "updated" : "added"} successfully!`);
  };

  const handleSelectFileClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setInitialFileUrl("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-white border-1 border-[#ffffff2a] m-4 rounded-lg w-3/4 text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            {content ? "Edit" : "Add"} {contentType}
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={close} alt="Close" />
          </button>
        </div>
        <div className="font-semibold text-2xl px-12 py-4 flex gap-12 text-left">
          <div className="flex flex-col gap-4">
            <label htmlFor="file-upload">
              {contentType === "Banner" ? "Upload Title Image" : "Upload Video"}
            </label>
            {contentType === "Banner" ? (
              <img
                className={`w-96 ${selectedFile || initialFileUrl ? "h-56" : ""} cursor-pointer`}
                src={selectedFile ? URL.createObjectURL(selectedFile) : initialFileUrl || select}
                alt="Select"
                onClick={handleSelectFileClick}
              />
            ) : selectedFile || initialFileUrl ? (
              <video className="w-96 h-56" controls>
                <source
                  src={selectedFile ? URL.createObjectURL(selectedFile) : initialFileUrl}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                className="w-96 cursor-pointer"
                src={select}
                alt="Select"
                onClick={handleSelectFileClick}
              />
            )}
            <input
              type="file"
              id="file-upload"
              accept={contentType === "Banner" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="relative flex flex-col w-1/2">
              <TextField
                id="content-name"
                label={inputLabel}
                value={contentName}
                onChange={(e) => setContentName(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
            </div>
          </div>
        </div>
        <button
          className={`px-12 ${loading ? "bg-blue-300" : "bg-blue-500"}  text-white py-2 border-2 rounded-lg mb-8`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {content ? loading ? "Updating" : "Update" : loading ? "Adding" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default MarketingContentPopup;
