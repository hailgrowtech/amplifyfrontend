import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { closeIcon, signup } from "../assets";
import api from "../api";

const NewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/forget") {
      navigate("/forget");
    }
  }, [location.pathname, navigate]);

  const handleClose = () => {
    navigate("/signup");
  };

  const handleSuccess = () => {
    toast.success("Successfully Created!", {
      position: "top-right",
    });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const postData = {
      email: email,
    };

    try {
      const response = await api.post(
        "/Users/ForgotPassword",
        postData
      );

      handleSuccess();

      if (response.status !== 200) {
        toast.error("Something wrong happened!", {
          position: "top-right",
        });
      } else {
        toast.success("Password reset successful!", {
          position: "top-right",
        });
        // navigate("/signup");
      }
    } catch (error) {
      toast.error("Failed to submit data. Please try again.", {
        position: "top-right",
      });
      setError("Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        <div className="bg-[#18181B] border-[1px] border-[#ffffff2a] m-4 p-6 rounded-lg w-96 relative text-center">
          <div className="absolute top-3 right-0 text-right">
            <button
              onClick={handleClose}
              className="text-gray-400 w-8 text-[20px] cursor-pointer hover:text-white"
            >
              <img src={closeIcon} alt="close" />
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">Forget Your Password</h2>
          </div>
          <p className="text-gray-300 text-center mb-4">
            Enter your email address below.
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="w-full flex gap-2 flex-col justify-between">
            <div className="relative w-full mx-auto h-[50px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="bg-[#06030E] rounded-[10px] border border-[#18181B] w-full h-full text-white font-[400] text-[14px] p-2"
              />
            </div>
            <button
              onClick={handleContinue}
              className="w-full h-[50px] bg-white font-[500] text-[16px] leading-[20px] text-center rounded-[10px]"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
