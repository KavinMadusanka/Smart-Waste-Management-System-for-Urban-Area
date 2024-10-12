import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './../../context/auth';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';

const CollectorSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [auth] = useAuth(); // Accessing auth context to get token and user info

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { data } = await axios.get(`/api/v1/collectionSchedule/collector-schedules`, {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Send token for authentication
          },
        });
        setSchedules(data); // Set schedules in state
        setLoading(false);
      } catch (err) {
        setError('Failed to load schedules. Please try again.');
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchSchedules(); // Only fetch schedules if token is available
    }
  }, [auth.token]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        My Assigned Schedules
      </Typography>
      {schedules.length === 0 ? (
        <Typography align="center">No schedules assigned yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {schedules.map((schedule) => (
            <Grid item xs={12} sm={6} key={schedule._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Area: {schedule.area}</Typography>
                  <Typography>Pickup Date: {new Date(schedule.pickupDate).toDateString()}</Typography>
                  <Typography>Pickup Time: {schedule.pickupTime}</Typography>
                  <Typography>Bin Type: {schedule.binType}</Typography>
                  <Typography>Status: {schedule.status}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CollectorSchedules;
