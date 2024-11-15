import React, { useState, useEffect } from "react";
import PageHeader from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import MarketingContentPopup from "./MarketingContentPopup";
import BannerMarketing from "./BannerMarketing";
import MarketingVideo from "./MarketingVideo";
import "react-toastify/dist/ReactToastify.css";

const MarketingContent = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState("Banner");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [bannersData, setBannersData] = useState([]);
  const [videosData, setVideosData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://copartners.in:5134/api/MarketingContent?page=1&pageSize=10000");
      const data = await response.json();
      setBannersData(data.data.filter(item => item.contentType.toLowerCase() === "banner"));
      setVideosData(data.data.filter(item => item.contentType.toLowerCase() === "videos"));
    } catch (error) {
      toast.error("Failed to fetch marketing content");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedContent(null);
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleSaveData = () => {
    fetchData();
  };

  const handleEditClick = (content) => {
    setSelectedContent(content);
    setIsPopupOpen(true);
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Marketing Content"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      <div className="px-4 flex gap-8">
        <button
          onClick={() => handleButtonClick("Banner")}
          className={`px-16 py-4 border-2 rounded-xl ${
            activeButton === "Banner" ? "border-black" : "border-gray-200"
          } font-semibold`}
        >
          Banner
        </button>
        <button
          onClick={() => handleButtonClick("Videos")}
          className={`px-16 py-4 border-2 rounded-xl ${
            activeButton === "Videos" ? "border-black" : "border-gray-200"
          } font-semibold`}
        >
          Video
        </button>
      </div>

      <div className="p-4">
        <div className="dashboard-view-section mb-4">
          <div className="table-list-mb">
            <div className="channel-heading flex">
              <h3 className="text-xl font-semibold mr-auto">{activeButton}</h3>
              <button
                className="border-2 border-black rounded-lg px-4 py-1 mr-4"
                onClick={() => setIsPopupOpen(true)}
              >
                + Add
              </button>
            </div>
            {activeButton === "Banner" ? (
              <div className="grid grid-cols-3 gap-4 p-4">
                {bannersData.map((banner) => (
                  <BannerMarketing
                    update={fetchData}
                    key={banner.id}
                    banner={banner}
                    onEditClick={handleEditClick}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 p-4">
                {videosData.map((video) => (
                  <MarketingVideo
                    update={fetchData}
                    key={video.id}
                    video={video}
                    onEditClick={handleEditClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <MarketingContentPopup
          onClose={handleClosePopup}
          contentType={activeButton}
          onSave={handleSaveData}
          content={selectedContent}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default MarketingContent;
