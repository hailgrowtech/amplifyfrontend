import React, { useEffect, useState } from "react";
import api from "../api";
import { FaTrash, FaTelegramPlane, FaEdit, FaSave, FaTimes } from "react-icons/fa"; // Icons for delete, send, edit, save, and cancel
import moment from "moment"; // Library for formatting time
import { closeIcon } from "../assets";

const CommentPopup = ({ isOpen, closePopup, callPostId, stackholderId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState(""); // State for reply input
  const [replyingTo, setReplyingTo] = useState(null); // To track which comment is being replied to
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [shownReplies, setShownReplies] = useState([]); // To track which comments' replies are shown
  const [editingReply, setEditingReply] = useState({}); // To track which reply is being edited

  useEffect(() => {
    if (isOpen) {
      setComments([]); // Reset comments when popup opens
      setPage(1); // Reset to the first page
      setHasMore(true); // Reset pagination
      setShownReplies([]); // Reset shown replies
      setEditingReply({}); // Reset editing replies
      fetchComments(1); // Fetch first page of comments
    }
  }, [isOpen]);

  const fetchComments = async (page) => {
    try {
      if (!loading && hasMore) {
        setLoading(true);
        const response = await api.get(
          `/CallPost/GetComment/${callPostId}?Id=${stackholderId}&page=${page}&pageSize=20`
        );
        const newComments = response.data.data;

        setComments((prevComments) => {
          // Avoid duplicate comments if the same page is fetched multiple times
          const commentIds = prevComments.map((comment) => comment.id);
          const uniqueNewComments = newComments.filter(
            (comment) => !commentIds.includes(comment.id)
          );

          return [...prevComments, ...uniqueNewComments];
        });
        setHasMore(newComments.length > 0); // Stop loading if no more comments
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      const nextPage = page + 1;
      fetchComments(nextPage);
      setPage(nextPage);
    }
  };

  const handleSendComment = async () => {
    // Add logic to send the new comment
    if (newComment.trim()) {
      try {
        const commentData = {
          callPostId,
          userId: stackholderId, // Assuming userId is stackholderId
          comment: newComment,
        };
        console.log(commentData);
        
        const response = await api.post("/CallPost/Comment", commentData);
        if (response.data.isSuccess) {
          // Prepend the new comment to the comments list
          setComments((prevComments) => [response.data.data, ...prevComments]);
          setNewComment(""); // Clear the input field after sending the comment
        } else {
          console.error("Failed to add comment:", response.data.displayMessage);
        }
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId, userName) => {
    try {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${userName}'s comment?`);
      if (!confirmDelete) return;

      await api.delete(`/CallPost/DeleteComment/${commentId}`);
      // Remove the deleted comment from the state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReplyClick = (commentId) => {
    // If the commentId is already set in `replyingTo`, clear it to close the reply input
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText(""); // Clear any existing reply text
  };

  const handleSendReply = async (callCommentId) => {
    if (replyText.trim()) {
      try {
        // Prepare the data for the API call
        const replyData = {
          callPostId,
          callCommentId,
          expertsId: stackholderId, // Assuming expertsId is the same as stackholderId
          reply: replyText,
        };

        // Send the reply
        const response = await api.post("/CallPost/CommentReply", replyData);
        if (response.data.isSuccess) {
          // Update the specific comment's replyList with the new reply
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === callCommentId
                ? { ...comment, replyList: [response.data.data, ...comment.replyList] }
                : comment
            )
          );
          console.log("Reply sent:", replyData);
          setReplyingTo(null); // Reset after sending reply
          setReplyText(""); // Clear reply input
        } else {
          console.error("Failed to send reply:", response.data.displayMessage);
        }
      } catch (error) {
        console.error("Error sending reply:", error);
      }
    }
  };

  const handleShowReplies = (commentId) => {
    if (shownReplies.includes(commentId)) {
      // Hide replies
      setShownReplies(shownReplies.filter((id) => id !== commentId));
    } else {
      // Show replies
      setShownReplies([...shownReplies, commentId]);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await api.delete(`/CallPost/DeleteCommentReply/${replyId}`);
      // Remove the deleted reply from the state
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          replyList: comment.replyList.filter((reply) => reply.id !== replyId),
        }))
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleEditReplyClick = (commentId, replyId) => {
    setEditingReply({ commentId, replyId });
  };

  const handleCancelEditReply = () => {
    setEditingReply({});
  };

  const handleSaveEditReply = async (commentId, replyId) => {
    if (editingReply.newReplyText && editingReply.newReplyText.trim()) {
      try {
        const patchData = [
          {
            path: "reply",
            op: "replace",
            value: editingReply.newReplyText,
          },
        ];

        await api.patch(`/CallPost/EditCommentReply?Id=${replyId}`, patchData);

        // Update the reply in the state
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replyList: comment.replyList.map((reply) =>
                    reply.id === replyId
                      ? { ...reply, reply: editingReply.newReplyText }
                      : reply
                  ),
                }
              : comment
          )
        );

        console.log("Reply edited successfully.");
        setEditingReply({});
      } catch (error) {
        console.error("Error editing reply:", error);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    return moment(dateString).fromNow();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#2E374B] rounded-lg w-[400px] h-[600px] relative flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-bold text-white">Comments</h2>
            <button onClick={closePopup} className="text-red-500">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          {/* Comment List (scrollable) */}
          <div className="flex-1 overflow-y-scroll p-4" onScroll={handleScroll}>
            <div className="text-[#BABABA]">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="mb-4 p-2 border-b border-[#292F3C] flex flex-col"
                  >
                    <div className="flex items-start">
                      {/* Profile Image */}
                      <img
                        src={
                          comment.userProfilePic ||
                          "https://via.placeholder.com/40"
                        } // Fallback image
                        alt={comment.userName}
                        className="w-[40px] h-[40px] rounded-full mr-4"
                      />
                      {/* Comment Details */}
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {comment.userName}
                          <span className="text-xs text-gray-400">
                            {" "}
                            • {formatTimeAgo(comment.createdOn)}
                          </span>
                        </p>
                        <p className="text-sm">{comment.comment}</p>

                        {/* Reply Button */}
                        <button
                          className="text-xs text-gray-500 hover:text-white mt-1"
                          onClick={() => handleReplyClick(comment.id)}
                        >
                          {replyingTo === comment.id ? "Cancel Reply" : "Reply"}
                        </button>

                        {/* Reply Input */}
                        {replyingTo === comment.id && (
                          <div className="flex items-center mt-2">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 bg-[#292F3C] text-white p-2 rounded-full mr-2 outline-none"
                            />
                            <button
                              onClick={() => handleSendReply(comment.id)}
                              className="bg-[#007bff] p-2 rounded-full hover:bg-[#0056b3] flex items-center justify-center"
                            >
                              <FaTelegramPlane className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Delete Icon */}
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment.id, comment.userName)} // Call handleDeleteComment
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Show Replies Button */}
                    {comment.replyList && comment.replyList.length > 0 && (
                      <button
                        className="text-xs text-blue-500 hover:text-blue-300 mt-2"
                        onClick={() => handleShowReplies(comment.id)}
                      >
                        {shownReplies.includes(comment.id)
                          ? "Hide Replies"
                          : `Show Replies (${comment.replyList.length})`}
                      </button>
                    )}

                    {/* Replies */}
                    {shownReplies.includes(comment.id) && (
                      <div className="mt-2 pl-12">
                        {comment.replyList.map((reply) => (
                          <div
                            key={reply.id}
                            className="mb-2 p-2 border-b border-[#292F3C] flex flex-col"
                          >
                            <div className="flex items-start">
                              {/* Profile Image */}
                              <img
                                src={
                                  reply.userProfilePic ||
                                  "https://via.placeholder.com/40"
                                } // Fallback image
                                alt={reply.userName || "Anonymous"}
                                className="w-[30px] h-[30px] rounded-full mr-4"
                              />
                              {/* Reply Details */}
                              <div className="flex-1">
                                <p className="font-semibold text-white">
                                  {reply.userName || "Anonymous"}
                                  <span className="text-xs text-gray-400">
                                    {" "}
                                    • {formatTimeAgo(reply.createdOn)}
                                  </span>
                                </p>
                                <p className="text-sm">{reply.reply}</p>

                                {/* Edit and Delete Buttons */}
                                <div className="flex space-x-2 mt-1">
                                  <button
                                    className="text-xs text-green-500 hover:text-green-300 flex items-center"
                                    onClick={() =>
                                      handleEditReplyClick(comment.id, reply.id)
                                    }
                                  >
                                    <FaEdit className="mr-1" />
                                    {editingReply.commentId === comment.id &&
                                    editingReply.replyId === reply.id
                                      ? "Save"
                                      : "Edit"}
                                  </button>
                                  <button
                                    className="text-red-500 hover:text-red-300 flex items-center"
                                    onClick={() => handleDeleteReply(reply.id)}
                                  >
                                    <FaTrash className="mr-1" />
                                    Delete
                                  </button>
                                  {editingReply.commentId === comment.id &&
                                    editingReply.replyId === reply.id && (
                                      <button
                                        className="text-gray-500 hover:text-gray-300 flex items-center"
                                        onClick={handleCancelEditReply}
                                      >
                                        <FaTimes className="mr-1" />
                                        Cancel
                                      </button>
                                    )}
                                </div>

                                {/* Edit Reply Input */}
                                {editingReply.commentId === comment.id &&
                                  editingReply.replyId === reply.id && (
                                    <div className="flex items-center mt-2">
                                      <input
                                        type="text"
                                        placeholder="Edit reply..."
                                        value={editingReply.newReplyText || ""}
                                        onChange={(e) =>
                                          setEditingReply({
                                            ...editingReply,
                                            newReplyText: e.target.value,
                                          })
                                        }
                                        className="flex-1 bg-[#292F3C] text-white p-2 rounded-full mr-2 outline-none"
                                      />
                                      <button
                                        onClick={() =>
                                          handleSaveEditReply(
                                            comment.id,
                                            reply.id
                                          )
                                        }
                                        className="bg-[#28a745] p-2 rounded-full hover:bg-[#218838] flex items-center justify-center"
                                      >
                                        <FaSave className="text-white" />
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-white">No comments yet.</p>
              )}
              {loading && <p className="text-white">Loading...</p>}
            </div>
          </div>

          {/* Input Section (fixed) */}
          {/* <div className="flex items-center p-4 bg-[#2E374B]">
            <input
              type="text"
              placeholder="Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-[#292F3C] text-white p-2 rounded-full mr-2 outline-none"
            />
            <button
              onClick={handleSendComment}
              className="bg-[#007bff] p-2 rounded-full hover:bg-[#0056b3] flex items-center justify-center"
            >
              <FaTelegramPlane className="text-white" />
            </button>
          </div> */}
        </div>
        </div>
      )
    );
  };

  export default CommentPopup;
