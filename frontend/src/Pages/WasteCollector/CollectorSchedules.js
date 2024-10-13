import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, Modal, Button, Spin, Alert, Card } from 'antd';
import { useAuth } from '../../context/auth';  
import { Box } from '@mui/material';

const { Title, Paragraph } = Typography;

const CollectorSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [auth] = useAuth(); // Auth context to get the logged-in waste collector info

    // Fetch schedules for the logged-in waste collector
    const fetchSchedules = async () => {
        if (!auth?.wasteCollector?._id) {
            setLoading(false);
            return; // Exit if there is no collector ID
        }

        try {
            const { data } = await axios.get(`/api/v1/collectionSchedule/get-schedule-by-collector/${auth.wasteCollector._id}`);
            console.log('Fetched schedules:', data); // Log the response
            if (data?.success) {
                setSchedules(data.collectionSchedules); // Ensure you're using the correct key from the response
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setError('Error fetching schedules. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [auth]);

    // Handle schedule click to view details
    const handleScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setIsModalVisible(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedSchedule(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Title level={2}>Collection Schedules</Title>

            {loading ? (
                <Spin tip="Loading schedules..." />
            ) : error ? (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            ) : (
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={schedules}
                    renderItem={schedule => (
                        <List.Item>
                            <Card
                                hoverable
                                onClick={() => handleScheduleClick(schedule)}
                                style={{
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '20px',
                                }}
                            >
                                <div style={{ padding: '10px' }}>
                                    <Title level={4} style={{ marginBottom: '10px' }}>{schedule.area}</Title>
                                    <Paragraph>
                                        {new Date(schedule.pickupDate).toLocaleDateString()} at {schedule.pickupTime}
                                    </Paragraph>
                                    <Paragraph>
                                        Bin Type: {schedule.binType}
                                    </Paragraph>
                                    <Paragraph>
                                        Status: {schedule.status}
                                    </Paragraph>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}

            {/* Modal for displaying schedule details */}
            {selectedSchedule && (
                <Modal
                    title={`Schedule for ${selectedSchedule.area}`}
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button key="close" onClick={handleCloseModal}>
                            Close
                        </Button>
                    ]}
                    width={700}
                    bodyStyle={{ padding: '20px' }}
                >
                    <Paragraph><strong>Area:</strong> {selectedSchedule.area}</Paragraph>
                    <Paragraph><strong>Pickup Date:</strong> {new Date(selectedSchedule.pickupDate).toLocaleDateString()}</Paragraph>
                    <Paragraph><strong>Pickup Time:</strong> {selectedSchedule.pickupTime}</Paragraph>
                    <Paragraph><strong>Bin Type:</strong> {selectedSchedule.binType}</Paragraph>
                    <Paragraph><strong>Status:</strong> {selectedSchedule.status}</Paragraph>
                </Modal>
            )}
        </Box>
    );
};

export default CollectorSchedules;
