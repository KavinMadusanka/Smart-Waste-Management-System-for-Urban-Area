import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const RejectForm = ({ request, onClose }) => {

   
  // State for reject description and status
  const [rejectDescription, setRejectDescription] = useState('');
  const [status, setStatus] = useState('Rejected'); // Default status as 'Rejected'
  const [errors, setErrors] = useState({}); // Add an errors state to handle form validation

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      requestId: request._id, // Must be a valid ObjectId
      status: status, // Status is set to 'Rejected'
      rejectDescription: rejectDescription, // Description provided by user
    };
  
    try {
      const response = await axios.post('/api/v1/replies/create-reply', payload);
      console.log('Response:', response.data); // Log the response to check
      toast.success('Request rejected successfully!');
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error rejecting request:', error?.response?.data || error.message);
      toast.error('There was an issue rejecting the request. Please try again.');
    }
  };
  

  return (
    <div style={styles.modalContent}>
      <h2 style={styles.header}>Reject Request for {request?.fullName}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Reject Description:
          <textarea
            value={rejectDescription}
            onChange={(e) => setRejectDescription(e.target.value)}
            required
            style={{ ...styles.input, height: '80px', resize: 'none' }} // Set specific height for textarea
          />
        </label>

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
          <button type="submit" style={styles.submitButton}>Reject</button>
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
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#ccc',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default RejectForm;
