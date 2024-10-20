import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header1 from '../../components/Layout/Header1'; // Import Header1
import Footer from '../../components/Layout/Footer';

const BulkCategoryUser = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const getAllBulkCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/bulkCategory/get-bulkCategory');
            if (data?.success) {
                setCategories(data.bulkCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        getAllBulkCategories();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedCategory(null);
    };

    return (
        <div style={{ backgroundColor: '#F3F4F6' }}>
            <Header1 /> {/* Include Header1 here */}
            <div style={{
                padding: '30px',
                backgroundColor: '#F3F4F6',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#1A4D2E',
                    fontWeight: 600,
                    marginBottom: '40px',
                }}>Bulk Waste Categories</h1>

                <div style={{
                    backgroundColor: '#EDEDED',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}>
                    <Row gutter={[16, 24]} justify="center">
                        {categories.map((category) => (
                            <Col key={category._id} xs={24} sm={12} md={8}>
                                <Card
                                    hoverable
                                    onClick={() => handleCategoryClick(category)}
                                    style={{
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                        borderRadius: '10px',
                                        minHeight: '340px', // Set a fixed height for the cards
                                        maxHeight: '340px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                    cover={
                                        category.photo ? (
                                            <img
                                                src={`/api/v1/bulkCategory/bulkcategory-photo/${category._id}?t=${new Date().getTime()}`}
                                                alt={category.name}
                                                style={{
                                                    width: '100%',
                                                    height: '180px',
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: '12px',
                                                    borderTopRightRadius: '12px',
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '180px',
                                                borderTopLeftRadius: '12px',
                                                borderTopRightRadius: '12px',
                                                backgroundColor: '#f0f0f0',
                                            }}>
                                                <PlusOutlined style={{ fontSize: '36px', color: '#aaa' }} />
                                            </div>
                                        )
                                    }
                                >
                                    <div style={{
                                        textAlign: 'left', // Left align text
                                        padding: '10px',
                                        flexGrow: 1, // Make this section take up available space
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        <h3 style={{
                                            color: '#1A4D2E',
                                            fontWeight: 500,
                                            marginBottom: '10px',
                                        }}>{category.name}</h3>
                                        <p style={{
                                            color: '#666',
                                            fontSize: '14px',
                                            minHeight: '60px', // Set a fixed height for the description area
                                            overflow: 'hidden', // Prevent overflow
                                            textOverflow: 'ellipsis', // Add ellipsis for long text
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 3, // Limit to 3 lines
                                        }}>{category.description}</p>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '40px',
                    }}>
                        <Button
                            type="primary"
                            onClick={() => navigate('/brequestform')}
                            style={{
                                backgroundColor: '#1A4D2E',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 28px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#57A773'} // Hover effect
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A4D2E'} // Reset color
                        >
                            To Request Form
                        </Button>
                    </div>
                </div>

                <Modal
                    title={<h2 style={{ fontWeight: 600, color: '#1A4D2E' }}>{selectedCategory?.name}</h2>}
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={700}
                    bodyStyle={{ maxHeight: '400px', overflowY: 'auto', whiteSpace: 'pre-wrap' }} // Ensures text wraps correctly
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: '20px' }}>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Description:</strong> {selectedCategory?.description}</p>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Additional Description:</strong> {selectedCategory?.additionalDescription}</p>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Instructions:</strong> {selectedCategory?.instructions}</p>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Benefits:</strong> {selectedCategory?.benefits}</p>
                        </div>
                        {selectedCategory?.photo && (
                            <img
                                src={`/api/v1/bulkCategory/bulkcategory-photo/${selectedCategory._id}?t=${new Date().getTime()}`}
                                alt={selectedCategory.name}
                                style={{ width: '300px', borderRadius: '8px', marginTop: '20px' }} // Add margin for spacing
                            />
                        )}
                    </div>
                </Modal>

            </div>
            <Footer/>
        </div>
    );
};

export default BulkCategoryUser;
