import React, { useState, useEffect } from 'react';
import { Container, Typography, Modal, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header1 from '../../components/Layout/Header1';

const localizer = momentLocalizer(moment);

const ViewSchedulesCalendar = () => {
    const [schedules, setSchedules] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [schedulesForDate, setSchedulesForDate] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    // Transform schedule data to the format required by react-big-calendar
    const events = schedules.map(schedule => ({
        id: schedule._id,
        title: `${schedule.area} - ${schedule.binType}`,
        start: parseISO(schedule.pickupDate),
        end: parseISO(schedule.pickupDate),
        allDay: true,
        status: schedule.status
    }));

    // Function to style events
    const eventStyleGetter = (event) => {
        const backgroundColor = 'green'; // Set the background color to green
        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style
        };
    };

    const handleSelectSlot = (slotInfo) => {
        const dateString = moment(slotInfo.start).format('YYYY-MM-DD');
        const filteredSchedules = schedules.filter(schedule => {
            const scheduleDate = moment(schedule.pickupDate).format('YYYY-MM-DD');
            return scheduleDate === dateString;
        });

        setSchedulesForDate(filteredSchedules);
        setSelectedDate(slotInfo.start);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedDate(null);
        setSchedulesForDate([]);
    };

    return (
        <Box>
            <Header1/>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Container sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Collection Schedules Calendar View
                </Typography>
                <div style={{ height: '600px' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500, margin: '50px' }}
                        views={['month']}
                        defaultView='month'
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={event => {
                            toast.info(`Status: ${event.status}`);
                        }}
                        eventPropGetter={eventStyleGetter} // Add this line to apply styles
                    />
                </div>

                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Schedules for {selectedDate && selectedDate.toLocaleDateString()}
                        </Typography>
                        <List>
                            {schedulesForDate.length > 0 ? (
                                schedulesForDate.map(schedule => (
                                    <ListItem key={schedule._id}>
                                        <ListItemText
                                            primary={`${schedule.area} - ${schedule.binType}`}
                                            secondary={`Pickup Time: ${schedule.pickupTime} | Status: ${schedule.status}`}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No schedules for this date." />
                                </ListItem>
                            )}
                        </List>
                        <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>Close</Button>
                    </Box>
                </Modal>

                <ToastContainer />
            </Container>
        </Box>
        </Box>
    );
};

export default ViewSchedulesCalendar;
