import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast';
import { Modal, Button, Input, Form, Upload, Row, Col, Card } from 'antd'; 
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateRedeemReward = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null); 
    const [addLoading, setAddLoading] = useState(false);
    const [form] = Form.useForm(); 

    const getAllBulkCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/RewardRoutes/get-rewards');
            if (data?.success) {
                setCategories(data.bulkCategories);
                getAllBulkCategory();
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong while fetching Rewards');
        }
    };

    useEffect(() => {
        getAllBulkCategory();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            form.setFieldsValue({
                name: selectedCategory.name,
                point: selectedCategory.point,
                description: selectedCategory.description,
            });
            setIsModalOpen(true);
        }
    }, [selectedCategory, form]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setFile(null); 
    };

    const handleUpdateCategory = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('point', values.point);
        formData.append('description', values.description);

        if (file) {
            formData.append('photo', file);
        }

        try {
            const { data } = await axios.put(`/api/v1/RewardRoutes/update-reward/${selectedCategory._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            if (data?.success) {
                toast.success('Reward updated successfully');
                getAllBulkCategory();
                setIsModalOpen(false);
                setSelectedCategory(null);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong while updating reward');
        }
    };

    const handleAddCategory = async (values) => {
        setAddLoading(true);
    
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('point', values.point);
        formData.append('description', values.description);
    
        if (file) {
            formData.append('photo', file);
        }
    
        try {
            const { data } = await axios.post('/api/v1/RewardRoutes/create-reward', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (data?.success) {
                toast.success(data.message);
                setFile(null);
                getAllBulkCategory();
                form.resetFields();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error while adding reward:', error);
            toast.error('Something went wrong while adding reward');
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this reward?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    const { data } = await axios.delete(`/api/v1/RewardRoutes/delete-reward/${selectedCategory._id}`);
                    if (data?.success) {
                        toast.success('Reward deleted successfully');
                        getAllBulkCategory();
                        setIsModalOpen(false);
                        setSelectedCategory(null);
                    } else {
                        toast.error('Failed to delete reward');
                    }
                } catch (error) {
                    console.log(error);
                    toast.error('Something went wrong while deleting reward');
                }
            },
        });
    };

     //only gets alpherbatds
    const handleKeyPress = (event) => {
        const regex = /^[a-zA-Z\s]*$/;
        if(!regex.test(event.key)){
        event.preventDefault();
        }
    };

    //only gets numbers
    const handleKeyNumber = (event) => {
        const regex = /^[0-9\s]*$/;
        if(!regex.test(event.key)){
          event.preventDefault();
        }
    };

    return (
        <div className="bulk-categories-container" style={{ padding: '30px', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
            <Row gutter={16}>
                {/* Add Bulk Waste Category Section */}
                <Col span={8}>
                    <Card className="add-category-card" title="Add New Rewards" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                        <Form onFinish={handleAddCategory} layout="vertical">
                            <Form.Item label="Reward Name" name="name" rules={[{ required: true, message: 'Please input the category name!' }]}>
                                <Input className="category-name-input" />
                            </Form.Item>

                            <Form.Item label="Reward Points" onKeyPress={handleKeyNumber} name="point" rules={[{ required: true, message: 'Please input the category points!' }]}>
                                <Input className="category-name-input" />
                            </Form.Item>

                            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
                                <Input.TextArea rows={4} className="description-textarea" />
                            </Form.Item>

                            <Form.Item label="Upload Photo" className="upload-photo-item">
                                <Upload beforeUpload={(file) => { 
                                    setFile(file); 
                                    return false; 
                                }}>
                                    <Button icon={<UploadOutlined />} style={{ backgroundColor: '#1A4D2E', color: '#fff' }}>
                                        Click to Upload
                                    </Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={addLoading} style={{ backgroundColor: '#1A4D2E', borderColor: '#1A4D2E' }}>
                                    {addLoading ? 'Adding...' : 'Add Category'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Bulk Waste Categories Section */}
                <Col span={16}>
                    <h2 className="categories-title" style={{ color: '#1A4D2E' }}>All Rewards</h2>
                    <div className="categories-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {categories.map((category) => (
                            <Card
                                key={category._id}
                                hoverable
                                className="category-card"
                                style={{
                                    width: '30%',
                                    margin: '10px',
                                    backgroundColor: '#fff',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleCategoryClick(category)}
                                cover={
                                    category.photo ? (
                                        <img
                                            src={`/api/v1/RewardRoutes/reward-photo/${category._id}?t=${new Date().getTime()}`}
                                            alt={category.name}
                                            style={{
                                                width: '100%',
                                                height: '180px',
                                                objectFit: 'cover',
                                                borderTopLeftRadius: '10px',
                                                borderTopRightRadius: '10px',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="empty-category-image"
                                            style={{
                                                width: '100%',
                                                height: '180px',
                                                backgroundColor: '#e0e0e0',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderTopLeftRadius: '10px',
                                                borderTopRightRadius: '10px',
                                            }}
                                        >
                                            <PlusOutlined style={{ fontSize: '30px', color: '#aaa' }} />
                                        </div>
                                    )
                                }
                            >
                                <Card.Meta
                                    title={<span style={{ color: '#1A4D2E' }}>{category.name}</span>}
                                    description={<span>
                                                    <strong>{category.description}</strong><br />
                                                    Points: {category.point}
                                                </span>}
                                />
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>

            {/* Modal for updating category */}
            <Modal
                title="Update Category"
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="update-category-modal"
            >
                <Form
                    form={form}
                    onFinish={handleUpdateCategory}
                    layout="vertical"
                    className="update-category-form"
                >
                    <Form.Item label="Category Name" name="name" rules={[{ required: true, message: 'Please input the Reward name!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Reward Points" onKeyPress={handleKeyNumber} name="point" rules={[{ required: true, message: 'Please input the Reward points!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Upload Photo" className="upload-photo-item">
                        <Upload beforeUpload={(file) => { setFile(file); return false; }}>
                            <Button icon={<UploadOutlined />} style={{ backgroundColor: '#1A4D2E', color: '#fff' }}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1A4D2E', borderColor: '#1A4D2E' }}>
                            Update Category
                        </Button>
                        <Button danger onClick={handleDeleteCategory} style={{ marginLeft: '10px' }}>
                            Delete Category
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateRedeemReward;