// ConfirmPassword.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { closeIcon, signup, eye, eyeClose } from "../assets";
import api, { getFullUrl } from '../api'; // Import the Axios instance

const ConfirmPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { token } = queryString.parse(location.search);
    if (token) {
      const decodedToken = decodeURIComponent(token).replace(/ /g, "+");
      sessionStorage.setItem("resetToken", decodedToken);
    } else if (!sessionStorage.getItem("resetToken")) {
      toast.error("Invalid or missing token");
      navigate("/signup");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const token = sessionStorage.getItem("resetToken");

    try {
      const relativeUrl = '/Users/ResetForgotPassword'; // Updated relative URL
      const fullUrl = getFullUrl(relativeUrl); // Use getFullUrl to construct the URL

      const response = await api.post(
        fullUrl,
        {
          password: confirmPassword,
          token,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.isSuccess) {
        toast.success("Password has been successfully reset");
        navigate("/signup");
        sessionStorage.removeItem("resetToken");
      } else {
        toast.error(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/signup");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <ToastContainer />
      <div
        className="h-screen w-screen md:ml-[-7rem]"
        style={{
          backgroundImage: `url(${signup})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 w-screen h-screen">
        <div className="bg-gradient border-[1px] border-[#ffffff2a] m-4 p-6 rounded-lg w-96 relative text-center">
          <div className="absolute top-3 right-0 text-right">
            <button
              onClick={handleClose}
              className="text-gray-400 w-8 text-[20px] cursor-pointer hover:text-white"
            >
              <img src={closeIcon} alt="close" />
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl text-left font-semibold text-white">
              Set New Password
            </h2>
          </div>
          <form
            className="flex flex-col gap-4 text-white"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-left px-4 py-3 border border-[#ffffff34] rounded-xl focus:outline-none focus:border-white-500 bg-transparent w-full"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? eye : eyeClose}
                  className="w-5"
                  alt="toggle visibility"
                />
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-left px-4 py-3 border border-[#ffffff34] rounded-xl focus:outline-none focus:border-white-500 bg-transparent w-full"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showConfirmPassword ? eye : eyeClose}
                  className="w-5"
                  alt="toggle visibility"
                />
              </button>
            </div>
            <button
              type="submit"
              className={`bg-white hover:bg-black hover:text-white text-black transition duration-300 font-semibold text-[20px] py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConfirmPassword;
