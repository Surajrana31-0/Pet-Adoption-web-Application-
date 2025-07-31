import React from "react";
import "./DialogueBox.css";

const Modal = ({ open, onClose, title, message, type = "info", actions }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className={`modal-box modal-${type}`}>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          {actions && actions.length > 0 ? (
            actions.map((action, idx) => (
              <button
                key={idx}
                className="modal-action-btn"
                style={action.style}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button className="modal-close-btn" onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
