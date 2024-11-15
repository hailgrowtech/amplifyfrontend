import React from "react";
import { closeIcon } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";

const StoryPopup = ({ story, onClose, refreshStories }) => {
  if (!story) return null;

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://copartners.in:5137/api/Story/${story.id}`
      );
      if (response.data.isSuccess) {
        toast.success("Story deleted successfully!");
        onClose(); // Close the popup
        refreshStories(); // Refresh the stories list if needed
      } else {
        toast.error("Failed to delete the story.");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("An error occurred while deleting the story.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-[#282F3E] rounded-lg p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg"
        >
          <img
            src={closeIcon}
            alt="Close_Icon"
            className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
          />
        </button>
        {/* Story Image/Video */}
        <div className="w-full h-[400px] flex justify-center items-center bg-[#2E374B] rounded-md overflow-hidden">
          {story.mediaPath.endsWith(".mp4") ? (
            <video controls className="w-full h-full object-cover">
              <source src={story.mediaPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={story.mediaPath}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Caption */}
        <p className="text-white text-center mt-4 text-lg">
          {story.caption || "No Caption"}
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryPopup;
