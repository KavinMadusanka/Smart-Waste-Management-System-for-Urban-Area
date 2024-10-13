import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApproveForm = ({ request, onClose }) => {
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: '',
    estimateDuration: '',
    repairDescription: '',
    assignedTechnician: '',
  });
  const [technicians, setTechnicians] = useState([]); // State to hold technicians

  // Fetch technicians when the component mounts
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/v1/auth/get-all-collectors');
        console.log('Technicians Response:', response.data);
        
        // Assuming the response data contains an array of technicians
        if (Array.isArray(response.data)) {
          setTechnicians(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setTechnicians([]); // Set to empty array if data is not in expected format
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchTechnicians();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      requestId: request._id,
      status: 'Approved',
      scheduledDate: scheduleData.scheduledDate,
      estimateDuration: scheduleData.estimateDuration,
      repairDescription: scheduleData.repairDescription,
      assignedTechnician: scheduleData.assignedTechnician,
    };

    try {
      await axios.post('/api/v1/replies/create-reply', payload);
      alert('Request approved successfully!');
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error approving request:', error);
      alert('There was an issue approving the request. Please try again.');
    }
  };

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
        <label style={styles.label}>
          Assigned Technician:
          <select
            value={scheduleData.assignedTechnician}
            onChange={(e) => setScheduleData({ ...scheduleData, assignedTechnician: e.target.value })}
            required
            style={styles.input}
          >
            <option value="" disabled>Select a technician</option>
            {technicians.length > 0 ? (
              technicians.map((tech) => (
                <option key={tech._id} value={tech._id}>
                  {tech.firstName} {tech.lastName}
                </option>
              ))
            ) : (
              <option disabled>No technicians available</option>
            )}
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
