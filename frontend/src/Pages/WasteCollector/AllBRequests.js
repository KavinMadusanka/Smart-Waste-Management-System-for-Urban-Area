import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import CollectorHeader from '../../components/Layout/CollectorHeader';

const AllBRequests = () => {
    const navigate = useNavigate();
    const [auth] = useAuth();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [pvalues, setPvalues] = useState({}); // Use an object to hold pvalue for each request

    // Category mapping
    const categoryMap = {
        '6703683d861e7062afdd0af4': 'Household Waste',
        '670368d0861e7062afdd0afe': 'Electronics (E-waste)',
        '6703698d861e7062afdd0b09': 'Appliances',
        '67036a15861e7062afdd0b23': 'Construction and Demolition Waste',
        '67036a9e861e7062afdd0b3a': 'Vehicles and Parts',
        '67036afe861e7062afdd0b56': 'Textiles and Clothing',
    };

    // Fetch all requests
    const fetchRequests = async () => {
        try {
            const { data } = await axios.get(`/api/v1/bulkRequestForm/get-brequestform`);
            if (data.success && data.bRequestForms) {
                setRequests(data.bRequestForms);
                setFilteredRequests(data.bRequestForms);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests(); // Fetch all requests on component load
    }, []);

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

    // Handle Collected button
    const handleCollectedClick = async (requestId) => {
        const confirmed = window.confirm('Are you sure this request has been collected?');
        if (confirmed) {
            try {
                await axios.patch(`/api/v1/bulkRequestForm/update-status-brequestform/${requestId}`);
                fetchRequests(); // Refresh the request list after updating
            } catch (error) {
                console.error('Error updating request status:', error);
            }
        }
    };

    // Handle Confirm Cash Payment
    const handleConfirmPayment = async (requestId) => {
        const paymentValue = pvalues[requestId]; // Get the specific payment value for this request
        if (isNaN(paymentValue) || paymentValue <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        const confirmed = window.confirm(`Confirm payment of ${paymentValue}?`);
        if (confirmed) {
            try {
                console.log('Payment confirmed for request:', requestId); // Log confirmation
                await axios.put(`/api/v1/bulkRequestForm/update-pvalue-status-points/${requestId}`,{ pvalue: paymentValue });
                console.log('Payment confirmed for request:', requestId); // Log confirmation
                setPvalues(prev => ({ ...prev, [requestId]: '' })); // Reset the specific pvalue after confirming payment
                fetchRequests(); // Refresh the request list after updating
            } catch (error) {
                console.error('Error confirming payment:', error.response ? error.response.data : error);
                alert("Payment confirmation failed. Please try again.");
            }
        }
    };

    return (
        <div>
            <CollectorHeader />
            <div style={{ backgroundColor: '#F3F4F6', padding: '30px', width: '100%', margin: '0' }}>
                <h1 style={{ textAlign: 'center', color: '#1A4D2E', fontWeight: 600, marginBottom: '40px' }}>
                    Bulk Waste Disposal Requests
                </h1>

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
                            >
                                <Typography variant="h6" sx={{ color: '#1A4D2E', fontWeight: 500 }}>
                                    {request.name}
                                </Typography>
                                <Typography sx={{ color: '#333' }}>Category: {categoryMap[request.category] || request.category}</Typography>
                                <Typography sx={{ color: '#333' }}>Phone No: {request.phoneNo}</Typography>
                                <Typography sx={{ color: '#333' }}>Email: {request.emailAddress}</Typography>
                                <Typography sx={{ color: '#333' }}>Address: {request.address}</Typography>
                                <Typography sx={{ color: '#333' }}>Details: {request.details}</Typography>

                                {request.status === 'f' && (
                                    <Box mt={2} display="flex" alignItems="center">
                                        <TextField
                                            label="Payment Amount"
                                            variant="outlined"
                                            value={pvalues[request._id] || ''}
                                            onChange={(e) => setPvalues(prev => ({ ...prev, [request._id]: e.target.value }))} // Update pvalue for this request
                                            sx={{
                                                mb: 2,
                                                mr: 2,
                                                height: '56px',
                                                '.MuiInputBase-root': { height: '56px' },
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor: '#1A4D2E',
                                                color: '#FFFFFF',
                                                height: '56px',
                                            }}
                                            onClick={() => handleConfirmPayment(request._id)}
                                        >
                                            Confirm Cash Payment
                                        </Button>
                                    </Box>
                                )}

                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor: request.status === "one" ? '#1A4D2E' : '#A0A0A0',
                                            color: '#FFFFFF',
                                        }}
                                        onClick={() => handleCollectedClick(request._id)}
                                        disabled={request.status !== "one"}
                                        sx={{ mr: 2 }}
                                    >
                                        Collected
                                    </Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography>No requests found</Typography>
                    )}
                </Box>

                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Request Details
                        </Typography>
                        <Typography id="modal-description" sx={{ mt: 2 }}>
                            {selectedRequest && (
                                <>
                                    <p><strong>Name:</strong> {selectedRequest.name}</p>
                                    <p><strong>Category:</strong> {categoryMap[selectedRequest.category] || selectedRequest.category}</p>
                                    <p><strong>Phone No:</strong> {selectedRequest.phoneNo}</p>
                                    <p><strong>Email:</strong> {selectedRequest.emailAddress}</p>
                                    <p><strong>Address:</strong> {selectedRequest.address}</p>
                                    <p><strong>Details:</strong> {selectedRequest.details}</p>
                                </>
                            )}
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default AllBRequests;
