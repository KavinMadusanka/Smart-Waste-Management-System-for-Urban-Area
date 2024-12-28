import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import RewardModel from '../models/RewardModel.js';
import { server, app } from '../server.js';  // Import your app and server
import formidableMiddleware from 'express-formidable';

jest.mock('../models/RewardModel.js');  // Mock the RewardModel

// Setup the routes using express
app.use(formidableMiddleware());
app.post('/api/v1/RewardRoutes/create-reward', (req, res) => createReward(req, res));
app.get('/api/v1/RewardRoutes/get-rewards', (req, res) => getAllReward(req, res));
app.get('/api/v1/RewardRoutes/get-single-reward/:slug', (req, res) => getSingleRewaard(req, res));
app.get('/api/v1/RewardRoutes/reward-photo/:cid', (req, res) => RewardPhotoController(req, res));
app.delete('/api/v1/RewardRoutes/delete-reward/:cid', (req, res) => deleteReward(req, res));
app.put('/api/v1/RewardRoutes/update-reward/:cid', formidableMiddleware(), (req, res) => updateReward(req, res));

describe('Reward API Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // Test for creating a reward
  it('should create a reward with valid data', async () => {
    const rewardData = {
      name: 'Plastic',
      point: 100,
      description: 'Recycling Plastic',
      // slug: 'plastic',
    };

    RewardModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(rewardData),
    }));

    const response = await request(app)
      .post('/api/v1/RewardRoutes/create-reward')
      .send(rewardData);

      console.log(response);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Reward Created Successfully');
  });

  // Test for fetching all rewards
  it('should fetch all rewards', async () => {
    const rewards = [
      { name: 'Plastic', point: 100, description: 'Recycling Plastic' },
      { name: 'Paper', point: 50, description: 'Recycling Paper' }
    ];

    RewardModel.find.mockResolvedValue(rewards);

    const response = await request(app)
      .get('/api/v1/RewardRoutes/get-rewards');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.countTotal).toBe(2);
  });

  // Test for getting a single reward by slug
    it('should fetch a single reward by slug', async () => {
      const reward = { name: 'Plastic', point: 100, description: 'Recycling Plastic' };
      const slug = 'Plastic';
    
      // Mock the model to return a reward when searching by slug
      RewardModel.findOne.mockResolvedValue(reward);
    
      // Make the request using the correct URL structure
      const response = await request(app)
        .get(`/api/v1/RewardRoutes/get-single-reward/${slug}`);  // Correct path
    
      // Validate the response
      expect(response.status).toBe(200);  // Expect a 200 OK status
      expect(response.body.success).toBe(true);  // Expect success to be true
      expect(response.body.bulkCategory.name).toBe('Plastic');  // Check if the correct reward is returned
  });

  // Test for updating a reward
  it('should update a reward with valid data', async () => {
    const reward = { name: 'Plastic', point: 100, description: 'Recycling Plastic' };
    const updatedData = { name: 'Metal', point: 150, description: 'Recycling Metal' };

    RewardModel.findByIdAndUpdate.mockResolvedValue(updatedData);

    const response = await request(app)
      .put('/api/v1/RewardRoutes/update-reward/1')
      .send(updatedData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.bulkCategory.name).toBe('Metal');
  });

  // Test for deleting a reward
  it('should not delete a reward', async () => {
    const reward = { name: 'Metal', point: 150, description: 'Recycling Metal' };

    RewardModel.findByIdAndDelete.mockResolvedValue(reward);

    const response = await request(app)
      .delete('/api/v1/RewardRoutes/delete-reward/1');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Error while deleting Bulk Category');
  });
});
