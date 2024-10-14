import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import Header1 from './../../components/Layout/Header1';

const GradientBackground = styled(Box)({
  height: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const CustomButton = styled(Button)(({ theme }) => ({
  padding: '15px 30px',
  fontSize: '18px',
  borderRadius: '30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
  },
}));

const Card = styled(Paper)({
  padding: '40px',
  backgroundColor: '#fff',
  borderRadius: '20px',
  textAlign: 'center',
  maxWidth: '400px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
});

const RegisterOption = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handler for User Registration click
  const handleUserRegistration = () => {
    navigate('/registeruser'); // Navigate to User Registration page
  };

  // Handler for Waste Collector Registration click
  const handleCollectorRegistration = () => {
    navigate('/registerCollector'); // Navigate to Waste Collector Registration page
  };

  return (
    <Box>
    <Header1 />
    <GradientBackground>
      <Card>
        <Typography variant="h4" gutterBottom sx={{ color: '#333', marginBottom: '30px' }}>
          Choose Registration Type
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CustomButton 
            variant="contained" 
            color="primary" 
            onClick={handleUserRegistration}
            sx={{ backgroundColor: '#1e88e5' }}
          >
            Register as User
          </CustomButton>

          <CustomButton 
            variant="contained" 
            color="secondary" 
            onClick={handleCollectorRegistration}
            sx={{ backgroundColor: '#43a047' }}
          >
            Register as Waste Collector
          </CustomButton>
        </Box>
      </Card>
    </GradientBackground>
    </Box>
  );
};

export default RegisterOption;
