import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import WasteRequestForm from './../Form/WasteRequestForm'
import Header1 from '../../components/Layout/Header1'; // Import Header1
import {} from './../../components/style/RecyclingPage.css';
import recyclingImage from './../../components/image/recycling-image.jpeg';

const RedeemRewards = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const navigate = useNavigate();

    const getAllBulkCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/RewardRoutes/get-rewards');
            if (data?.success) {
                setCategories(data.bulkCategories);
                console.log(data);
                getAllBulkCategories();
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

    // Function to handle modal visibility and content
    const handleModal = (content) => {
        setVisible(true);
        setModalContent(content);
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
                    <div className="recyclingContainer">
                        <h1 className='h1Header'>What is Recycling?</h1>
                        <div className="firstContent">
                            <p className='paragr'>
                            Recycling is the process of collecting, processing, and reusing materials that would otherwise be discarded as waste. By converting used materials into new products, recycling reduces the need for raw materials, conserves natural resources, and decreases the amount of waste sent to landfills and incinerators. Commonly recycled materials include paper, glass, metal, and plastic. Recycling not only helps protect the environment but also supports economic growth by creating jobs in the recycling and manufacturing industries. It's a key component of sustainable living, promoting the efficient use of resources and minimizing our ecological footprint.
                            </p>
                            <img src={recyclingImage} alt="Recycling" className="recycling-image" />
                        </div>
                        <h2 className='h2Header'>How to Identify Recyclable Materials?</h2>
                        <p className='secondParagr'>
                            Identifying recyclable materials involves checking labels, symbols, and local recycling guidelines. Look for the recycling symbol (♻️) with a number inside, indicating the type of plastic. Common recyclable items include paper, cardboard, glass bottles, aluminum cans, steel, and most plastics labeled #1 and #2. Always rinse and clean items before recycling.
                        </p>
                    </div>

                <h1 style={{
                    textAlign: 'center',
                    paddingTop:20,
                    color: '#1A4D2E',
                    fontWeight: 600,
                    marginBottom: '40px',
                }}>Waste Categories</h1>

                <div style={{
                    backgroundColor: '#EDEDED',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}>
                    <Row gutter={[16, 24]} justify="center">
                        {categories.map((category) => (
                            <Col key={category._id} xs={24} sm={12} md={6}> {/* Adjusted for 4 items in a row */}
                                <Card
                                    hoverable
                                    onClick={() => handleCategoryClick(category)}
                                    style={{
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                        borderRadius: '10px',
                                        width: '100%', 
                                        height: '280px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                    cover={
                                        category.photo ? (
                                            <img
                                                src={`/api/v1/RewardRoutes/reward-photo/${category._id}?t=${new Date().getTime()}`}
                                                alt={category.name}
                                                style={{
                                                    width: '100%',
                                                    height: '140px', // Adjusted height for the image (half of card size)
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
                                                height: '140px', 
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
                                        textAlign: 'left',
                                        paddingLeft:'10px',
                                        paddingRight:'10px',
                                        paddingBottom:'10px',
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        <h3 style={{
                                            color: '#1A4D2E',
                                            fontWeight: 500,
                                            marginBottom: '4px', // Reduced margin between the name and image
                                        }}>{category.name}</h3>
                                        <p style={{
                                            color: '#666',
                                            fontSize: '14px',
                                            minHeight: '40px', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2, 
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
                            onClick={() => { handleModal(<WasteRequestForm />);}}
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
                                src={`/api/v1/RewardRoutes/reward-photo/${selectedCategory._id}?t=${new Date().getTime()}`}
                                alt={selectedCategory.name}
                                style={{ width: '300px', borderRadius: '8px', marginTop: '20px' }} // Add margin for spacing
                            />
                        )}
                    </div>
                </Modal>
                <Modal
                    onCancel={() => setVisible(false)}
                    footer={null}
                    visible={visible}>
                    {modalContent}
              </Modal> 

            </div>
        </div>
    );
};

export default RedeemRewards;
