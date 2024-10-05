import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminMenu from '../../components/Layout/AdminMenu';
import { styled } from '@mui/material/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/api/v1/collectionSchedule/get-schedules');
                setSchedules(response.data);
                setFilteredSchedules(response.data); // Initialize filtered schedules
            } catch (error) {
                console.error("Error fetching schedules", error);
                toast.error('Error fetching schedules. Please try again.');
            }
        };

        fetchSchedules();
    }, []);

    // Function to handle filtering
    const handleSearch = () => {
        const filtered = schedules.filter(schedule => {
            const isAreaMatch = schedule.area.toLowerCase().includes(searchTerm.toLowerCase());
            const isDateMatch = selectedDate ? new Date(schedule.pickupDate).toLocaleDateString() === selectedDate.toLocaleDateString() : true;
            return isAreaMatch && isDateMatch;
        });
        setFilteredSchedules(filtered);
    };

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

                {/* Search and Filter UI */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <TextField
                        label="Search by Area"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mr: 2, flexGrow: 1, '& .MuiOutlinedInput-root': { height: '50px', borderRadius: '8px' } }} // Adjust height and corners
                    />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => (
                    <TextField
                        {...params}
                        sx={{ '& .MuiOutlinedInput-root': { height: '30px', borderRadius: '6px' } }} // Adjust height and corners
                    />
                    )}
                    />
                </LocalizationProvider>
                <Button
                    variant="contained"
                    color="success" // Use 'success' for green color
                    onClick={handleSearch}
                    sx={{
                        ml: 2,
                        height: '50px', // Set height to match the text fields
                        borderRadius: '8px', // Rounded corners
                        '&:hover': { backgroundColor: '#388e3c' } // Darker green on hover
                    }}
                >
                    Search
                </Button>
            </Box>

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
                            {filteredSchedules.map((schedule) => (
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
