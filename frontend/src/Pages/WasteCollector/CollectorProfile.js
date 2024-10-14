import React from 'react';
import CollectorHeader from '../../components/Layout/CollectorHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/system';
import { Person, Email, Phone, Home } from '@mui/icons-material';
import { useAuth } from '../../context/auth';

// Styled components
const StyledCard = styled(Card)({
  margin: '16px',
  borderRadius: '10px',
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
});

const ProfileAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
  margin: '20px auto',
  backgroundColor: 'green', // Directly define color
});

const IconContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

const CollectorProfile = () => {
  const [auth] = useAuth();
  const wasteCollector = auth?.wasteCollector || {};

  return (
    <Box>
      <CollectorHeader />
      <Box sx={{ p: 3, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Collector Profile
        </Typography>

        <ProfileAvatar>
          {wasteCollector.firstName?.charAt(0)}
          {wasteCollector.lastName?.charAt(0)}
        </ProfileAvatar>

        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} justifyContent="center">
          <StyledCard sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <IconContainer>
                <Person fontSize="small" color="green" />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {wasteCollector.firstName} {wasteCollector.lastName}
                </Typography>
              </IconContainer>
              <IconContainer>
                <Email fontSize="small" color="green" />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {wasteCollector.email}
                </Typography>
              </IconContainer>
              <IconContainer>
                <Phone fontSize="small" color="green" />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {wasteCollector.contactNumber}
                </Typography>
              </IconContainer>
            </CardContent>
          </StyledCard>

          <StyledCard sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <IconContainer>
                <Home fontSize="small" color="green" />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {wasteCollector.address?.street}
                </Typography>
              </IconContainer>
              <Typography variant="body1">
                City: {wasteCollector.address?.city}
              </Typography>
              <Typography variant="body1">
                Postal Code: {wasteCollector.address?.postalCode}
              </Typography>
              <Typography variant="body1">
                Country: {wasteCollector.address?.country}
              </Typography>
            </CardContent>
          </StyledCard>
        </Stack>
      </Box>
    </Box>
  );
};

export default CollectorProfile;
