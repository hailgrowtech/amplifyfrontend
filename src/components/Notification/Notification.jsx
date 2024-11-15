import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import PageHeader from "../Header/Header";
import ReTarget from "./ReTarget";
import Discount from "./Discount";
import AP from "./AP";
import NewUser from "./NewUser";
import NewRA from "./NewRA";
import PaymentIncomplete from "./PaymentIncomplete";

const Notification = () => {
  const [activeButton, setActiveButton] = useState("ReTarget");
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const renderComponent = () => {
    switch (activeButton) {
      case "ReTarget":
        return <ReTarget searchQuery={searchQuery} />;
      case "Discount":
        return <Discount searchQuery={searchQuery} />;
      case "AP":
        return <AP searchQuery={searchQuery} />;
      case "NewUser":
        return <NewUser searchQuery={searchQuery} />;
      case "NewRA":
        return <NewRA searchQuery={searchQuery} />;
      case "PaymentIncomplete":
        return <PaymentIncomplete searchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  const Button = ({ id, label }) => (
    <button
      onClick={() => handleButtonClick(id)}
      className={`w-full sm:w-auto px-4 py-2 border-2 rounded-xl ${
        activeButton === id ? "border-black" : "border-gray-200"
      } font-semibold`}
    >
      {label}
    </button>
  );

  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="User Data"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNotification={hasNotification}
        setHasNotification={setHasNotification}
      />

      <div className="px-4 md:flex grid grid-cols-2 md:flex-wrap gap-2 md:gap-8">
        <Button id="ReTarget" label="ReTarget" />
        <Button id="Discount" label="Discount" />
        <Button id="AP" label="AP" />
        <Button id="NewUser" label="NewUser" />
        <Button id="NewRA" label="NewRA" />
        <Button id="PaymentIncomplete" label="Payment Incomplete" />
      </div>

      <div className="p-4">
        <div className="dashboard-view-section mb-4">
          <div className="table-list-mb">
            <div className="channel-heading flex">
              <h3 className="text-xl font-semibold mr-auto">{activeButton}</h3>
            </div>
            {renderComponent()}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Notification;
