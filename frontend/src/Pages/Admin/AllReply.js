import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '../../components/Layout/Header1'; // Reuse the Header1 component

const AdminRequestsSchedule = () => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch all replies
    const fetchAllReplies = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/v1/replies/get-reply');
            setReplies(response.data);
        } catch (err) {
            setError('Error fetching replies');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReplies();
    }, []);

    // Inline styles
    const styles = {
        container: {
            padding: '20px',
            backgroundColor: '#f4f4f4',
            borderRadius: '8px',
        },
        title: {
            fontSize: '24px',
            marginBottom: '20px',
            textAlign: 'center',
        },
        replyCard: {
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            margin: '10px 0',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        replyTitle: {
            marginBottom: '10px',
            fontSize: '18px',
            color: '#333',
        },
        replyText: {
            margin: '4px 0',
            fontSize: '16px',
            color: '#555',
        },
        statusApproved: {
            color: 'green',
            fontWeight: 'bold',
        },
        statusRejected: {
            color: 'red',
            fontWeight: 'bold',
        },
        loadingText: {
            textAlign: 'center',
            fontSize: '18px',
            color: '#007BFF',
        },
        errorText: {
            textAlign: 'center',
            fontSize: '18px',
            color: 'red',
        },
        noRepliesText: {
            textAlign: 'center',
            fontSize: '18px',
            color: '#888',
        },
    };

    return (
        <>
        <Header1 />
        <div style={styles.container}>
            <h1 style={styles.title}>All User Requests Schedule</h1>
            {loading && <p style={styles.loadingText}>Loading...</p>}
            {error && <p style={styles.errorText}>{error}</p>}
            {replies.length > 0 ? (
                replies.map((reply) => (
                    <div key={reply._id} style={styles.replyCard}>
                        <h2 style={styles.replyTitle}>Request ID: {reply.requestId._id}</h2>
                        <p style={styles.replyText}><strong>Status:</strong> 
                            <span style={reply.status === 'Approved' ? styles.statusApproved : styles.statusRejected}>
                                {reply.status}
                            </span>
                        </p>
                        {reply.status === 'Approved' ? (
                            <>
                                <p style={styles.replyText}><strong>Scheduled Date:</strong> {new Date(reply.scheduledDate).toLocaleDateString()}</p>
                                <p style={styles.replyText}><strong>Assigned Technician:</strong> {reply.assignedTechnician?.fullName}</p>
                                <p style={styles.replyText}><strong>Repair Description:</strong> {reply.repairDescription}</p>
                                <p style={styles.replyText}><strong>Estimated Duration:</strong> {reply.estimateDuration}</p>
                            </>
                        ) : (
                            <p style={styles.replyText}><strong>Rejection Reason:</strong> {reply.rejectDescription}</p>
                        )}
                    </div>
                ))
            ) : (
                <p style={styles.noRepliesText}>No replies found.</p>
            )}
        </div>
        </>
    );
};

export default AdminRequestsSchedule;
