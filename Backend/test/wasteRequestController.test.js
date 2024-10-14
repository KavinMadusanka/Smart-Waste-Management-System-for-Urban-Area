import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { createWasteRequest } from '../controllers/wasteRequestController.js';
import WasteRequest from '../models/wasteRequestModel.js'; // Mock this model
import { server, app } from '../server.js';

// Set up a mock for the WasteRequest model
jest.mock('../models/wasteRequestModel');

// Define the route for waste requests in your mock app
app.post('/api/v1/wasteRequest', createWasteRequest);

describe('POST /api/v1/wasteRequest', () => {
  beforeEach(async () => {
    // jest.clearAllMocks(); // Clear mock history before each test
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Ensure the server is closed after tests
  });

  it('should create a waste request with valid data', async () => {
    const requestData = {
      items: [{ category: 'Plastic', quantity: 2, points: 2 }],
      userEmail: 'test@example.com',
    };

    // Mock the save method to return the same data structure as newWasteRequest
    WasteRequest.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: 'mocked-id', // Add any other fields you need
        items: requestData.items,
        userEmail: requestData.userEmail,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    }));

    const response = await request(app)
      .post('/api/v1/wasteRequest')
      .send(requestData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Waste request submitted successfully!');
    expect(response.body.data).toBeDefined();
    // expect(response.body.data.items).toEqual(requestData.items);
    // expect(response.body.data.bulkCategories.userEmail).toEqual(requestData.userEmail);
  });

  it('should return an error if no items are provided', async () => {
    const requestData = {
      items: [],
      userEmail: 'test@example.com',
    };

    const response = await request(app)
      .post('/api/v1/wasteRequest')
      .send(requestData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Please provide at least one waste item.');
  });

  it('should return an error if no userEmail is provided', async () => {
    const requestData = {
      items: [{ category: 'Plastic', quantity: 2, points: 10 }],
      userEmail: '',
    };

    const response = await request(app)
      .post('/api/v1/wasteRequest')
      .send(requestData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Email is Required');
  });
});
