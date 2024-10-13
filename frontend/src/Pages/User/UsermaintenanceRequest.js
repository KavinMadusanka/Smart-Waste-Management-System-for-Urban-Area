import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Header1';
// import Layout from '../../components/Layout/Layout';


const UserMaintainRequest = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    issueDescription: '',
    objectType: '',
    material: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post form data to the backend
      const response = await axios.post('/api/v1/maintenance/create-maintenance', formData);
      if (response.status === 201) {
        alert('Maintenance request submitted successfully.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an issue submitting your request. Please try again.');
    }
  };

  return (
    
    <div style={styles.container}>
    
      <h2 style={styles.heading}>Submit a Repair Request</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Issue Description:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleChange}
          style={styles.textarea}
          required
        ></textarea>

        <label style={styles.label}>Object Type:</label>
        <select
          name="objectType"
          value={formData.objectType}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="" disabled>Select Object Type</option>
          <option value="Waste Bin">Waste Bin</option>
          <option value="Sensor">Sensor</option>
          <option value="Lid">Lid</option>
          <option value="Other">Other</option>
        </select>

        <label style={styles.label}>Material:</label>
        <select
          name="material"
          value={formData.material}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="" disabled>Select Material</option>
          <option value="Plastic">Plastic</option>
          <option value="Metal">Metal</option>
          <option value="Composite">Composite</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  
    
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f7f7f7',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
  },
  textarea: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
    height: '100px',
  },
  select: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default UserMaintainRequest;