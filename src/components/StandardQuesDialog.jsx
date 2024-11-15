import React, { useState } from "react";
import axios from "axios";
import { closeIcon } from "../assets";
import { toast } from "react-toastify";
import api from "../api";

const StandardQuesDialog = ({ closeDialog, handleAddQuestion }) => {
  const [addQues, setAddQues] = useState('');
  const [addAns, setAddAns] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const stackholderId = sessionStorage.getItem("stackholderId");

  const handleSuccess = () => {
    toast.success("Question added successfully!", {
      position: "top-right",
    });
  };

  const handleSubmit = async () => {
    if (addQues && addAns) {
      setLoading(true);
      try {
        const response = await api.post('/StandardQuestions', {
          expertId: stackholderId,
          chatId: 'string', 
          question: addQues,
          answer: addAns
        });

        if (response.status === 200) {
          handleAddQuestion(addQues, addAns);
          handleSuccess();
          closeDialog();
        } else {
          setError("Failed to add question");
        }
      } catch (error) {
        setError("An error occurred while adding the question");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Both fields are required");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center py-[2rem] justify-center">
      <div className="fixed inset-0 z-[999] flex items-center py-[2rem] justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[1084px] w-[378px] md:h-auto h-[600px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Add Question & Answer
            </h2>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          <div className="flex flex-col md:mt-0 mt-[1rem] gap-4 md:w-[1006px] md:h-auto">
            <div className="relative md:ml-0 ml-[-16px]">
              <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] w-[90px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[13px] text-center">
                Question
              </label>
              <textarea
                typeof="text"
                onChange={(e) => setAddQues(e.target.value)}
                value={addQues}
                rows="4"
                className="block p-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] md:w-full w-[105%]"
                placeholder="Write something here"
              ></textarea>
            </div>

            <div className="relative md:ml-0 ml-[-16px]">
              <label className="flex items-center justify-center bg-[#282F3E] text-white opacity-[50%] w-[90px] h-[26px] rounded-[8px] font-[400] md:text-[14px] text-[13px] md:leading-[16px] leading-[13px] text-center">
                Answer
              </label>
              <textarea
                typeof="text"
                onChange={(e) => setAddAns(e.target.value)}
                value={addAns}
                rows="4"
                className="block p-2 rounded-md text-white border border-[#40495C] bg-[#282F3E] md:w-full w-[105%]"
                placeholder="Write something here"
              ></textarea>
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-2 justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 w-[100%] py-2 bg-blue-500 text-white md:text-[14px] text-[14px] rounded-lg hover:bg-blue-600"
            >
              Confirm
            </button>
            <button
              onClick={closeDialog}
              className="px-4 w-[100%] py-2 mr-2 bg-gray-300 md:text-[14px] text-[14px] text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default StandardQuesDialog;
