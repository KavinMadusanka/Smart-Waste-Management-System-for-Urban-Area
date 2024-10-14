import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '../../components/Layout/Header1';
import { useAuth } from '../../context/auth';

const MaintenanceRequests = () => {
    const [auth] = useAuth();
    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (auth && auth.user) {
            setEmail(auth.user.email);
            console.log("User email:", auth.user.email); // Debugging email
        }
    }, [auth]);

    useEffect(() => {
        const fetchMaintenanceDetails = async () => {
            try {
                // Make sure the endpoint matches your backend API
                const response = await axios.get(`http://localhost:8082/api/v1/maintenance/get-user-maintenance/${email}`);
                console.log('API Response:', response.data); // Debugging API response
                setMaintenance(response.data.maintenance); // Adjust based on the actual structure
            } catch (error) {
                console.error('Error fetching maintenance details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchMaintenanceDetails();
        }
    }, [email]);

    return (
        <>
            <Header1 />
            <div style={styles.container}>
                <h2 style={styles.heading}>Maintenance Requests</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : maintenance.length > 0 ? (
                    <ul style={styles.requestList}>
                        {maintenance.map(request => (
                            <li key={request._id} style={styles.requestItem}>
                                <h4>{request.issueDescription}</h4>
                                <p><strong>Full Name:</strong> {request.fullName}</p>
                                <p><strong>Contact Number:</strong> {request.contactNumber}</p>
                                <p><strong>Email:</strong> {request.email}</p>
                                <p><strong>Object Type:</strong> {request.objectType}</p>
                                <p><strong>Material:</strong> {request.material}</p>
                                <p><strong>Submitted On:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No maintenance requests found.</p>
                )}
            </div>
        </>
    );
};

// Inline CSS styles
const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    requestList: {
        listStyleType: 'none',
        padding: '0',
    },
    requestItem: {
        backgroundColor: '#fff',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
};

export default MaintenanceRequests;
