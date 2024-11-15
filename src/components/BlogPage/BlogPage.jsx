import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import close from "../../assets/close.png";
import select from "../../assets/+ Add Currency.png";
import { toast } from "react-toastify";

function BlogPage({ onClose, blog = null, onSubmit }) {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setBlogTitle(blog.title);
      setBlogDescription(blog.description);
      setImageUrl(blog.blogImagePath);
    }
  }, [blog]);

  // Function to handle image selection
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = imageUrl;

      if (selectedImage) {
        const uploadResponse = await uploadImageToS3(selectedImage);
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }
        const uploadData = await uploadResponse.json();
        uploadedImageUrl = uploadData.data.presignedUrl;
      }

      const blogData = {
        title: blogTitle,
        description: blogDescription,
        blogImagePath: uploadedImageUrl,
      };

      let response;
      if (blog) {
        response = await fetch(
          `https://copartners.in:5134/api/Blogs/${blog.id}`,
          {
            method: "PUT",
            body: JSON.stringify(blogData),
            headers: {
              "Content-Type": "application/json-patch+json",
            },
          }
        );
      } else {
        response = await fetch("https://copartners.in:5134/api/Blogs", {
          method: "POST",
          body: JSON.stringify(blogData),
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        });
      }

      const responseData = await response.json();
      if (!responseData.isSuccess) {
        throw new Error("Failed to submit blog");
      }
      onSubmit(responseData);
      onClose();
    } catch (error) {
      toast.error("Error submitting blog");
      console.error("Error submitting blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageToS3 = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    return fetch("https://copartners.in:5134/api/AWSStorage?prefix=Images", {
      method: "POST",
      body: formData,
    });
  };

  const handleSelectImageClick = () => {
    document.getElementById("image-upload").click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="popup bg-[white] border-[1px] border-[#ffffff2a] m-4 rounded-lg w-3/4 h-[90%] text-center">
        <div className="bg-[#dddddd] px-4 py-2 rounded-t-lg flex justify-between">
          <h2 className="text-left font-semibold text-2xl">
            {blog ? "Edit" : "Add"} Blog
          </h2>
          <button onClick={onClose}>
            <img className="w-8 h-8 mr-4" src={close} alt="Close" />
          </button>
        </div>
        <div className="font-semibold text-2xl px-12 py-4 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-4">
            <label htmlFor="image-upload">Upload Title Image</label>
            <img
              className={`w-96 ${
                imageUrl || selectedImage ? "h-56" : ""
              } cursor-pointer`}
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : imageUrl || select
              }
              alt="Select"
              onClick={handleSelectImageClick}
            />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="relative flex flex-col">
            <TextField
              id="blog-title"
              label="Blog Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div className="flex flex-col">
            <TextField
              id="blog-description"
              label="Blog Description"
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              required
              rows={4}
            />
          </div>
        </div>
        <button
          className="px-12 bg-blue-500 text-white py-2 border-2 rounded-lg"
          onClick={handleFormSubmit}
          type="button"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : blog ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default BlogPage;
