import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { format, addDays, startOfWeek } from 'date-fns';
import Header1 from '../../components/Layout/Header1';
import { useAuth } from '../../context/auth'; // Assuming you're using a context for authentication

// Styled component for Day Button
const DayButton = styled(Button)(({ selected }) => ({
    backgroundColor: selected ? '#4CAF50' : '#fff',
    color: selected ? '#fff' : '#000',
    borderRadius: '12px',
    width: '80px',
    height: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: selected ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : '0px 2px 4px rgba(0, 0, 0, 0.1)',
    fontWeight: selected ? 'bold' : 'normal',
    '&:hover': {
        backgroundColor: selected ? '#388e3c' : '#f0f0f0',
    },
    transition: 'background-color 0.3s, box-shadow 0.3s',
}));

// Styled component for Schedule Card
const ScheduleCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backgroundColor: '#f5f5f5',
    borderLeft: '8px solid #4CAF50',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#d0f0c0',
    },
}));

const ViewAllSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    const [auth] = useAuth(); // Access the logged-in user
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date();
        const days = Array.from({ length: 7 }, (_, i) => addDays(today, i)); // Show 7 days from today
        setWeekDays(days);

        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
                filterSchedules(response.data, today); // Automatically display today's schedules on load
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    const filterSchedules = (schedulesList, selectedDate) => {
        const today = new Date();

        const filtered = schedulesList.filter(schedule => {
            const scheduleDate = new Date(schedule.pickupDate);

            // Filter schedules from today or future dates, and ensure the area matches the user's city
            const userCity = auth?.user?.address?.city?.toLowerCase();
            return (
                scheduleDate >= today && // Only current or future schedules
                format(scheduleDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                schedule.area.toLowerCase() === userCity
            );
        });

        setFilteredSchedules(filtered);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        filterSchedules(schedules, day);
    };

    return (
        <Box>
            <Header1 />
            <Container maxWidth="lg" sx={{ p: 4, mt: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Schedule pickups {auth?.user?.address?.city || 'Your City'}
                </Typography><br/>

                {/* Week Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {weekDays.map((day, index) => (
                            <Box key={index} sx={{ mx: 1, textAlign: 'center' }}>
                                <DayButton
                                    selected={format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')}
                                    onClick={() => handleDayClick(day)}
                                >
                                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                                        {format(day, 'EEE')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontSize: '18px' }}>
                                        {format(day, 'd')}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                                        {format(day, 'MMM')}
                                    </Typography>
                                </DayButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <br/>
                {/* Schedule Cards */}
                <Box container spacing={2}>
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map(schedule => (
                            <Box item xs={12} key={schedule._id}>
                                <ScheduleCard>
                                    <Typography>Pickup Time: {schedule.pickupTime}</Typography>
                                    <Typography>Bin Type: {schedule.binType}</Typography>
                                    {/* <Typography>
                                        Collector: {schedule.assignedCollector ? `${schedule.assignedCollector.firstName} ${schedule.assignedCollector.lastName}` : 'N/A'}
                                    </Typography> */}
                                    <Typography>Date: {format(new Date(schedule.pickupDate), 'dd MMM yyyy')}</Typography>
                                </ScheduleCard>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                            No schedules available for this date in your area.
                        </Typography>
                    )}
                </Box>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
        </Box>
    );
};

export default ViewAllSchedules;