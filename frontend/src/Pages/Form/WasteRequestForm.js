import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, InputNumber, Button, Select, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';

const WasteRequestForm = () => {
  const [categories, setCategories] = useState([]); // Store waste categories from the backend
  const [loading, setLoading] = useState(true); // Loading state
  const [wasteItems, setWasteItems] = useState([{ category: null, quantity: 0, points: 0 }]); // Store selected waste items with points
  const [email, setEmail] = useState("");
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if(auth && auth.user){
      setEmail(auth.user.email)
    }
  },[auth]);

  // Fetch waste categories from the server
  const fetchCategories = async () => {
    try {
        const { data } = await axios.get('/api/v1/wasteCategory/get-wasteCategory');
        if (data?.success) {
            setCategories(data.bulkCategories);
            console.log(data)
        }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching categories
    }
  };

  // Effect to fetch the waste categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []); // Empty array ensures this effect only runs once after the initial render

  // Handle adding a new waste item (a new dropdown and input field)
  const addWasteItem = () => {
    setWasteItems([...wasteItems, { category: null, quantity: 0, points: 0 }]);
  };

  const updateWasteItem = (index, field, value) => {
    const updatedItems = wasteItems.map((item, idx) => {
      if (idx === index) {
        if (field === 'category') {
          // Find the points for the selected category
          const selectedCategory = categories.find(category => category.name === value);
          const points = selectedCategory ? selectedCategory.point : 0;  // Ensure points are fetched correctly
          return { ...item, category: value, points }; // Update category and points
        } else if (field === 'quantity') {
          return { ...item, quantity: value }; // Update quantity
        }
      }
      return item;
    });
    setWasteItems(updatedItems);
  };
  

  // Handle removing a waste item
  const removeWasteItem = (index) => {
    const updatedItems = wasteItems.filter((_, idx) => idx !== index);
    setWasteItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Waste Items received:',wasteItems);
    // Check if any of the waste item quantities are 0
    const hasZeroQuantity = wasteItems.some(item => item.quantity === 0);

    if (hasZeroQuantity) {
      return toast.error('Each waste item must have a minimum quantity of 1 kg');
    }
    try {
      const response = await axios.post('/api/v1/wasteRequest/submit-waste-request', {
        items: wasteItems,
        userEmail: email, // Send user email as well
      });
      
      if (response?.data?.success) {
        toast.success(response.data.message);
        console.log('Waste request submitted:', response.data);

        // Generate QR Code with waste request ID
        // const wasteRequestId = response.data.data;
        // const qrCodeUrl = await QRCode.toDataURL(wasteRequestId);

        // console.log('QR Code URL:', qrCodeUrl);
        // setQrCodeUrl(qrCodeUrl);

        setWasteItems([{ category: null, quantity: 0, points: 0 }]);

      } else {
        toast.error('Failed to submit waste request');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the request');
      console.error('Error submitting waste request:', error);
    }
  };
  const handleNumberPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    // Only allow numbers (48-57) and dot (46) for floats
    if (charCode !== 46 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#F3F4F6' }}>
      <h1 style={{ textAlign: 'center', color: '#1A4D2E', fontWeight: 600 }}>Waste Request Form</h1>

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit}>
          {wasteItems.map((item, index) => (
            <Row key={index} gutter={16} align="middle">
              <Col span={10}>
                <Form.Item label={`Waste Category ${index + 1}`} required>
                  <Select
                    placeholder="Select Waste Category"
                    value={item.category}
                    onChange={(value) => updateWasteItem(index, 'category', value)}
                  >
                    {categories.map((category) => (
                      <Select.Option key={category._id} value={category.name}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Quantity (kg)" required>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => updateWasteItem(index, 'quantity', value)}
                    onKeyPress={handleNumberPress}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button
                  type="danger"
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeWasteItem(index)}
                  disabled={wasteItems.length === 1} // Prevent removing if only one item
                />
              </Col>
            </Row>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={addWasteItem} icon={<PlusOutlined />}>
              Add Another Waste Item
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1A4D2E', border: 'none' }}>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default WasteRequestForm;
