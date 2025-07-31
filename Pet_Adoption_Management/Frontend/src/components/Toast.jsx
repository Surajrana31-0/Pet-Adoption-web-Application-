import React from "react";
import "../styles/Toast.css";

const Toast = ({ message, type }) => {
  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
      aria-live="assertive"
      tabIndex={0}
    >
      {message}
    </div>
  );
};

export default Toast; 