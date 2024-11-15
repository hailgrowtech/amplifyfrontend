import React, { useState, useEffect } from "react";
import axios from "axios";
import { closeIcon } from "../../assets";
import { toast } from "react-toastify";

const CallPostDialog = ({ isDialogOpen, closeDialog, stackholderId, fetchStories }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // State for preview URL
  const [loading, setLoading] = useState(false);

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMediaType(file.type.startsWith("image") ? "Images" : "Videos"); // Automatically set mediaType

      // Generate preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Clean up the preview URL when the component unmounts or when a new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Function to handle the upload click
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file before uploading.");
      return;
    }

    setLoading(true);
    try {
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

      const presignedUrl = awsResponse.data.data.presignedUrl;
      if (!presignedUrl) {
        toast.error("Failed to upload file to AWS.");
        return;
      }

      const postData = {
        expertsId: stackholderId,
        mediaPath: presignedUrl,
        mediaType: mediaType,
        caption: caption || "No caption",
      };

      const storyResponse = await axios.post(
        "https://copartners.in:5137/api/Story",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (storyResponse.data.isSuccess) {
        toast.success("File uploaded and story created successfully!");
        fetchStories();
        closeDialog();
      } else {
        toast.error("Failed to create story. Please try again.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during the upload process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isDialogOpen && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1C2532] rounded-lg md:w-[600px] w-[90%] p-6 relative shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[24px] font-bold text-white">Add a New Story</h2>
              <button onClick={closeDialog} className="text-white">
                <img src={closeIcon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* File Input Area */}
            <div className="flex flex-col items-center mb-4 relative">
              <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-dotted border-gray-400 rounded-lg cursor-pointer transition hover:border-blue-400">
                <span className="text-gray-500 font-medium text-sm md:text-base">
                  {selectedFile ? "Change Content" : "Upload Content"}
                </span>
                <input type="file" className="hidden" onChange={handleFileChange} />
                
                {/* Preview Section */}
                {previewUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg p-2">
                    {mediaType === "Images" ? (
                      <img
                        src={previewUrl}
                        alt="Selected Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        controls
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                )}
              </label>
            </div>

            {/* Caption Input */}
            <div className="mb-4">
              <label className="text-white text-sm">Caption:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-md bg-[#2C3A4B] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a caption (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* Upload Button */}
            <div className="flex justify-center mt-6">
              <button
                className={`${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                } w-full md:w-48 py-2 rounded-lg text-white font-semibold transition-all`}
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    UPLOADING...
                  </div>
                ) : (
                  "UPLOAD"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CallPostDialog;
