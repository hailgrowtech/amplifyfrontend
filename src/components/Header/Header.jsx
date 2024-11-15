// PageHeader.jsx
import { useState } from "react";
import './Header.css'
import { UilSearch } from "@iconscout/react-unicons";
import { LuBell } from "react-icons/lu";
import { motion } from "framer-motion";
import profileImage from "../../assets/an-avatar-of-a-brown-guy-looking-at-you-with-cute-smiles-with-transparent-background-hes-wearing-a-627855248.png";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PageHeader = ({ title, searchQuery, setSearchQuery }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);

  return (
    <motion.div  className="dashboard-header grid grid-cols-3 gap-4 mb-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}>
      {/* Left: Dashboard Heading */}
      <div className="col-span-1 flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* Middle: Search Bar with Search Icon */}
      <div className="col-span-1 flex items-center relative search-bar bg-white rounded-md">
        {/* Search Bar Input */}
        <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none py-2 px-8 w-full placeholder-gray-500 text-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Search Icon */}
        <span className="absolute right-3 text-2xl text-gray-500 search-icon">
          <UilSearch />
        </span>
      </div>

      {/* Right: Bell Icon and Circular Profile Image */}
      <div className="col-span-1 flex items-center justify-end space-x-4">
        <div className="profile-image-container">
          {/* Circular Profile Image with onClick to open the sidebar */}
          <Link to={"/sub-admin"} title="Profile" onClick={() => setProfileSidebarOpen(true)}>
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : profileImage
              }
              alt="Profile"
              className="profile-image"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  setHasNotification: PropTypes.func.isRequired,
};

export default PageHeader;