import React from "react";
import "../styles/EmptyHeader.css";

const EmptyHeader = () => (
  <header className="empty-header">
    <div className="logo">PETEY</div>
    <nav className="nav-links">
      <a href="/">Home</a>
      <a href="/adopt">Adopt</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>
);

export default EmptyHeader; 