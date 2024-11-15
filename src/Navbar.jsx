import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchIcon, logo, notification, dummyUser } from "./assets";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("copartner");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex items-center md:py-[1rem]">
      <nav className="flex justify-between items-center w-full">
        <Link to="/">
          <img src={logo} alt="logo" className="xl:w-[200px] md:w-[210px] h-[39px] ml-[-4rem] mt-2" />
        </Link>

        {/* Search Button bar and profile picture */}
        <div className="flex items-center">
          <div className="flex w-[265px] h-[50px] items-center justify-center">
            <button
              className="bg-[#fff] text-[#000] md:text-[15px] px-8 py-3 rounded-md font-semibold"
            >
              Earning Calculator
            </button>
          </div>

          <div className="flex gap-[2rem] items-center">
            <div className="relative">
              <img
                src={searchIcon}
                alt=""
                className="cursor-pointer absolute top-1/2 left-4 transform -translate-y-1/2 w-[19px] h-[19px]"
              />
              <input
                type="text"
                placeholder="Search for something"
                className="pl-10 pr-4 bg-[#2E323C] w-[252px] h-[55px] text-white rounded-[10px]"
              />
            </div>

            <div className="flex items-center justify-center w-[46px] h-[50px] border-2 border-[#282F3E] p-1 rounded-[10px]">
              <img
                src={notification}
                alt="Notification Icon"
                className="w-[21px] h-[21px] cursor-pointer"
              />
            </div>

            <img
              src={dummyUser}
              alt="LoginUser"
              className="w-[50px] h-[50px] rounded-full"
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
