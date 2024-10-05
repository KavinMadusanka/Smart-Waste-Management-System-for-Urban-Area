import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminMenu from '../../components/Layout/AdminMenu';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#4CAF50',
    fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#d0f0c0', // Change to a light green color
        cursor: 'pointer',
    },
}));

const ViewSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules'); // Adjust based on your backend route
                setSchedules(response.data);
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    const handleRowClick = (id) => {
        navigate(`/schedule-management/update-schedule/${id}`);
    };

    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <AdminMenu />
            <Container component={Paper} maxWidth="lg" sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    View Collection Schedules
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Area</StyledTableCell>
                                <StyledTableCell>Pickup Date</StyledTableCell>
                                <StyledTableCell>Pickup Time</StyledTableCell>
                                <StyledTableCell>Bin Type</StyledTableCell>
                                <StyledTableCell>Assigned Collector</StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schedules.map((schedule) => (
                                <StyledTableRow key={schedule._id} onClick={() => handleRowClick(schedule._id)}>
                                    <TableCell>{schedule.area}</TableCell>
                                    <TableCell>{new Date(schedule.pickupDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{schedule.pickupTime}</TableCell>
                                    <TableCell>{schedule.binType}</TableCell>
                                    <TableCell>
                                        {schedule.assignedCollector ? `${schedule.assignedCollector.firstName} ${schedule.assignedCollector.lastName}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>{schedule.status}</TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
        </Box>
    );
};

export default ViewSchedules;
