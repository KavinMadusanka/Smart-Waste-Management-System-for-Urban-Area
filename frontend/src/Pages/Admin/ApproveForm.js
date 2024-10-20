import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, MenuItem } from '@mui/material'; // Import TextField and MenuItem
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const ApproveForm = ({ request, onClose }) => {
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: '',
    estimateDuration: '',
    repairDescription: '',
    assignedTechnician: '',
  });
  const [technicians, setTechnicians] = useState([]); // State to hold technicians
  const [status, setStatus] = useState('Approved'); // State for status
  const [errors, setErrors] = useState({}); // Add an errors state to handle form validation

  // Fetch technicians when the component mounts
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/get-all-collectors`);
        console.log('Full Response:', response.data); // Log the response to confirm structure
        setTechnicians(response.data.wasteCollector || []); // Set the state using the correct array
      } catch (error) {
        console.error('Error fetching technicians:', error);
        toast.error('Error fetching technicians. Please try again.');
      }
    };

    fetchTechnicians();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      requestId: request._id, // Must be a valid ObjectId
      status: status, // Use the status state here
      scheduledDate: scheduleData.scheduledDate, // Should be a valid date
      estimateDuration: scheduleData.estimateDuration,
      repairDescription: scheduleData.repairDescription,
      assignedTechnician: scheduleData.assignedTechnician, // Should be a string
    };

    try {
      const response = await axios.post('/api/v1/replies/create-reply', payload);
      console.log('Response:', response.data); // Log the response to check
      toast.success('Request approved successfully!');
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error approving request:', error.response?.data || error.message);
      toast.error('There was an issue approving the request. Please try again.');
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={styles.modalContent}>
      <h2 style={styles.header}>Approve Request for {request?.fullName}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Scheduled Date:
          <input
            type="date"
            value={scheduleData.scheduledDate}
            onChange={(e) => setScheduleData({ ...scheduleData, scheduledDate: e.target.value })}
            required
            min={today} // Prevent selection of previous dates
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Estimated Duration:
          <input
            type="text"
            value={scheduleData.estimateDuration}
            onChange={(e) => setScheduleData({ ...scheduleData, estimateDuration: e.target.value })}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Repair Description:
          <textarea
            value={scheduleData.repairDescription}
            onChange={(e) => setScheduleData({ ...scheduleData, repairDescription: e.target.value })}
            required
            style={{ ...styles.input, height: '80px', resize: 'none' }} // Set specific height for textarea
          />
        </label>

        <TextField
          fullWidth
          select
          label="Assigned Technician"
          name="assignedTechnician"
          value={scheduleData.assignedTechnician}
          onChange={(e) => setScheduleData({ ...scheduleData, assignedTechnician: e.target.value })}
          error={!!errors.assignedTechnician}
          helperText={errors.assignedTechnician}
        >
          {technicians.length > 0 ? (
            technicians.map((tech) => (
              <MenuItem key={tech._id} value={tech._id}>
                {tech.firstName} {tech.lastName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No technicians available</MenuItem>
          )}
        </TextField>

        {/* Add a Status field */}
        <label style={styles.label}>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
            required
          >
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton}>Approve</button>
          <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    marginBottom: '20px',
    fontSize: '1.5em',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    marginTop: '5px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ApproveForm;
