import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Box, Button } from '@mui/material';
import { FaBell, FaUserCircle } from 'react-icons/fa';  // Icons
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../style/CollectorHeader.css';  // Import the CSS file for custom styling

const CollectorHeader = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({
            user: null,
            admin: null,
            wasteCollector: null,
            token: "",
        });
        localStorage.removeItem("auth");
        toast.success("Logged out successfully");
        navigate('/login'); // Redirect to login after logout
        window.location.reload(); // Optional: To refresh after logout
    };

    const goToHome = () => {
        navigate('/whome'); // Adjust the route as needed
    };

    const goToCollections = () => {
        navigate('/collector-schedule'); // Adjust the route as needed
    };

    const goToAccount = () => {
        navigate('/collector-profile'); // Adjust the route as needed
    };

    return (
        <header className="navbar">
            <Toolbar className="toolbar">
                {/* Left side: Logo and Title */}
                <Typography variant="h6" className="logo" onClick={goToHome} style={{ cursor: 'pointer' }}>
                  LOGO
                </Typography>

                {/* Menu and Navigation Links */}
                <Box className="nav-links" sx={{ flexGrow: 1 }}>
                    <Button
                        color="inherit"
                        onClick={goToHome}
                        className="nav-link"
                    >
                        Home
                    </Button>
                    {auth?.wasteCollector && (
                        <Button
                            color="inherit"
                            onClick={goToCollections}
                            className="nav-link"
                        >
                            Schedule
                        </Button>
                    )}

                    <Button
                        color="inherit"
                        onClick={goToAccount}
                        className="nav-link"
                    >
                        Account
                    </Button>

                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        className="nav-link logout-link"  // Special class for Logout button
                    >
                        Logout
                    </Button>
                </Box>

                {/* Right side: Icons */}
                <Link to="/notify" style={{ textDecoration: 'none' }}>
                    <FaBell className="bell-icon" />
                </Link>
                <IconButton className="profile-icon">
                    <FaUserCircle className="profile-icon" />
                </IconButton>
            </Toolbar>
        </header>
    );
};

export default CollectorHeader;