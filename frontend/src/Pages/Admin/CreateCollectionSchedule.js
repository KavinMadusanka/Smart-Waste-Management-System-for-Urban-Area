import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Paper, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Adapter for Day.js
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // LocalizationProvider for DatePicker
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import AdminMenu from './../../components/Layout/AdminMenu';
import dayjs from 'dayjs'; // For date formatting

const CreateCollectionSchedule = () => {
    const [formData, setFormData] = useState({
        area: '',
        pickupDate: null, // Initialize with current date using dayjs
        pickupTime: '',
        binType: 'General',
        assignedCollectorId: ''
    });

    const [collectors, setCollectors] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch the list of waste collectors
        const fetchCollectors = async () => {
            try {
                const response = await axios.get(`/api/v1/auth/get-all-collectors`); // Adjust based on your backend route
                setCollectors(response.data);
            } catch (error) {
                console.error("Error fetching collectors", error);
                toast.error('Error fetching collectors. Please try again.'); // Show error toast
            }
        };

        fetchCollectors();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle date changes for the DatePicker
    const handleDateChange = (newDate) => {
        setFormData({ ...formData, pickupDate: newDate });
    };

    // Validate form inputs
    const validate = () => {
        let hasError = false; // Track if any error occurs

        if (!formData.area) {
            toast.error('Area is required'); // Show toast for this error
            hasError = true;
        }
        if (!formData.pickupDate) {
            toast.error('Pickup date is required'); // Show toast for this error
            hasError = true;
        }
        if (!formData.pickupTime) {
            toast.error('Pickup time is required'); // Show toast for this error
            hasError = true;
        }
        if (!formData.assignedCollectorId) {
            toast.error('Assigned collector is required'); // Show toast for this error
            hasError = true;
        }

        return { hasError };
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { hasError } = validate();

        if (hasError) {
            return; // Stop submission if there are errors
        } else {
            try {
                const response = await axios.post('/api/v1/collectionSchedule/create-schedule', {
                    ...formData,
                    pickupDate: formData.pickupDate.format('YYYY-MM-DD'), // Send formatted date
                });
                if (response.data.success) {
                    toast.success('Schedule created successfully!'); // Show success toast
                    // Clear form after successful submission
                    setFormData({
                        area: '',
                        pickupDate: dayjs(), // Reset to current date
                        pickupTime: '',
                        binType: 'General',
                        assignedCollectorId: ''
                    });
                }
            } catch (error) {
                toast.error('Error creating schedule. Please try again.'); // Show error toast
                console.error("Error:", error);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <AdminMenu />
            <Container component={Paper} maxWidth="sm" sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Create Waste Collection Schedule
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            fullWidth
                            label="Area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            error={!!errors.area}
                            helperText={errors.area}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Pickup Date"
                                value={formData.pickupDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>

                        <TextField
                            fullWidth
                            select // Adding this to make the TextField act as a Select dropdown
                            label="Pickup Time"
                            name="pickupTime"
                            value={formData.pickupTime}
                            onChange={handleChange}
                            error={!!errors.pickupTime}
                            helperText={errors.pickupTime}
                        >
                            <MenuItem value="08:00 AM-10:00 AM">08:00 AM-10:00 AM</MenuItem>
                            <MenuItem value="10:00 AM-12:00 PM">11:00 AM-12:00 PM</MenuItem>
                            <MenuItem value="12:00 PM-3:00 PM">1:00 PM-3:00 PM</MenuItem>
                            <MenuItem value="02:00 PM-6:00 PM">04:00 PM-6:00 PM</MenuItem>
                        </TextField>


                        <TextField
                            fullWidth
                            select
                            label="Bin Type"
                            name="binType"
                            value={formData.binType}
                            onChange={handleChange}
                        >
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="Recyclable">Recyclable</MenuItem>
                            <MenuItem value="Bulk">Bulk</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            select
                            label="Assigned Collector"
                            name="assignedCollectorId"
                            value={formData.assignedCollectorId}
                            onChange={handleChange}
                            error={!!errors.assignedCollectorId}
                            helperText={errors.assignedCollectorId}
                        >
                            {collectors.map((collector) => (
                                <MenuItem key={collector._id} value={collector._id}>
                                    {collector.firstName} {collector.lastName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: '#4CAF50', color: '#fff' }} // Green button style
                        >
                            Send Schedule
                        </Button>
                    </Box>
                </form>

                {/* Toast Notification Container */}
                <ToastContainer />
            </Container>
        </Box>
    );
};

export default CreateCollectionSchedule;