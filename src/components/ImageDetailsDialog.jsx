import axios from "axios";
import { useState } from "react";
import { chatIcon, closeIcon, deleteIcon, heart, threeDots } from "../assets";
import { toast } from "react-toastify";
import moment from "moment";
import { FaEdit, FaTelegramPlane } from "react-icons/fa";

const EditDeleteDialog = ({
  closeDialog,
  position,
  postId,
  handleEdit,
  refreshFeed,
  closePopup
}) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://copartners.in:5132/api/Feed/${postId}`
      );
      if (response.data.isSuccess) {
        toast.success("Post deleted successfully!");
        closeDialog();
        closePopup();
        refreshFeed();
      } else {
        toast.error("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post.");
    }
  };

  return (
    <div
      className="fixed bg-[#2E374B] border border-white w-[173px] h-[123px] rounded-[20px] z-50"
      style={{ top: position.top, left: position.left }}
    >
      <img
        onClick={closeDialog}
        src={closeIcon}
        alt="CLOSE"
        className="w-[32px] h-[32px] ml-[8rem]"
      />
      <div className="flex items-center justify-center flex-col">
        <button
          onClick={() => {
            closeDialog();
            handleEdit();
          }}
          className="border border-white text-white rounded-[12px] w-[92px] h-[32px] mb-2"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="border border-[#FF0000] text-[#FF0000] rounded-[12px] w-[92px] h-[32px]"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ImageDetailsDialog = ({
  imageSrc,
  caption,
  closeDialog,
  id,
  postData,
  openUploadPostDialog,
  refreshFeed,
  stackholderId,
}) => {
  const [isOpenEditDelDialog, setIsOpenEditDelDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [page, setPage] = useState(1); // Track current page
  const [replyTextMap, setReplyTextMap] = useState({});

  // State to track editing comment or reply
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState({});

  const fetchComments = async (isNewPage = false) => {
    try {
      const response = await axios.get(
        `https://copartners.in:5132/api/Feed/GetComment/${id}?Id=${stackholderId}&page=${page}&pageSize=10`
      );
      if (response.data.isSuccess) {
        if (isNewPage) {
          setComments((prev) => [...prev, ...response.data.data]); // Append new comments for next page
        } else {
          setComments(response.data.data); // First page or refreshing
        }
      } else {
        toast.error("Failed to fetch comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("An error occurred while fetching comments.");
    }
  };

  const handleCommentClick = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const openReplyBox = (commentId) => {
    setActiveReplyCommentId(
      activeReplyCommentId === commentId ? null : commentId
    );
  };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplySubmit = async (commentId) => {
    try {
      const replyPayload = {
        feedPostId: id,
        feedCommentId: commentId,
        expertsId: stackholderId,
        reply: replyText,
      };

      const response = await axios.post(
        `https://copartners.in:5132/api/Feed/CommentReply`,
        replyPayload
      );

      if (response.data.isSuccess) {
        toast.success("Reply posted successfully!");
        setReplyText("");
        setActiveReplyCommentId(null);
        fetchComments(); // Optionally refresh the comments list
      } else {
        toast.error("Failed to post reply.");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("An error occurred while posting the reply.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `https://copartners.in:5132/api/Feed/DeleteComment/${commentId}`
      );
      if (response.data.isSuccess) {
        toast.success("Comment deleted successfully!");
        fetchComments(); // Refresh the comment list
      } else {
        toast.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred while deleting the comment.");
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const response = await axios.delete(
        `https://copartners.in:5132/api/Feed/DeleteCommentReply/${replyId}`
      );
      if (response.data.isSuccess) {
        toast.success("Reply deleted successfully!");
        fetchComments(); // Refresh the comment list
      } else {
        toast.error("Failed to delete reply.");
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("An error occurred while deleting the reply.");
    }
  };

  const handleEditCommentClick = (commentId, commentText) => {
    setEditingComment(commentId);
    setReplyText(commentText); // Set the current comment text in the input field
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
  };

  const handleEditCommentSubmit = async (commentId) => {
    try {
      const patchData = [
        {
          path: "comment",
          op: "replace",
          value: replyText,
        },
      ];

      const response = await axios.patch(
        `https://copartners.in:5132/api/Feed/EditComment?Id=${commentId}`,
        patchData
      );

      if (response.data.isSuccess) {
        toast.success("Comment edited successfully!");
        setReplyText("");
        setEditingComment(null);
        fetchComments(); // Refresh the comments list
      } else {
        toast.error("Failed to edit comment.");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("An error occurred while editing the comment.");
    }
  };

  const handleEditReplyClick = (commentId, replyId) => {
    setEditingReply({ commentId, replyId });
  };

  const handleCancelEditReply = () => {
    setEditingReply({});
  };

  const handleEditReplySubmit = async (replyId) => {
    try {
      const patchData = [
        {
          path: "reply",
          op: "replace",
          value: replyTextMap[replyId], // Get the text for the specific reply
        },
      ];

      const response = await axios.patch(
        `https://copartners.in:5132/api/Feed/EditCommentReply?Id=${replyId}`,
        patchData
      );

      if (response.data.isSuccess) {
        toast.success("Reply edited successfully!");

        // Reset the editing state and clear the specific reply text from replyTextMap
        setEditingReply({});
        setReplyTextMap((prev) => {
          const updatedReplyTextMap = { ...prev };
          delete updatedReplyTextMap[replyId]; // Remove the entry for this reply after editing
          return updatedReplyTextMap;
        });

        fetchComments(); // Refresh the comment list
      } else {
        toast.error("Failed to edit reply.");
      }
    } catch (error) {
      console.error("Error editing reply:", error);
      toast.error("An error occurred while editing the reply.");
    }
  };

  const loadMoreComments = () => {
    setPage((prev) => prev + 1);
    fetchComments(true); // Load more comments for the next page
  };

  const openEditDelDialog = (event, commentId, replyId = null) => {
    event.preventDefault();
    const { clientX, clientY } = event;

    // Position the dialog where the user clicked
    setDialogPosition({
      top: clientY,
      left: clientX,
    });

    // Show the dialog
    setIsOpenEditDelDialog({
      isOpen: true,
      commentId: commentId,
      replyId: replyId, // If replyId is provided, it indicates the user is opening the menu for a reply
    });
  };

  const handleReplyTextChange = (replyId, newText) => {
    setReplyTextMap((prev) => ({
      ...prev,
      [replyId]: newText, // Update the text for the specific reply
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#2E374B] w-[530px] rounded-[10px] p-4 relative">
        <button
          onClick={closeDialog}
          className="absolute top-2 right-2 text-white"
        >
          <img src={closeIcon} alt="CLOSE" className="w-[30px] h-[30px]" />
        </button>
        <img
          src={imageSrc}
          alt="Uploaded"
          className="w-full h-[200px] object-cover rounded-lg"
        />
        <p className="text-white opacity-[50%] text-start mt-4">
          {caption || "No caption available"}
        </p>

        <div className="flex flex-row justify-between mt-4">
          <div className="flex items-center gap-4">
            <img src={heart} alt="LIKES" className="w-[22px] h-[22px]" />
            <span className="text-white opacity-[50%] font-[500] text-[14px] leading-[7px]">
              {`${postData.likeCount} Liked`}
            </span>
          </div>

          <div className="bg-white opacity-[50%] w-[2px] h-6"></div>

          <div className="flex items-center gap-4">
            <button
              className="flex justify-center items-center gap-2"
              onClick={handleCommentClick}
            >
              <img
                src={chatIcon}
                alt="COMMENTS"
                className="w-[22px] h-[22px]"
              />
              <span className="text-white opacity-[50%] font-[500] text-[14px] leading-[7px]">
                {`${postData.commentCount} Comments`}
              </span>
            </button>
          </div>

          <button onClick={openEditDelDialog}>
            <img src={threeDots} alt="MENU" className="w-[18px] h-[20px]" />
          </button>
        </div>

        {showComments && (
          <div className="mt-4 h-64 overflow-y-scroll">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex">
                    <img
                      src={
                        comment.userProfilePic ||
                        "https://via.placeholder.com/50"
                      }
                      alt="User profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      {editingComment === comment.id ? (
                        <>
                          <input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="bg-[#292F3C] text-white p-2 rounded mr-2 outline-none"
                            placeholder="Edit Comment..."
                          />
                          <button
                            className="text-green-500 hover:text-green-300"
                            onClick={() => handleEditCommentSubmit(comment.id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-300 ml-2"
                            onClick={handleCancelEditComment}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-white font-semibold">
                            {comment.userName}{" "}
                            <span className="text-gray-400 text-sm">
                              • {moment(comment.createdOn).fromNow()}
                            </span>
                          </div>
                          <div className="text-white">{comment.comment}</div>
                        </>
                      )}

                      {comment.replyList?.length > 0 && (
                        <button
                          className="text-blue-500 mt-1"
                          onClick={() => toggleRepliesVisibility(comment.id)}
                        >
                          {visibleReplies[comment.id]
                            ? "Hide Replies"
                            : "Show Replies"}
                        </button>
                      )}

                      <button
                        className="text-blue-500 mt-1 ml-4"
                        onClick={() => openReplyBox(comment.id)}
                      >
                        {activeReplyCommentId === comment.id
                          ? "Hide Reply Box"
                          : "Reply"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleEditCommentClick(comment.id, comment.comment)
                      }
                      className="text-xs text-green-500 hover:text-green-300 flex items-center mr-2"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 mr-4"
                    >
                      <img
                        src={deleteIcon}
                        alt="delete"
                        className="w-[21px] h-[21px] mx-auto flex items-center justify-center"
                      />
                    </button>
                  </div>
                </div>

                {activeReplyCommentId === comment.id && (
                  <div className="mt-2 ml-10 flex items-center">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-[#292F3C] text-white p-2 rounded-full mr-2 outline-none"
                      placeholder="Reply..."
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="bg-[#007bff] p-2 rounded-full hover:bg-[#0056b3] flex items-center justify-center"
                    >
                      <FaTelegramPlane className="text-white" />
                    </button>
                  </div>
                )}

                {visibleReplies[comment.id] && (
                  <div className="ml-10 mt-2">
                    {comment.replyList.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start justify-between mb-4 mr-4"
                      >
                        <div className="flex">
                          <img
                            src={
                              reply.userProfilePic ||
                              "https://via.placeholder.com/50"
                            }
                            alt="Reply user profile"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            {editingReply.commentId === comment.id &&
                            editingReply.replyId === reply.id ? (
                              <>
                                <input
                                  value={replyTextMap[reply.id] || reply.reply} // Set the value from replyTextMap or the original reply
                                  onChange={(e) =>
                                    handleReplyTextChange(
                                      reply.id,
                                      e.target.value
                                    )
                                  }
                                  className="bg-[#292F3C] text-white p-2 rounded mr-2 outline-none"
                                  placeholder="Edit Reply..."
                                />
                                <button
                                  className="text-green-500 hover:text-green-300"
                                  onClick={() =>
                                    handleEditReplySubmit(reply.id)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="text-gray-500 hover:text-gray-300 ml-2"
                                  onClick={handleCancelEditReply}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="text-white font-semibold">
                                  {reply.userName || "Expert"}{" "}
                                  <span className="text-gray-400 text-sm">
                                    • {moment(reply.createdOn).fromNow()}
                                  </span>
                                </div>
                                <div className="text-white">{reply.reply}</div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleEditReplyClick(comment.id, reply.id)
                            }
                            className="text-xs text-green-500 hover:text-green-300 flex items-center mr-2"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="text-red-500"
                          >
                            <img
                              src={deleteIcon}
                              alt="delete"
                              className="w-[21px] h-[21px] mx-auto flex items-center justify-center"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {comments.length < postData.commentCount && (
              <button
                onClick={loadMoreComments}
                className="text-blue-500 mt-2 block"
              >
                Load More Comments
              </button>
            )}
          </div>
        )}
      </div>

      {isOpenEditDelDialog && (
        <EditDeleteDialog
          closeDialog={() => setIsOpenEditDelDialog(false)}
          position={dialogPosition}
          postId={id}
          handleEdit={() => {
            closeDialog();
            openUploadPostDialog(postData.id);
          }}
          refreshFeed={refreshFeed}
          closePopup={closeDialog}
        />
      )}
    </div>
  );
};

export default ImageDetailsDialog;
