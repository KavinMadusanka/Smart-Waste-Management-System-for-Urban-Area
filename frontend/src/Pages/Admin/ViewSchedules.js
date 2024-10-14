import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, IconButton, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Header1 from '../../components/Layout/Header1';

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

const ViewSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date()); // Current day
    const [weekDays, setWeekDays] = useState([]);
    const [startDay, setStartDay] = useState(startOfWeek(new Date(), { weekStartsOn: 0 })); // Current week's start day
    const [searchQuery, setSearchQuery] = useState(''); // Search query
    const [viewAll, setViewAll] = useState(false); // View all schedules or not
    const navigate = useNavigate();

    useEffect(() => {
        // Calculate days of the week based on startDay
        const days = Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
        setWeekDays(days);

        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
                filterSchedules(response.data, selectedDay, searchQuery);
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, [startDay, selectedDay, searchQuery]);

    const filterSchedules = (schedulesList, selectedDate, searchQuery) => {
        const filtered = schedulesList.filter(schedule => {
            const matchesDate = viewAll || (selectedDate && format(new Date(schedule.pickupDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));
            const matchesSearch = schedule.area.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDate && matchesSearch;
        });
        setFilteredSchedules(filtered);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setViewAll(false); // Switch to date-based view
        filterSchedules(schedules, day, searchQuery);
    };

    const handleRowClick = (id) => {
        navigate(`/schedule-management/update-schedule/${id}`);
    };

    const handlePreviousWeek = () => {
        const newStartDay = subDays(startDay, 7); // Move back one week
        setStartDay(newStartDay);
    };

    const handleNextWeek = () => {
        const newStartDay = addDays(startDay, 7); // Move forward one week
        setStartDay(newStartDay);
    };

    const handleViewAllClick = () => {
        setViewAll(true); // Enable view all mode
        setSearchQuery(''); // Clear search query when viewing all
        setSelectedDay(null); // Clear selected day
        filterSchedules(schedules, null, ''); // Filter schedules to show all
    };

    const handleBackToDateViewClick = () => {
        setViewAll(false); // Switch back to date-based view
        setSelectedDay(new Date()); // Set the selected day to the current day
        filterSchedules(schedules, new Date(), searchQuery); // Filter based on the current day
    };

    return (
        <Box>
            <Header1/>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Container maxWidth="lg" sx={{ p: 4, mt: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    All Pickups
                </Typography>

                {/* Search Field */}
                {!viewAll && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Button variant="outlined" onClick={handleViewAllClick}>
                            View All Schedules
                        </Button>
                    </Box>
                )}

                {viewAll && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <TextField
                            label="Search by Area"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ width: '500px' ,
                                height: '20px', // Set the height
                            }}
                        />
                        <Button variant="outlined" onClick={handleBackToDateViewClick} sx={{ ml: 2 }}>
                            Back to Date View
                        </Button>
                    </Box>
                )}

                <br/>
                {/* Week Navigation */}
                {!viewAll && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                        <IconButton onClick={handlePreviousWeek}>
                            <ArrowBackIosIcon />
                        </IconButton>

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

                        <IconButton onClick={handleNextWeek}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Schedule Cards */}
                <Box container spacing={2}>
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map(schedule => (
                            <Box item xs={12} key={schedule._id}>
                                <ScheduleCard onClick={() => handleRowClick(schedule._id)}>
                                    <Typography variant="h6">{schedule.area}</Typography>
                                    <Typography>Pickup Time: {schedule.pickupTime}</Typography>
                                    <Typography>Bin Type: {schedule.binType}</Typography>
                                    <Typography>
                                        Collector: {schedule.assignedCollector ? `${schedule.assignedCollector.firstName} ${schedule.assignedCollector.lastName}` : 'N/A'}
                                    </Typography>
                                    <Typography>Status: {schedule.status}</Typography>
                                </ScheduleCard>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                            No schedules available for this date.
                        </Typography>
                    )}
                </Box>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
        </Box>
    </Box>
    );
};

export default ViewSchedules;
