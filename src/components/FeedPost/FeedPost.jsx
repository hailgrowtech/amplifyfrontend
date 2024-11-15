import React, { useState, useEffect } from "react";
import FollowerFeedDialog from "./FollowerFeedDialog";
import FeedUploadPostDialog from "./FeedUploadPostDialog";
import ImageDetailsDialog from "../ImageDetailsDialog";
import api from "../../api";

const FeedPost = ({ stackholderId }) => {
  const [isFollowerDialog, setIsFollowerDialog] = useState(false);
  const [isUploadPostDialog, setIsUploadPostDialog] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSubscriptionType, setShowSubscriptionType] = useState("3");
  const [postType, setPostType] = useState("Options");
  const [editPostData, setEditPostData] = useState(null);

  const fetchFeedData = async () => {
    try {
      const response = await api.get(
        `/Feed/GetByExpertsId?expertsId=${stackholderId}&postType=${postType}&page=1&pageSize=10000`
      );
      if (response.data.isSuccess) {
        const fetchedImages = response.data.data.flatMap((expert) =>
          expert.shareList.map((share) => ({
            id: share.id, // Include the post ID
            mediaPath: share.mediaPath,
            caption: share.caption,
            link: share.link,
            buttonName: share.buttonName,
            buttonRoute: share.buttonRoute,
            postType: share.postType,
            likeCount: share.likeCount,
            commentCount: share.commentCount
          }))
        );
        setUploadedImages(fetchedImages);
      } else {
        console.error("Failed to fetch feed data.");
      }
    } catch (error) {
      console.error("Error fetching feed data:", error);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [stackholderId, postType]);

  const openFollwerDialog = () => {
    setIsFollowerDialog(true);
  };

  const openUploadPostDialog = (postId = null) => {
    if (postId) {
      const postToEdit = uploadedImages.find((post) => post.id === postId);
      if (postToEdit) {
        setEditPostData(postToEdit);
      }
    } else {
      setEditPostData(null);
    }
    setIsUploadPostDialog(true);
  };

  const closeDialog = () => {
    setIsFollowerDialog(false);
    setIsUploadPostDialog(false);
    setSelectedImage(null);
  };

  const handleImageUpload = (imageURL) => {
    setUploadedImages((prevImages) => [...prevImages, imageURL]);
  };

  const handleShowImageDetails = (post) => {
    setSelectedImage(post);
  };

  const handleSubscriptionChange = (type, postTypeLabel) => {
    setShowSubscriptionType(type);
    setPostType(postTypeLabel);
  };

  return (
    <div className="pb-[5rem] xl:pl-[12rem] md:pl-[16rem] pl-6 md:py-[6rem] pt-[8rem] bg-gradient min-h-screen">
      <div className="md:w-[1100px] w-[350px] border border-[#29303F] rounded-[16px] md:h-[75px] md:ml-0 ml-0">
        <div className="flex items-center justify-between py-5 px-4">
          <span className="text-white font-[600] md:text-[22px] leading-[26px]">
            App Followers: 3000
          </span>
          <button
            onClick={openFollwerDialog}
            className="border-solid border-[1px] border-white opacity-[60%] rounded-[20px] w-[92px] h-[32px]"
          >
            <span className="text-white font-[500] leading-[16px] text-[15px]">
              See All
            </span>
          </button>
          {isFollowerDialog && (
            <FollowerFeedDialog
              isDialogOpen={isFollowerDialog}
              closeDialog={closeDialog}
            />
          )}
        </div>
      </div>

      <div className="xl:w-[1520px] md:w-[1110px] w-[350px] flex items-center justify-between mt-8">
        <span className="w-[176px] h-[27px] font-inter text-[22px] font-[600] leading-[27px] text-white">
          Feed Post
        </span>
        <button
          onClick={() => openUploadPostDialog()}
          className="md:w-[100px] w-[70px] md:h-[40px] h-[30px] rounded-[10px] text-white font-[600] font-inter md:text-[12px] text-[14px] border-solid border-[1px] border-white md:mr-4 mr-2"
        >
          +Add
        </button>
        {isUploadPostDialog && (
          <FeedUploadPostDialog
            isUploadPostDialog={isUploadPostDialog}
            closeDialog={closeDialog}
            handleImageUpload={handleImageUpload}
            stackholderId={stackholderId}
            postData={editPostData}
            mode={editPostData ? "edit" : "add"}
            refreshFeed={fetchFeedData}
          />
        )}
      </div>

      <div className="flex md:flex-row flex-col md:items-center md:gap-[39rem] gap-2">
        <div className="flex flex-row md:gap-4 gap-8">
          <button
            onClick={() => handleSubscriptionChange("3", "Options")}
            className={`md:w-[140px] w-[120px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
              showSubscriptionType === "3"
                ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
            }`}
          >
            Futures & Options
          </button>
          <button
            onClick={() => handleSubscriptionChange("2", "Equity")}
            className={`md:w-[90px] w-[70px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
              showSubscriptionType === "2"
                ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
            }`}
          >
            Equity
          </button>
          <button
            onClick={() => handleSubscriptionChange("1", "Commodity")}
            className={`md:w-[120px] w-[100px] h-[40px] rounded-[10px] border-solid border-[1px] border-white text-black ${
              showSubscriptionType === "1"
                ? "bg-[#ffffff] font-[600] font-inter md:text-[12px] text-[12px]"
                : "bg-transparent text-white font-[600] font-inter md:text-[12px] text-[12px]"
            }`}
          >
            Commodity
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:w-[1084px]">
        {uploadedImages.map((share, index) => (
          <button key={index} onClick={() => handleShowImageDetails(share)}>
            <img
              src={share.mediaPath}
              alt={`Uploaded ${index}`}
              className="w-full h-[244px] object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      {selectedImage && (
        <ImageDetailsDialog
          imageSrc={selectedImage.mediaPath}
          caption={selectedImage.caption}
          closeDialog={closeDialog}
          id={selectedImage.id}
          postData={selectedImage}
          openUploadPostDialog={openUploadPostDialog}
          refreshFeed={fetchFeedData}
          stackholderId={stackholderId}
        />
      )}
    </div>
  );
};

export default FeedPost;
