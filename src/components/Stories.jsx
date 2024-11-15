import React, { useState, useEffect } from "react";
import axios from "axios";
import StoryPopup from "./StoryPopup"; // Import the popup component

const Stories = ({fetchStories, stories, loading, error}) => {
  const [selectedStory, setSelectedStory] = useState(null); // For controlling the popup

  // Fetch stories on component mount
  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story); // Set the clicked story to open in the popup
  };

  const closePopup = () => {
    setSelectedStory(null); // Close the popup
  };

  if (loading) {
    return <p className="text-white">Loading stories...</p>;
  }

  if (error) {
    return <p className="text-white">{error}</p>;
  }

  return (
    <div className="mt-4">
      <div className="flex overflow-x-auto">
        {stories.map((story, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center w-[80px] cursor-pointer mr-6"
            onClick={() => handleStoryClick(story)} // Handle click event
          >
            {/* Story Image/Video */}
            <div className="w-[80px] h-[80px] bg-[#2E374B] rounded-full p-1 border-2 border-green-500">
              {story.mediaPath.endsWith(".mp4") ? (
                <video
                  className="w-full h-full object-cover rounded-full"
                >
                  <source src={story.mediaPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={story.mediaPath}
                  alt={`Story ${index + 1}`}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
            {/* Caption */}
            <p className="text-white mt-2 text-sm text-center truncate w-[80px]">
              {story.caption || "No Caption"}
            </p>
          </div>
        ))}
      </div>

      {/* Story Popup */}
      {selectedStory && (
        <StoryPopup story={selectedStory} onClose={closePopup} refreshStories={fetchStories} />
      )}
    </div>
  );
};

export default Stories;
