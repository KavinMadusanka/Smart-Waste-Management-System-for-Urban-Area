import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Select, Modal } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas for the QR code
import Header1 from '../../components/Layout/Header1';
import { useAuth } from '../../context/auth';

const { Option } = Select;

const AdminWasteRequests = () => {
const [wasteRequests, setWasteRequests] = useState([]); // Store all waste requests
const [selectedRequest, setSelectedRequest] = useState(null); // For modal to show QR code and update status
const [loading, setLoading] = useState(true); // Loading state
const [modalVisible, setModalVisible] = useState(false); // Modal visibility
const [auth, setAuth] = useAuth();
const [userPoint,setPoint] = useState("");
const [email, setEmail] = useState("");
const [ID,setID] = useState("");

  // Fetch all waste requests from the server
  const fetchWasteRequests = async () => {
    try {
      const { data } = await axios.get('/api/v1/wasteRequest/all');
      if (data?.success) {
        setWasteRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching waste requests:', error);
      toast.error('Failed to fetch waste requests');
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to load waste requests when the component mounts
  useEffect(() => {
    fetchWasteRequests();
  }, []);

  useEffect(() => {
    if (auth && auth.user) {
        setID(auth.user._id)
        setEmail(auth.user.email);
    }
}, [auth]);

  // Function to update the status of the selected waste request
const handleStatusChange = async (id, status) => {
    if (status === 'completed') {
      try {
        // Find the selected waste request to calculate total points
        const { data } = await axios.get(`/api/v1/wasteRequest/get-SingleRequest/${id}`);
        const ReqEmail = data.userEmail;
        console.log(ReqEmail)
        if (data?.success) {
          const wasteRequest = data.WasteReq;
          
          // Calculate total points from the items array
          const totalPoints = wasteRequest.items.reduce((total, item) => {
            return total + (item.quantity * item.points); // Calculate points for each item
          }, 0);

          console.log(totalPoints);
          
          // Send PUT request to update the waste request status in the database
          const response = await axios.put(`/api/v1/wasteRequest/${id}/update-status`, {
            status,
          });
          // Fetch the user details by email
          const userResponse = await axios.get(`/api/v1/auth/get-SingleUser/${ReqEmail}`);
          const user = userResponse.data?.user; // Ensure correct access to user data
          const userCurrectPoint = user?.points;
          console.log(userCurrectPoint);
          const currentPoint = (totalPoints + userCurrectPoint);
          console.log(currentPoint);

  
          if (response?.data?.success) {
            // Update user points after successfully completing the request
            await axios.put(`/api/v1/auth/update-points/${ReqEmail}`, {
              points: currentPoint, // Sending the total calculated points to update
            });
  
            toast.success('Status updated successfully');
            // Refresh the waste requests list
            fetchWasteRequests();
          } else {
            toast.error('Failed to update status');
          }
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('An error occurred while updating the status');
      }
    } else {
      toast.warn('You can only update to "Completed" status.');
    }
  };
  

  // Open modal to show QR code for the selected waste request
  const handleShowQrCode = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  // Table columns for displaying waste requests
  const columns = [
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          onChange={(value) => handleStatusChange(record._id, value)} // Call handleStatusChange when the status changes
          style={{ width: 120 }}
        >
          <Option value="pending" disabled={record.status === 'completed'}>Pending</Option>
          <Option value="in-progress" disabled={record.status === 'completed'}>In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="primary" style={{backgroundColor:'#1A4D2E'}} onClick={() => handleShowQrCode(record)}>
          View QR Code
        </Button>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#F3F4F6' }}>
        <Header1/>
    <div style={{ padding: '30px', backgroundColor: '#F3F4F6' }}>
      <h1 style={{ textAlign: 'center', color: '#1A4D2E', fontWeight: 600 }}>Admin Waste Requests</h1>

      {loading ? (
        <p>Loading waste requests...</p>
      ) : (
        <Table dataSource={wasteRequests} columns={columns} rowKey="_id" />
      )}

      <Modal
        title="Waste Request QR Code"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedRequest && (
          <div style={{ textAlign: 'center' }}>
            <QRCodeCanvas value={selectedRequest._id} size={200} /> {/* Generate QR code using QRCodeCanvas */}
            <p>{`Request ID: ${selectedRequest._id}`}</p>
            <p>{`Status: ${selectedRequest.status}`}</p>
          </div>
        )}
      </Modal>
    </div>
    </div>
  );
};

export default AdminWasteRequests;
