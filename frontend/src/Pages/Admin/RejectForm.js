import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const RejectForm = ({ request, onClose }) => {
  const [rejectDescription, setRejectDescription] = useState(''); // Update state variable name
  const [status, setStatus] = useState('Rejected'); // Set default status to "Rejected"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/replies/create-reply', {
        requestId: request._id,
        status: status, // Use the status state here
        rejectDescription: rejectDescription, // Update here to use rejectDescription
      });
      console.log('Reply created:', response.data);
      toast.success('Request rejected successfully!'); // Notify user of success
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error('There was an issue rejecting the request. Please try again.'); // Notify user of error
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        <h2 style={styles.heading}>Reject Request</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reject Description</label> {/* Updated label */}
            <textarea
              value={rejectDescription} // Update to use rejectDescription
              onChange={(e) => setRejectDescription(e.target.value)} // Update to use rejectDescription
              required
              style={styles.textarea}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
                   value={status}
                   onChange={(e) => setStatus(e.target.value)}
                   required
                   style={styles.select}
              >
              <option value="Rejected">Rejected</option>
           </select>
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>Submit</button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline styles remain the same
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // High z-index to ensure it overlays other content
  },
  modalContainer: {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    width: '400px', // Set a fixed width for the modal
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical', // Allows resizing vertically
  },
  select: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonGroup: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336', // Red for rejection
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50', // Green for cancel
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default RejectForm;
