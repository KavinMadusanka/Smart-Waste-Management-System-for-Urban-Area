import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Select, MenuItem, Stepper, Step, StepLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Header1 from '../../components/Layout/Header1'; // Import Header1
import { styled } from '@mui/system'; // For custom styles
import Footer from './../../components/Layout/Footer';

const UserRequests = () => {
    const navigate = useNavigate();
    const [auth] = useAuth();
    const [email, setEmail] = useState('');
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Category mapping
    const categoryMap = {
        '6703683d861e7062afdd0af4': 'Household Waste',
        '670368d0861e7062afdd0afe': 'Electronics (E-waste)',
        '6703698d861e7062afdd0b09': 'Appliances',
        '67036a15861e7062afdd0b23': 'Construction and Demolition Waste',
        '67036a9e861e7062afdd0b3a': 'Vehicles and Parts',
        '67036afe861e7062afdd0b56': 'Textiles and Clothing',
    };

    const statusMap = {
        one: 0,    // Sent request
        two: 1,    // Collected
        three: 2,  // Received payment
        four: 3    // Completed
    };

    const steps = ['Sent Request', 'Collected', 'Received Payment', 'Completed'];

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get(`/api/v1/bulkRequestForm/get-brequestform/${auth?.user?.email}`);
            if (data.success && data.bRequestForms) {
                setRequests(data.bRequestForms);
                setFilteredRequests(data.bRequestForms);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        if (auth && auth.user) {
            setEmail(auth.user.email);
        }
    }, [auth]);

    useEffect(() => {
        if (email) {
            fetchRequests();
        }
    }, [email]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterRequests(query, selectedCategory);
    };

    const handleFilter = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        filterRequests(searchQuery, category);
    };

    const filterRequests = (query, category) => {
        let filtered = requests;
        if (category) {
            filtered = filtered.filter(req => req.category === category);
        }
        if (query) {
            filtered = filtered.filter(req => req.name.toLowerCase().includes(query));
        }
        setFilteredRequests(filtered);
    };

    const handleRequestClick = (request) => {
        setSelectedRequest(request);
        setModalOpen(true);
    };

    const handleModalClose = () => setModalOpen(false);

    const handleUpdateClick = (requestId) => {
        navigate(`/updatebRequest/${requestId}`, { state: { request: selectedRequest } });
    };

    const handleDeleteClick = async (requestId) => {
        const confirmed = window.confirm('Are you sure you want to delete this request?');
        if (confirmed) {
            try {
                await axios.delete(`/api/v1/bulkRequestForm/delete-brequestform/${requestId}`);
                // Refresh the request list after deletion
                fetchRequests();
            } catch (error) {
                console.error('Error deleting request:', error);
            }
        }
    };

    // Custom styles for the Stepper
    const CustomStepper = styled(Stepper)({
        '& .MuiStepLabel-label': {
            color: '#BDBDBD', // Inactive label color
            fontSize: '14px',
            '&.Mui-active': {
                color: '#1A4D2E', // Active label color (green)
                fontWeight: 600,
            },
            '&.Mui-completed': {
                color: '#6A9C89', // Completed step label color (lighter green)
                fontWeight: 600,
            },
        },
        '& .MuiStepIcon-root': {
            color: '#BDBDBD', // Default step icon color (inactive)
            '&.Mui-active': {
                color: '#1A4D2E', // Active step icon color (green)
            },
            '&.Mui-completed': {
                color: '#6A9C89', // Completed step icon color (lighter green)
            },
        },
        '& .MuiStepConnector-line': {
            borderColor: '#BDBDBD', // Default connector color (inactive)
            '&.Mui-active': {
                borderColor: '#1A4D2E', // Active connector color (green)
            },
            '&.Mui-completed': {
                borderColor: '#6A9C89', // Completed connector color (lighter green)
            },
        },
    });

    return (
        <div>
            <Header1 /> {/* Include Header1 here */}
            <div style={{ backgroundColor: '#F3F4F6', padding: '30px', width: '100%', margin: '0' }}>
                <h1 style={{ textAlign: 'center', color: '#1A4D2E', fontWeight: 600, marginBottom: '40px' }}>
                    My Bulk Waste Disposal Requests
                </h1>

                <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
                    <Button variant="contained" style={{ backgroundColor: '#1A4D2E' }} onClick={() => navigate('/brequestform')} sx={{ mr: 2 }}>
                        To Request Form
                    </Button>
                    <Button variant="contained" style={{ backgroundColor: '#1A4D2E' }} onClick={() => navigate('/bcategories')}>
                        Categories
                    </Button>
                </Box>

                <Box display="flex" mb={3}>
                    <TextField
                        label="Search by Name"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        sx={{ mr: 2, flexGrow: 1 }}
                    />
                    <Select
                        value={selectedCategory}
                        onChange={handleFilter}
                        displayEmpty
                        sx={{ width: '200px' }}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {Object.entries(categoryMap).map(([id, name]) => (
                            <MenuItem key={id} value={id}>{name}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: 2,
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                                onClick={() => handleRequestClick(request)}
                            >
                                <Typography variant="h6" sx={{ color: '#1A4D2E', fontWeight: 500 }}>{request.name}</Typography>
                                <Typography sx={{ color: '#333' }}>{request.address}</Typography>
                                <Typography sx={{ color: '#333' }}>{categoryMap[request.category] || request.category}</Typography> {/* Display Category Name */}
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: '#1A4D2E', color: '#FFFFFF' }} // Update button with green fill
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the card click event
                                            handleUpdateClick(request._id);
                                        }}
                                        sx={{ mr: 2 }} // Add margin-right to create space between the buttons
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: '#FF0000', color: '#FFFFFF' }} // Delete button with red fill
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the card click event
                                            handleDeleteClick(request._id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography>No requests found.</Typography>
                    )}
                </Box>

                <Modal open={modalOpen} onClose={handleModalClose}>
                    <Box
                        sx={{
                            width: '500px',
                            backgroundColor: '#FFFFFF',
                            margin: '100px auto',
                            padding: '30px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            borderRadius: '15px',
                        }}
                    >
                        {selectedRequest && (
                            <>
                                <Typography variant="h6" align="center" sx={{ color: '#1A4D2E', fontWeight: 600, marginBottom: '20px' }}>
                                    Request Details
                                </Typography>

                                <Typography sx={{ color: '#333', marginBottom: '10px' }}>
                                    <strong>Name:</strong> {selectedRequest.name}
                                </Typography>
                                <Typography sx={{ color: '#333', marginBottom: '10px' }}>
                                    <strong>Address:</strong> {selectedRequest.address}
                                </Typography>
                                <Typography sx={{ color: '#333', marginBottom: '20px' }}>
                                    <strong>Category:</strong> {categoryMap[selectedRequest.category] || selectedRequest.category}
                                </Typography>

                                {/* Stepper for status tracking */}
                                <Box sx={{ mt: 4 }}>
                                    <CustomStepper activeStep={statusMap[selectedRequest.status]} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </CustomStepper>
                                </Box>

                                {/* Check if the status is 'three' to show payment confirmation */}
                                {selectedRequest.status === 'three' && (
                                    <>
                                        <Typography sx={{ color: '#FF0000', fontWeight: 600, marginTop: '20px' }}>
                                            Have you received the payment for this request?
                                        </Typography>
                                        <Typography sx={{ color: '#333', marginBottom: '20px' }}>
                                            Please confirm only if you have received the payment.
                                            <br></br>
                                            <strong>Payment Value:</strong> {/* Add pvalue display here */}
                                            Rs.{selectedRequest.pvalue}.00
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            style={{ backgroundColor: '#1A4D2E', color: '#FFFFFF' }} // Confirm button with green fill
                                            onClick={async () => {
                                                try {
                                                    await axios.patch(
                                                        `/api/v1/bulkRequestForm/update-final-tatus-brequestform/${selectedRequest._id}`,
                                                        { status: 'four' }
                                                    );
                                                    fetchRequests(); // Refresh the requests after updating the status
                                                    handleModalClose(); // Close the modal
                                                } catch (error) {
                                                    console.error('Error updating status:', error);
                                                }
                                            }}
                                        >
                                            Confirm Payment Received
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Modal>
            </div>
            <Footer/>
        </div>
    );
};

export default UserRequests;
