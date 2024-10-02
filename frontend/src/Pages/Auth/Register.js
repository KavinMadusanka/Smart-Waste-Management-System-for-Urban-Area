import React, { useState } from 'react';
import { TextField, Button, MenuItem, Grid, Container, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Account types and waste bin types for dropdowns
const accountTypes = ['Resident', 'WasteCollector'];
const wasteBinTypes = ['General', 'Recyclable'];

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    accountType: 'Resident',
    wasteBinType: 'General'
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate form inputs
  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = 'First Name is required';
    if (!formData.lastName) tempErrors.lastName = 'Last Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.password) tempErrors.password = 'Password is required';
    if (!formData.contactNumber) tempErrors.contactNumber = 'Contact Number is required';
    if (!formData.address.street) tempErrors.street = 'Street is required';
    if (!formData.address.city) tempErrors.city = 'City is required';
    if (!formData.address.postalCode) tempErrors.postalCode = 'Postal Code is required';
    if (!formData.address.country) tempErrors.country = 'Country is required';
    return tempErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        // Make an API call to register the user
        const response = await axios.post('/api/v1/auth/register', formData);
        if (response.data.success) {
          toast.success('Registration successful!');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Registration failed. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <Container component={Paper} maxWidth="sm" sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Registration Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          {/* Contact Number */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
            />
          </Grid>

          {/* Address Fields */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              error={!!errors.street}
              helperText={errors.street}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              error={!!errors.postalCode}
              helperText={errors.postalCode}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
            />
          </Grid>

          {/* Account Type */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Account Type"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
            >
              {accountTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Waste Bin Type */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Waste Bin Type"
              name="wasteBinType"
              value={formData.wasteBinType}
              onChange={handleChange}
            >
              {wasteBinTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer />
    </Container>
  );
};

export default RegistrationForm;
