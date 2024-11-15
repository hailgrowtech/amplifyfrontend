import React from "react";
import { Link, useLocation } from "react-router-dom";
import { sideBar } from "./constants";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-gradient h-[100%] ml-[-4rem]">
      <div className="flex gap-[1rem] flex-col">
        {sideBar.map((side) => (
          <Link
            to={side.path}
            key={side.id}
            className={`flex w-[220px] h-[74px] rounded-[16px] text-white cursor-pointer ml-[-4rem] tab-btn ${
              location.pathname === side.path ? "btn-active" : ""
            }`}
          >
            <div className="flex flex-row justify-center gap-4 items-center ml-[4rem]">
              <img
                src={side.icon}
                alt={side.title}
                className="w-[24px] h-[24px]"
              />
              <span className="font-[400] text-[16px]">{side.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
