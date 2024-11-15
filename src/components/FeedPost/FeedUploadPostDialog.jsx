import React, { useState } from "react";
import axios from "axios";
import { closeIcon } from "../../assets";
import { toast } from "react-toastify";

const FeedUploadPostDialog = ({
  closeDialog,
  handleImageUpload,
  stackholderId,
  postData = null,
  mode = "add",
  refreshFeed,
}) => {
  // Initialize state with existing post data
  const [des, setDes] = useState(postData?.caption || "");
  const [link, setLink] = useState(postData?.link || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(postData?.mediaPath || null);
  const [type, setType] = useState(postData?.postType || "Options");
  const [buttonName, setButtonName] = useState(postData?.buttonName || "");
  const [buttonRoute, setButtonRoute] = useState(postData?.buttonRoute || "");
  const [loading, setLoading] = useState(false);

  const mediaType = selectedFile?.type?.includes("video") ? "Videos" : "Images";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the selected file in state
      setPreview(URL.createObjectURL(file)); // Set the preview URL for the image
    }
  };

  const handleUploadClick = async () => {
    try {
      setLoading(true);
      let presignedUrl = preview;

      if (selectedFile) {
        // Upload new file to AWS
        const formData = new FormData();
        formData.append("file", selectedFile);

        const awsResponse = await axios.post(
          `https://copartners.in:5134/api/AWSStorage?prefix=${mediaType}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        presignedUrl = awsResponse.data.data.presignedUrl;
      }

      const data = {
        expertsId: stackholderId,
        postType: type,
        mediaPath: presignedUrl,
        mediaType: mediaType,
        caption: des,
        link: link,
        buttonName: buttonName,
        buttonRoute: buttonRoute,
      };

      if (mode === "add") {
        // POST request
        const response = await axios.post(
          "https://copartners.in:5132/api/Feed",
          data
        );
        if (response.data.isSuccess) {
          toast.success("Post uploaded successfully!");
          closeDialog();
          refreshFeed();
        } else {
          toast.error("Failed to upload post.");
        }
      } else {
        // PATCH request
        const patchData = [
          { op: "replace", path: "caption", value: des },
          { op: "replace", path: "link", value: link },
          { op: "replace", path: "buttonName", value: buttonName },
          { op: "replace", path: "buttonRoute", value: buttonRoute },
          { op: "replace", path: "mediaPath", value: presignedUrl },
          { op: "replace", path: "postType", value: type },
        ];

        const response = await axios.patch(
          `https://copartners.in:5132/api/Feed?Id=${postData.id}`,
          patchData,
          {
            headers: {
              "Content-Type": "application/json-patch+json",
            },
          }
        );
        if (response.data.isSuccess) {
          toast.success("Post updated successfully!");
          closeDialog();
          refreshFeed();
        } else {
          toast.error("Failed to update post.");
        }
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during the upload process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:max-w-[900px] max-w-[90%] w-full p-8 overflow-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-inter text-new font-[700] text-[18px] md:text-[30px] leading-[24px] md:leading-[51px]">
              {mode === "add" ? "Upload Post" : "Edit Post"}
            </h2>
            <button onClick={closeDialog}>
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="w-[30px] md:w-[35px] h-[30px] md:h-[35px]"
              />
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col md:flex-row justify-between gap-6 mt-4">
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
              <label className="flex flex-col items-center justify-center w-full h-[140px] border-2 border-dotted border-gray-400 rounded-lg cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-500 font-[400] text-[14px] md:text-[16px]">
                    Upload Your Content
                  </span>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <div className="mt-4">
                <label className="bg-[#282F3E] text-white opacity-[50%] px-2 py-1 rounded-[8px] font-[400] text-[13px]">
                  Caption
                </label>
                <textarea
                  onChange={(e) => setDes(e.target.value)}
                  value={des}
                  rows="4"
                  className="block p-2 mt-2 rounded-md text-white border border-[#40495C] bg-transparent w-full"
                  placeholder="Write something here"
                ></textarea>
              </div>
            </div>

            {/* New fields: Type, Button Name, and Button Route */}
            <div className="flex flex-col gap-4 w-full md:w-[50%]">
              <div>
                <label className="text-white opacity-[50%] mb-2 block">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="p-2 w-full rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                >
                  <option value="Options">Options</option>
                  <option value="Commodity">Commodity</option>
                  <option value="Equity">Equity</option>
                </select>
              </div>

              <div>
                <label className="text-white opacity-[50%] mb-2 block">
                  Button Name
                </label>
                <input
                  value={buttonName}
                  onChange={(e) => setButtonName(e.target.value)}
                  type="text"
                  className="w-full py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  placeholder="Enter button name"
                />
              </div>

              <div>
                <label className="text-white opacity-[50%] mb-2 block">
                  Button Route
                </label>
                <input
                  value={buttonRoute}
                  onChange={(e) => setButtonRoute(e.target.value)}
                  type="text"
                  className="w-full py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                  placeholder="Enter button route"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div>
              <label className="bg-[#282F3E] text-white opacity-[50%] px-2 py-1 rounded-[8px] font-[400] text-[13px]">
                Link
              </label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                type="text"
                className="w-full mt-2 py-2 px-4 rounded-md text-white border border-[#40495C] bg-[#282F3E]"
                placeholder="Enter link"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className={`bg-white ${
                loading ? "text-gray-500" : "text-black"
              } font-semibold md:w-[147px] w-[120px] h-[40px] rounded-[10px]`}
              onClick={handleUploadClick}
              disabled={loading}
            >
              {loading
                ? mode === "add"
                  ? "UPLOADING..."
                  : "UPDATING..."
                : mode === "add"
                ? "UPLOAD"
                : "UPDATE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedUploadPostDialog;
