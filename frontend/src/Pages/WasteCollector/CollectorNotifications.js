import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd'; // Ant Design components
import { useAuth } from '../../context/auth';  
import CollectorHeader from './../../components/Layout/CollectorHeader';
import './../../components/style/collectorSchedule.css';
import { Typography } from '@mui/material';
import { NotificationImportant } from '@mui/icons-material'; // Importing notification icon
import { Box } from '@mui/material';

const CollectorNotifications = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auth] = useAuth(); // Auth context to get the logged-in waste collector info

    // Fetch schedules for the logged-in waste collector
    const fetchSchedules = async () => {
        if (!auth?.wasteCollector?._id) {
            setLoading(false);
            return; // Exit if there is no collector ID
        }

        try {
            const { data } = await axios.get(`/api/v1/collectionSchedule/get-schedule-by-collector/${auth.wasteCollector._id}`);
            console.log('Fetched schedules:', data); // Log the response
            if (data?.success) {
                setSchedules(data.collectionSchedules); // Ensure you're using the correct key from the response
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setError('Error fetching schedules. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [auth]);

    // Check for a scheduled pickup
    const scheduledPickup = schedules.find(schedule => schedule.status === 'Scheduled');

    return (
        <Box>
            <CollectorHeader />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '5vh', padding: '20px', alignItems: 'center' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Collection Pickup Notifications
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '30px', alignItems: 'center' }}>
                {loading ? (
                    <Spin tip="Loading schedules..." />
                ) : error ? (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '20px' }}
                    />
                ) : scheduledPickup ? (
                    <Box 
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px',
                            border: '1px solid #4caf50', // Change to green border
                            borderRadius: '5px',
                            backgroundColor: '#e8f5e9', // Change to light green background
                            color: '#2e7d32', // Change to dark green text
                            width: '80%', // Adjust width as needed
                            margin: '10px auto', // Center the box
                        }}
                    >
                        <NotificationImportant sx={{ marginRight: '10px', fontSize: '30px', color: '#4caf50' }} /> {/* Notification icon in green */}
                        <Typography align="center">
                            You have a schedule to pickup waste on {new Date(scheduledPickup.pickupDate).toLocaleDateString()} at {scheduledPickup.pickupTime} in {scheduledPickup.area} for {scheduledPickup.binType} waste.
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="h6" align="center">
                        No scheduled pickups found.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CollectorNotifications;
