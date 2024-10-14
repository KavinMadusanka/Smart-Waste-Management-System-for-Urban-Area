import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import Header1 from '../../components/Layout/Header1';
import recyclingImage from '../../assets/recycling.jpeg';
import { Typography } from '@mui/material';

const ScheduleManagement = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div>
      <Header1 />
      <div style={styles.container}>
        <div style={styles.leftContainer}>
          <img src={recyclingImage} alt="Recycling" style={styles.image} />
        </div>

        <div style={styles.rightContainer}>
          <Typography variant="h4" align="center" gutterBottom>
            Waste Collection Pickups
          </Typography>

          {/* Button for All Pickups */}
          <button style={styles.button} onClick={() => navigate('/schedule-management/view-schedules')}>
            All Pickups
          </button>

          {/* Button for Schedule Pickups */}
          <button style={styles.button} onClick={() => navigate('/schedule-management/create-schedule')}>
            Schedule Pickups
          </button>

          {/* Button for Edit Pickups */}
          <button style={styles.button} onClick={() => navigate('/schedule-management/view-schedules')}>
            Edit Pickups
          </button>

          {/* Button for Calendar View */}
          <button style={styles.button} onClick={() => navigate('/schedule-management/schedule-calender-view')}>
            Collection Calendar View
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '90vh',
    backgroundColor: '#ffffff',
  },
  leftContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  rightContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  button: {
    width: '80%',
    padding: '15px',
    backgroundColor: '#07a338', // Green color
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2rem',
    margin: '10px 0',
    cursor: 'pointer',
  },
  image: {
    maxWidth: '100%', // Responsive image
    height: 'auto',
    borderRadius: '8px', // Optional: To add some styling
  },
};

export default ScheduleManagement;