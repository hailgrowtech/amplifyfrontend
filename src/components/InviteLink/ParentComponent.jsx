import React, { useState } from "react";
import LinkPopup from "./LinkPopup";

function ParentComponent({chatId}) {
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowLinkPopup(true);
  };

  const handleClosePopup = () => {
    setShowLinkPopup(false);
  };

  return (
    <div>
      <button className="text-white mt-24" onClick={handleOpenPopup}>Show Link Popup</button>
      {showLinkPopup && (
        <LinkPopup onClose={handleClosePopup} link="https://example.com" />
      )}
    </div>
  );
}

export default ParentComponent;
