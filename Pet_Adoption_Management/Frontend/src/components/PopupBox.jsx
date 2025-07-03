import React from "react";
import "./PopupBox.css";

const PopupBox = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="popupbox-overlay">
      <div className="popupbox-modal">
        <span className="popupbox-message">{message}</span>
        <button className="popupbox-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PopupBox; 