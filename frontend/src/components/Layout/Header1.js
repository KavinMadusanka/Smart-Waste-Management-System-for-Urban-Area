import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';  // Importing icons
import '../style/Header1.css';  // Import the CSS file

const Header1 = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="/path-to-logo" alt="Logo" className="logo" />  {/* Logo */}
        <nav>
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About Us</a>
          <div className="dropdown">
            <a href="/services" className="nav-link">Services</a>
            <div className="dropdown-content">
              <a href="/services/option1">Option 1</a>
              <a href="/services/option2">Option 2</a>
              <a href="/services/option3">Option 3</a>
            </div>
          </div>
          <a href="/contact" className="nav-link">Contact Us</a>
        </nav>
      </div>
      <div className="navbar-right">
        <a href="/schedule-pickup" className="nav-link">Schedule Pickup</a>
        <a href="/login" className="nav-link">Log In</a>
        <a href="/signup" className="nav-link">Sign Up</a>
        <FaBell className="bell-icon" />  {/* Bell Icon */}
        <FaUserCircle className="profile-icon" />  {/* Profile Icon */}
      </div>
    </header>
  );
};

export default Header1;
