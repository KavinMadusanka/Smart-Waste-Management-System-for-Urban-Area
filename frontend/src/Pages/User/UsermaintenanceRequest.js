import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header1 from '../../components/Layout/Header1'; // Import the Header1 component
import { Link, useNavigate } from 'react-router-dom'; // Use Link for navigation if needed
import { useAuth } from '../../context/auth'; // Import authentication context

const UserMaintainRequest = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth(); // Get authentication details from context
  
  // State to manage form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '', // Email will be auto-filled from auth context
    issueDescription: '',
    objectType: '',
    material: ''
  });

  // Auto-fill email if user is authenticated
  useEffect(() => {
    if (auth && auth.user) {
      setFormData((prevData) => ({
        ...prevData,
        email: auth.user.email
      }));
    }
  }, [auth]);

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
        // Clear form after submission if needed
        setFormData({
          fullName: '',
          contactNumber: '',
          email: auth.user.email, // Retain the email field
          issueDescription: '',
          objectType: '',
          material: ''
        });
        navigate('/maintenance-requests'); // Navigate to another page after submission if needed
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an issue submitting your request. Please try again.');
    }
  };

  return (
    <>
      {/* Add the Header1 component */}
      <Header1 />

      {/* Main content area with sidebar and form */}
      <div style={styles.mainContainer}>
        
        {/* Sidebar with navigation tabs */}
        <div style={styles.sidebar}>
          
          <ul style={styles.navList}>
            <li><Link to="/" style={styles.navLink}>Create Request</Link></li>
            <li><Link to="/allRequest" style={styles.navLink}>My All Requests</Link></li>
            <li><Link to="/contact" style={styles.navLink}>Notifications</Link></li>
            
          </ul>
        </div>

        {/* Form content */}
        <div style={styles.formContainer}>
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
              readOnly
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
      </div>
    </>
  );
};

// Inline CSS styles
const styles = {
  mainContainer: {
    display: 'flex',
    alignItems: 'flex-start', // Aligns both elements to the top
    minHeight: '100vh', // Full viewport height
    padding: '20px',
    backgroundColor: '#f0f0f0', // Light background for the page
  },
  sidebar: {
    width: '300px', // Sidebar width
    marginRight: '20px',
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    height: 'fit-content', // Ensure the sidebar does not stretch to full height
  },
  navList: {
    listStyleType: 'none',
    padding: '0',
  },
  navLink: {
    display: 'block',
    padding: '10px 0',
    color: '#333',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  formContainer: {
    flex: 1, // Allow the form to take up the remaining space
    maxWidth: '600px', // Reduced the max width of the form
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    alignItems: 'center'
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
};

export default UserMaintainRequest;
