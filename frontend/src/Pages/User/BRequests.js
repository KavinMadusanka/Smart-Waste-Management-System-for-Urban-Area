import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

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

    return (
        <div style={{ backgroundColor: '#F3F4F6', padding: '30px', width: '100%', margin: '0' }}>
            <h1 style={{ textAlign: 'center', color: '#1A4D2E', fontWeight: 600, marginBottom: '40px' }}>
                Your Previous Requests
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
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the card click event
                                        handleUpdateClick(request._id);
                                    }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
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
                    <Typography>No requests found</Typography>
                )}
            </Box>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {selectedRequest && (
                        <>
                            <Typography id="modal-title" variant="h6" component="h2" sx={{ color: '#1A4D2E', fontWeight: 600 }}>
                                {selectedRequest.name}
                            </Typography>
                            <Typography id="modal-description" sx={{ mt: 2 }}>
                                Category: {categoryMap[selectedRequest.category] || selectedRequest.category}
                            </Typography>
                            <Typography>Phone No: {selectedRequest.phoneNo}</Typography>
                            <Typography>Email: {selectedRequest.emailAddress}</Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default UserRequests;
