import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import Header1 from '../../components/Layout/Header1';
import { useAuth } from '../../context/auth';
import Footer from '../../components/Layout/Footer';

const CollectionHistory = () => {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [auth] = useAuth();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
                filterSchedules(response.data);
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    const filterSchedules = (schedulesList) => {
        const userCity = auth?.user?.address?.city?.toLowerCase();

        const filtered = schedulesList.filter(schedule => {
            const scheduleDate = new Date(schedule.pickupDate);
            return (
                schedule.area.toLowerCase() === userCity &&
                schedule.status.toLowerCase() === 'completed' &&
                scheduleDate < new Date() // Ensure the schedule date is in the past
            );
        });

        setFilteredSchedules(filtered);
    };

    return (
        <Box>
            <Header1 />
            <Container maxWidth="lg" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Collection Pickup History
                </Typography><br/>

                {/* Table for Schedule Records */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Time</TableCell>
                                <TableCell sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Bin Type</TableCell>
                                <TableCell sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map(schedule => (
                                    <TableRow key={schedule._id}>
                                        <TableCell>{format(new Date(schedule.pickupDate), 'dd MMM yyyy')}</TableCell>
                                        <TableCell>{schedule.pickupTime}</TableCell>
                                        <TableCell>{schedule.binType}</TableCell>
                                        <TableCell>{schedule.status.toLowerCase() === 'completed' ? 'Collected' : schedule.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                                            No completed pickup schedules available.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <Footer />
        </Box>
    );
};

export default CollectionHistory;