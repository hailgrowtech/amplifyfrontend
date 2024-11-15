import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sideBar } from "./constants";
import { closeIcon, login, logo } from "./assets";

const Sidebar = ({ activeTab, setActiveTab, setShowSidebar, telegramData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/signup");
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeNav = sideBar.find(
      (side) =>
        `/${side.id}` === currentPath ||
        (side.id === "dashboard" && currentPath === "/")
    );
    if (activeNav) {
      setActiveTab(activeNav.title);
    } else {
      setActiveTab(null);
    }
  }, [location, setActiveTab]);

  const handleClose = () => {
    setShowSidebar(false);
    setActiveTab("");
  };

  const handleSidebarTabClick = () => {
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
    setActiveTab("");
  };

  return (
    <div
      className={`fixed overflow-y-auto flex flex-col bg-gradient h-full z-[999] ${
        window.innerWidth < 768 ? "w-[80%]" : "w-[220px]"
      } pt-[2rem]`} // Added top padding
      style={{ left: 0, top: 0 }} // Ensure it stays fixed on the left
    >
      <div className="flex items-center justify-between px-8">
        <Link onClick={scrollToTop} to="/">
          <img
            src={logo}
            className="mx-auto mb-4 w-auto h-[40px]"
            alt="Logo"
          />
        </Link>
        <button
          onClick={handleClose}
          className={`relative mb-4 ${window.innerWidth < 768 ? "flex" : "hidden"}`}
        >
          <img src={closeIcon} alt="Close" className="w-[40px] h-[40px]" />
        </button>
      </div>

      <div className="flex flex-col gap-8 mt-[1rem] px-4">
        {sideBar.map(
          (side) =>
            (side.title !== "Telegram Channel" || telegramData.length > 0) && (
              <Link
                to={side.path}
                key={side.id}
                onClick={() => {
                  scrollToTop();
                  setActiveTab(side.title);
                  handleSidebarTabClick();
                }}
                className={`flex w-auto h-[54px] items-center gap-4 px-4 py-2 rounded-[12px] text-white cursor-pointer ${
                  window.innerWidth >= 768 &&
                  (activeTab === side.title
                    ? "tab-btn text-[#fff] px-4"
                    : "text-white opacity-[50%]")
                }`}
              >
                <img
                  src={
                    activeTab === side.title
                      ? side.activeIcon
                      : side.inactiveIcon
                  }
                  alt={side.title}
                  className="w-[24px] h-[24px]"
                />
                <span className="font-medium text-[16px]">{side.title}</span>
              </Link>
            )
        )}
      </div>
      <div className="mt-8 px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-white text-black rounded-lg flex items-center justify-center gap-2 text-[16px]"
        >
          Logout
          <img src={login} className="w-[16px] h-[16px]" alt="Login icon" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
