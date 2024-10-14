import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '../../components/Layout/Header1'; // Reuse the Header1 component
import { Link } from 'react-router-dom'; // We will no longer use useNavigate for navigation
import ApproveForm from './ApproveForm'; // Import the ApproveForm component
import RejectForm from './RejectForm';// Import RejectForm
import AdminMenu from '../../components/Layout/AdminMenu';

const AdminMaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false); // State for reject modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/v1/maintenance/get-maintenance');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true); // Show the reject modal
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedRequest(null);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <>
      <AdminMenu />
      <div style={styles.mainContainer}>
        <div style={styles.sidebar}>
          <h3>Navigation</h3>
          <ul style={styles.navList}>
            <li><Link to="/" style={styles.navLink}>Home</Link></li>
            <li><Link to="/services" style={styles.navLink}>Services</Link></li>
            <li><Link to="/contact" style={styles.navLink}>Contact Us</Link></li>
            <li><Link to="/about" style={styles.navLink}>About Us</Link></li>
            <li><Link to="/admin/maintenance" style={styles.navLink}>Maintenance Requests</Link></li>
          </ul>
        </div>

        <div style={styles.cardsContainer}>
          <h2 style={styles.heading}>Maintenance Requests</h2>
          {requests.map((request) => (
            <div key={request._id} style={styles.card}>
              <h3>{request.fullName}</h3>
              <p><strong>Contact:</strong> {request.contactNumber}</p>
              <p><strong>Email:</strong> {request.email}</p>
              <p><strong>Issue:</strong> {request.issueDescription}</p>
              <p><strong>Object Type:</strong> {request.objectType}</p>
              <p><strong>Material:</strong> {request.material}</p>
              <div style={styles.actions}>
                <button onClick={() => handleApprove(request)} style={styles.button}>
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request)} // Open reject modal with request data
                  style={{ ...styles.button, backgroundColor: '#f44336' }}
                  
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Approval Form */}
      {showApproveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <ApproveForm request={selectedRequest} onClose={handleCloseApproveModal} />
          </div>
        </div>
      )}

      {/* Modal for Reject Form */}
      {showRejectModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <RejectForm request={selectedRequest} onClose={handleCloseRejectModal} />
          </div>
        </div>
      )}
    </>
  );
};

// Inline styles
const styles = {
  mainContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
  sidebar: {
    width: '250px',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginRight: '20px',
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
    transition: 'background 0.3s, color 0.3s',
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  heading: {
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  actions: {
    marginTop: '10px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
    borderRadius: '4px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '600px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default AdminMaintenanceRequests;
