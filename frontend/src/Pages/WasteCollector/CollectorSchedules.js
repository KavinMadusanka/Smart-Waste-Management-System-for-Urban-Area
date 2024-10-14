import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Input, Modal, Select} from 'antd'; // Ant Design components
import { useAuth } from '../../context/auth';  
import { Box } from '@mui/material';
import CollectorHeader from './../../components/Layout/CollectorHeader';
import './../../components/style/collectorSchedule.css';
import {  Typography} from '@mui/material';

const { Title } = Typography;
const { Option } = Select; // For Select component

const CollectorSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [auth] = useAuth(); // Auth context to get the logged-in waste collector info
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [newStatus, setNewStatus] = useState('');

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
                setFilteredSchedules(data.collectionSchedules); // Initialize filtered schedules
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

    // Filter schedules based on search input
    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = schedules.filter(schedule => 
            schedule.area.toLowerCase().includes(value.toLowerCase()) || 
            schedule.status.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSchedules(filtered);
    };

    useEffect(() => {
        fetchSchedules();
    }, [auth]);

    // Handle schedule click to open modal
    const handleScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setNewStatus(schedule.status); // Set the current status for editing
        setIsModalVisible(true); // Show the modal
    };

    // Update status in the backend
    const handleUpdateStatus = async () => {
        if (!selectedSchedule) return;

        try {
            const { data } = await axios.put(`/api/v1/collectionSchedule/update-status/${selectedSchedule._id}`, { status: newStatus });
            if (data?.success) {
                fetchSchedules(); // Refresh schedules after updating
                setIsModalVisible(false); // Close the modal
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Error updating status. Please try again.');
        }
    };

    // Columns for the Ant Design Table
    const columns = [
        {
            title: 'Area',
            dataIndex: 'area',
            key: 'area',
        },
        {
            title: 'Pickup Date',
            dataIndex: 'pickupDate',
            key: 'pickupDate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Pickup Time',
            dataIndex: 'pickupTime',
            key: 'pickupTime',
        },
        {
            title: 'Bin Type',
            dataIndex: 'binType',
            key: 'binType',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => <span onClick={handleScheduleClick}>{text}</span>, // Add onClick to status
        },
    ];

    return (
        <Box>
            <CollectorHeader />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '15vh', padding: '20px', alignItems: 'center' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Waste Collection Pickup Schedule
                </Typography><br/>
                
                <Input.Search
                    placeholder="Search by area or status"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ marginBottom: '20px', width: '300px', textAlign: 'center' }} // Adjust width as needed
                />
            </Box><br/>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '30px' }}>
                {loading ? (
                    <Spin tip="Loading schedules..." />
                ) : error ? (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '20px' }}
                    />
                ) : (
                    <Table 
                        dataSource={filteredSchedules} 
                        columns={columns} 
                        rowKey="_id" // Assuming each schedule has a unique '_id'
                        pagination={{ pageSize: 10 }} // You can adjust the pagination as needed
                        rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'} // Alternate row styles
                        onRow={(record) => ({
                            onClick: () => handleScheduleClick(record), // Open modal on row click
                        })}
                    />
                )}
            </Box>

            {/* Modal for updating status */}
            <Modal
                title="Update Status"
                visible={isModalVisible}
                onOk={handleUpdateStatus}
                onCancel={() => setIsModalVisible(false)}
            >
                <Select value={newStatus} onChange={setNewStatus} style={{ width: '100%' }}>
                    <Option value="Missed">Missed</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="In Progress">In Progress</Option>
                </Select>
            </Modal>
        </Box>
    );
};

export default CollectorSchedules;
