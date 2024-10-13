import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';  // Importing icons
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';  // Assuming you have auth context
import '../style/Header1.css';  // Import the CSS file

const Header1 = () => {
  const [auth] = useAuth(); // Get auth data
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic
    localStorage.removeItem('auth');
    navigate('/login');
    window.location.reload(); // Refresh page after logout
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="/path-to-logo" alt="Logo" className="logo" />  {/* Logo */}
        <nav>
          <Link to="/" className="nav-link">Home</Link>

          {auth?.user ? (
            <>
              {/* If admin role (role === 1) */}
              {auth.user.role === 1 && (
                <>
                  <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/schedule-management" className="nav-link">Waste Collection</Link>
                </>
              )}

              {/* If regular user with accountType 'Resident' (role === 0) */}
              {auth.user.role === 0 && (
                <>
                  <div className="dropdown">
                <a href="/services" className="nav-link">Services</a>
                <div className="dropdown-content">
                  <a href="/services/option1">Option 1</a>
                  <a href="/services/option2">Option 2</a>
                  <a href="/services/option3">Option 3</a>
                </div>
              </div>
                  <Link to="/contact" className="nav-link">Contact Us</Link>
                  <Link to="/all-schedule" className="nav-link">Schedule Pickup</Link>
                </>
              )}

              
              {/* Show logout for all authenticated users */}
              <Link to="/" onClick={handleLogout} className="nav-link">Logout</Link>
            </>
          ) : (
            <>
              {/* If not logged in */}
              <div className="dropdown">
                <a href="/services" className="nav-link">Services</a>
                <div className="dropdown-content">
                  <a href="/services/option1">Option 1</a>
                  <a href="/services/option2">Option 2</a>
                  <a href="/services/option3">Option 3</a>
                </div>
              </div>
              <Link to="/about" className="nav-link">About Us</Link>
              <a href="/contact" className="nav-link">Contact Us</a>
            </>
          )}
        </nav>
      </div>

      {/* Right side of the header */}
      <div className="navbar-right">
        {!auth?.user && (
          <>
            <Link to="/schedule-pickup" className="nav-link">Schedule Pickup</Link>
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
        <FaBell className="bell-icon" />  {/* Bell Icon */}
        <FaUserCircle className="profile-icon" />  {/* Profile Icon */}
      </div>
    </header>
  );
};

export default Header1;