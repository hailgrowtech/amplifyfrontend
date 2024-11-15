import React, { useEffect, useState } from "react";
import PageHeader from "../Header/Header";
import "./Blog.css";
import { ToastContainer, toast } from "react-toastify";
import { FaPen } from "react-icons/fa";
import Bin from "../../assets/TrashBinMinimalistic.png";
import BlogPage from "../BlogPage/BlogPage";
import "react-toastify/dist/ReactToastify.css";

const Blog = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`https://copartners.in:5134/api/Blogs?page=1&pageSize=10000`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditBlog(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://copartners.in:5134/api/Blogs/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const handleAddEditBlog = async (responseData) => {
    if (!responseData.isSuccess) {
      throw new Error(`Failed to ${editBlog ? "update" : "add"} blog`);
    }
    toast.success(`Blog ${editBlog ? "updated" : "added"} successfully`);
    fetchBlogs();
  };

  const openAddBlog = () => {
    setIsPopupOpen(true);
    setEditBlog(null);
  };

  const openEditBlog = (blog) => {
    setIsPopupOpen(true);
    setEditBlog(blog);
  };

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Blogs"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />
      <div className="p-4">
        <div className="dashboard-view-section mb-4">
          <div className="table-list-mb">
            <div className="channel-heading flex">
              <h3 className="text-xl font-semibold mr-auto">Listing</h3>
              <button
                className="border-2 border-black rounded-lg px-4 py-1 mr-4"
                onClick={openAddBlog}
              >
                + Add
              </button>
            </div>
            <div className="py-4 px-8">
              <table className="table-list">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", paddingLeft: "2rem" }}>
                      Date
                    </th>
                    <th style={{ textAlign: "left" }}>Blog Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="even:bg-gray-100 odd:bg-white">
                      <td style={{ textAlign: "left", paddingLeft: "2rem" }}>
                        {new Date(blog.createdOn).toLocaleDateString()}
                      </td>
                      <td
                        style={{ textAlign: "left" }}
                        className="text-blue-600"
                      >
                        {blog.title}
                      </td>
                      <td className="flex justify-center items-center gap-6">
                        <FaPen
                          className="text-blue-600 cursor-pointer"
                          onClick={() => openEditBlog(blog)}
                        />
                        <img
                          className="w-6 h-6 cursor-pointer"
                          src={Bin}
                          alt="Delete"
                          onClick={() => handleDelete(blog.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <BlogPage
          blog={editBlog}
          onClose={handleClosePopup}
          onSubmit={handleAddEditBlog}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Blog;
