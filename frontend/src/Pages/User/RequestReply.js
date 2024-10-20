import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaintenanceReplies = ({ userEmail }) => {
    const [requestsWithReplies, setRequestsWithReplies] = useState([]);

    // Function to fetch maintenance details
    const fetchMaintenanceDetails = async (userEmail) => {
        try {
            const response = await axios.get(`http://localhost:8082/api/v1/maintenance/get-user-maintenance-replies/${userEmail}`);
            const maintenanceData = response.data.userRequestsWithReplies;

            console.log('Maintenance data with replies:', maintenanceData);
            return maintenanceData;

        } catch (error) {
            console.error('Error fetching maintenance details:', error);
            return null;
        }
    };

    // Fetch maintenance details when the component is loaded
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchMaintenanceDetails(userEmail);
            if (data) {
                setRequestsWithReplies(data);
            }
        };
        fetchData();
    }, [userEmail]);

    return (
        <div>
            <h1>My Maintenance Requests and Replies</h1>
            {requestsWithReplies.length > 0 ? (
                requestsWithReplies.map((item, index) => (
                    <div key={index} className="request-reply">
                        <h2>Request #{index + 1}</h2>
                        <p><strong>Issue:</strong> {item.requestDetails.issueDescription}</p>
                        <p><strong>Object Type:</strong> {item.requestDetails.objectType}</p>
                        <p><strong>Material:</strong> {item.requestDetails.material}</p>
                        <p><strong>Submitted On:</strong> {new Date(item.requestDetails.createdAt).toLocaleDateString()}</p>

                        <h3>Admin's Reply</h3>
                        {item.replyDetails.message ? (
                            <p>{item.replyDetails.message}</p>
                        ) : (
                            <>
                                <p><strong>Status:</strong> {item.replyDetails.status}</p>
                                {item.replyDetails.status === 'Approved' ? (
                                    <>
                                        <p><strong>Scheduled Date:</strong> {new Date(item.replyDetails.scheduledDate).toLocaleDateString()}</p>
                                        <p><strong>Assigned Technician:</strong> {item.replyDetails.assignedTechnician.fullName}</p>
                                        <p><strong>Repair Description:</strong> {item.replyDetails.repairDescription}</p>
                                        <p><strong>Estimated Duration:</strong> {item.replyDetails.estimateDuration}</p>
                                    </>
                                ) : (
                                    <p><strong>Rejection Reason:</strong> {item.replyDetails.rejectDescription}</p>
                                )}
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>No maintenance requests or replies found.</p>
            )}
        </div>
    );
};

export default MaintenanceReplies;
