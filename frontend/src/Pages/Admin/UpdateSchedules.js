import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Paper, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import AdminMenu from '../../components/Layout/AdminMenu';

const UpdatesSchedules = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        area: '',
        pickupDate: null, // Change to `null` to handle DatePicker's value correctly
        pickupTime: '',
        binType: 'General',
        assignedCollectorId: '',
        status: 'Scheduled' 
    });

    const [collectors, setCollectors] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCollectors = async () => {
            try {
                const response = await axios.get(`/api/v1/auth/get-all-collectors`); 
                setCollectors(response.data);
            } catch (error) {
                console.error("Error fetching collectors", error);
                toast.error('Error fetching collectors. Please try again.');
            }
        };

        fetchCollectors();
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`/api/v1/collectionSchedule/get-schedules/${id}`);
                const scheduleData = response.data;

                setFormData({
                    area: scheduleData.area,
                    pickupDate: new Date(scheduleData.pickupDate), 
                    pickupTime: scheduleData.pickupTime,
                    binType: scheduleData.binType,
                    assignedCollectorId: scheduleData.assignedCollector._id,
                    status: scheduleData.status 
                });
            } catch (error) {
                console.error("Error fetching schedule", error);
                toast.error('Error fetching schedule. Please try again.');
            }
        };

        fetchSchedule();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.area) tempErrors.area = 'Area is required';
        if (!formData.pickupDate) tempErrors.pickupDate = 'Pickup date is required';
        if (!formData.pickupTime) tempErrors.pickupTime = 'Pickup time is required';
        if (!formData.assignedCollectorId) tempErrors.assignedCollectorId = 'Assigned collector is required';
        return tempErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                const response = await axios.put(`/api/v1/collectionSchedule/update-schedule/${id}`, formData);
                if (response.data.success) {
                    toast.success('Schedule updated successfully!');
                    //navigate('/schedule-management/view-schedules'); 
                }
            } catch (error) {
                toast.error('Error updating schedule. Please try again.');
                console.error("Error:", error);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <AdminMenu />
            <Container component={Paper} maxWidth="sm" sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Edit Waste Collection Schedule
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

                        {/* Date Picker for Pickup Date */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Pickup Date"
                                value={formData.pickupDate}
                                onChange={(newValue) => {
                                    setFormData({ ...formData, pickupDate: newValue });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        error={!!errors.pickupDate}
                                        helperText={errors.pickupDate}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <TextField
                            fullWidth
                            label="Pickup Time"
                            name="pickupTime"
                            type="text"
                            value={formData.pickupTime}
                            onChange={handleChange}
                            error={!!errors.pickupTime}
                            helperText={errors.pickupTime}
                        />

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

                        <TextField
                            fullWidth
                            select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="Scheduled">Scheduled</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Missed">Missed</MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: '#4CAF50', color: '#fff' }}
                        >
                            Update Schedule
                        </Button>
                    </Box>
                </form>

                <ToastContainer />
            </Container>
        </Box>
    );
};

export default UpdatesSchedules;
