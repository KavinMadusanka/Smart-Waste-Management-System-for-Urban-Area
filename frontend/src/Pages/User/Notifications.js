import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import Header1 from '../../components/Layout/Header1';
import { useAuth } from '../../context/auth';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Styled component for Schedule Card
const ScheduleCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backgroundColor: '#f5f5f5',
    borderLeft: '8px solid #4CAF50',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        backgroundColor: '#d0f0c0',
    },
}));

const Notifications = () => {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [auth] = useAuth(); // Get auth context
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            if (!auth || !auth.user || !auth.user.address) {
                // Check if auth, user, and address are defined
                toast.error('User not authenticated or address not available. Please log in.');
                return; // Exit if user is not authenticated
            }

            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                const userArea = auth.user.address.city; // Get user's area
                const allScheduled = response.data.filter(schedule =>
                    schedule.status.toLowerCase() === 'scheduled' &&
                    schedule.area === userArea // Match schedules area with user's area
                );
                setSchedules(response.data);
                setFilteredSchedules(allScheduled);
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, [auth]); // Add auth as a dependency to rerun effect if auth changes

    return (
        <Box>
            <Header1 />
            <Container maxWidth="lg" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Schedule Pickup Notifications
                </Typography><br/>

                {/* Schedule Cards for Scheduled Schedules */}
                <Box>
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map(schedule => (
                            <ScheduleCard key={schedule._id}>
                                <NotificationsIcon sx={{ marginRight: 1 }} />
                                <Typography>
                                    Your waste collection for {schedule.binType} bin type is on {format(new Date(schedule.pickupDate), 'dd MMM yyyy')} at {schedule.pickupTime}.
                                </Typography>
                            </ScheduleCard>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                            No scheduled pickups for this date.
                        </Typography>
                    )}
                </Box>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
        </Box>
    );
};

export default Notifications;
