import React, { useEffect, useState } from 'react'; 
import Header1 from '../../components/Layout/Header1'; // Import Header1
import { Box, Select, MenuItem, Button, TextField } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const UpdateRequest = () => {
    const navigate = useNavigate();
    const { _id } = useParams(); // Get the request form ID from the URL
    const [categories, setCategories] = useState([]); // Default to an empty array
    const [name, setName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [address, setAddress] = useState("");
    const [details, setDetails] = useState("");
    const [category, setCategory] = useState("");
    const [email, setEmail] = useState("");
    const [auth, setAuth] = useAuth();

    // Fetch all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/bulkCategory/get-bulkCategory');
            if (data.success) {
                setCategories(data.bulkCategories || []);
            } else {
                toast.error(data.message || 'Failed to fetch categories');
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error('Error fetching categories');
        }
    };

    // Fetch the single request form data
    const getRequestForm = async () => {
        try {
            console.log("Fetching request form for ID:", _id); // Log the ID being fetched
            const { data } = await axios.get(`/api/v1/bulkRequestForm/get-single-brequestform/${_id}`);
            console.log("Response data:", data); // Log the full response data
            if (data.success) {
                const form = data.bRequestForms[0]; // Access the first item in the array
                if (form) {
                    setName(form.name);
                    setPhoneNo(form.phoneNo);
                    setEmailAddress(form.emailAddress);
                    setAddress(form.address);
                    setDetails(form.details);
                    setCategory(form.category);
                    setEmail(form.email);
                } else {
                    toast.error('Form data not found');
                }
            } else {
                toast.error(data.message || 'Failed to fetch the request form');
            }
        } catch (error) {
            console.error("Error fetching request form:", error.response?.data || error); // Log detailed error information
            toast.error(error.response?.data?.message || 'Error fetching request form'); // Show specific error message
        }
    };

    useEffect(() => {
        console.log("UpdateRequest component mounted");
        getAllCategory();
        getRequestForm(); // Fetch the request form when the component loads
    }, [_id]);

    useEffect(() => {
        if (auth && auth.user) {
            setEmail(auth.user.email);
        }
    }, [auth]);

    // Update request handler
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const BRequestData = new FormData();
            BRequestData.append("name", name);
            BRequestData.append("phoneNo", phoneNo);
            BRequestData.append("emailAddress", emailAddress);
            BRequestData.append("address", address);
            BRequestData.append("details", details);
            BRequestData.append("category", category);
            BRequestData.append("email", email);

            const { data } = await axios.put(`/api/v1/bulkRequestForm/update-brequestform/${_id}`, BRequestData);
            if (data?.success) {
                toast.success('Request Updated Successfully');
                navigate('/brequests');
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.error("Error updating request:", error); // Log the error for debugging
            toast.error('Error updating request');
        }
    };

    return (
        <div style={{ backgroundColor: '#F3F4F6' }}>
            <Header1 /> {/* Include Header1 here */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: '#F3F4F6', // Ensure the background color matches
            }}>
                <Box sx={{
                    p: 4,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <h1 style={{ color: '#1A4D2E', fontWeight: 600, marginBottom: '20px' }}>Update Bulk Waste Disposal Request Form</h1>
                    <Box sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        p: 3,
                        width: '100%',
                        maxWidth: '800px',
                    }}>
                        <Select
                            fullWidth
                            value={category || ''}
                            displayEmpty
                            onChange={(e) => setCategory(e.target.value)}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="" disabled>Select a Category</MenuItem>
                            {categories.length > 0 ? (
                                categories.map((c) => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No Categories Available</MenuItem>
                            )}
                        </Select>

                        <TextField
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="E-mail"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Details"
                            multiline
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdate}
                            sx={{
                                backgroundColor: '#1A4D2E',
                                '&:hover': {
                                    backgroundColor: '#57A773',
                                },
                            }}
                        >
                            Update Request
                        </Button>
                    </Box>
                </Box>
                <Toaster />
            </Box>
        </div>
    );
};

export default UpdateRequest;
