import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, TextField } from '@mui/material';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { format, addDays, startOfToday } from 'date-fns';
import Header1 from '../../components/Layout/Header1';
import Footer from './../../components/Layout/Footer';

// Styled component for Day Button
const DayButton = styled(Button)(({ selected, disabled }) => ({
    backgroundColor: selected ? '#4CAF50' : '#fff',
    color: disabled ? '#d3d3d3' : selected ? '#fff' : '#000',
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
    pointerEvents: disabled ? 'none' : 'auto',  // Disable pointer events if the day is disabled
}));

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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const today = startOfToday();  // Get the current day (startOfToday)
        const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));  // Generate future days starting from today
        setWeekDays(days);

        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
                filterSchedules(response.data, today);
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    const filterSchedules = (schedulesList, selectedDate) => {
        const filtered = schedulesList.filter(schedule => {
            return format(new Date(schedule.pickupDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        });
        setFilteredSchedules(filtered);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        filterSchedules(schedules, day);
    };

    const handleSearch = () => {
        const today = startOfToday();  // Get today's date
        const filtered = schedules
            .filter(schedule => new Date(schedule.pickupDate) >= today)  // Exclude past schedules
            .filter(schedule => 
                schedule.area.toLowerCase().includes(searchQuery.toLowerCase())
            );
        
        setFilteredSchedules(filtered);
    };
    

    const handleViewAllClick = () => {
        const today = startOfToday();  // Get today's date
        const futureSchedules = schedules.filter(schedule => 
            new Date(schedule.pickupDate) >= today  // Only include future or current schedules
        );
        setFilteredSchedules(futureSchedules);  // Set filteredSchedules to future schedules
    };
    

    return (
        <Box>
            <Header1/>
            <Container maxWidth="lg" sx={{ p: 4, mt: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    All Pickups
                </Typography>

                {/* Week Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {weekDays.map((day, index) => (
                            <Box key={index} sx={{ mx: 1, textAlign: 'center' }}>
                                <DayButton
                                    selected={format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')}
                                    disabled={day < startOfToday()}  // Disable past days
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

                {/* Search and View All Schedules */}
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <TextField
                        label="Search by Area"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ width: '350px', height: '15px', borderRadius: '8px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                    <Button variant="outlined" onClick={handleSearch} sx={{ ml: 2 }}>
                        Search
                    </Button>
                    <Button variant="outlined" onClick={handleViewAllClick} sx={{ ml: 2 }}>
                        View All Schedules
                    </Button>
                </Box>

                <br/>
                {/* Schedule Cards */}
                <Box container spacing={2}>
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map(schedule => (
                            <Box item xs={12} key={schedule._id}>
                                <ScheduleCard>
                                    <Typography variant="h6">{schedule.area}</Typography>
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
                            No schedules available for this date.
                        </Typography>
                    )}
                </Box>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
            <br/><br/>
            <Footer />
        </Box>
    );
};

export default ViewAllSchedules;