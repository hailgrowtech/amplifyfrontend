import React from "react";
import { closeIcon, userImg } from "../../assets";

const totalFollowers = [
  {
    id: 1,
    userImg: userImg,
    name: "Vinit Chaudhary",
    followingData: "3/09/2024",
  },
  {
    id: 2,
    userImg: userImg,
    name: "Priyank Raj",
    followingData: "23/08/2024",
  },
  {
    id: 3,
    userImg: userImg,
    name: "Saksham Agarwal",
    followingData: "12/04/2024",
  },
  {
    id: 4,
    userImg: userImg,
    name: "Parvez Alam",
    followingData: "08/02/2024",
  },
];

const FollowerFeedDialog = ({ closeDialog }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-[40%]">
        <div className="bg-[#2E374B] rounded-lg md:w-[430px] w-[278px] md:h-[450px] h-[360px] overflow-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="md:h-[52px] font-inter font-[700] md:text-[30px] text-[18px] md:leading-[51px] text-new md:ml-0 ml-[-0.8rem]">
              Followers
            </h2>
            <button onClick={closeDialog} className="md:mr-0 mr-[-1.4rem]">
              <img
                src={closeIcon}
                alt="Close_Icon"
                className="md:w-[35px] w-[40px] md:h-[35px] h-[40px]"
              />
            </button>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {totalFollowers.map((users) => {
              return (
                <div className="flex items-center gap-4 bg-white rounded-[12px] p-4">
                  <img
                    src={users.userImg}
                    alt="USER_IMG"
                    className="w-[52px] h-[52px] rounded-2xl"
                  />
                  <div className="flex flex-col">
                    <span className="font-[500] text-[16px] leading-[22px]">
                      {users.name}
                    </span>
                    <span className="text-[#24243F] font-[500] text-[10px] leading-[15px]">
                      Following Date:{" "}
                      <span className="font-[500] text-[12px] leading-[15px] text-black">
                        {users.followingData}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerFeedDialog;
