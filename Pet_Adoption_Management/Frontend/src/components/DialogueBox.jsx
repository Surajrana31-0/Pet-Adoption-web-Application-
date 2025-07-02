import React from "react";
import "./Modal.css";

const Modal = ({ open, onClose, title, message, type = "info" }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className={`modal-box modal-${type}`}>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-message">{message}</div>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
