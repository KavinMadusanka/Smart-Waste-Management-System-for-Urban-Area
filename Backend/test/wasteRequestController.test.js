// tests/wasteRequestController.test.js

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { createWasteRequest } from '../controllers/wasteRequestController.js';
import WasteRequest from '../models/wasteRequestModel.js'; // Mock this model
import { server, app } from '../server.js';

const app = express();
app.use(express.json());

// Set up a mock for the WasteRequest model
jest.mock('../models/wasteRequestModel.js');

// Define the route for waste requests in your mock app
app.post('/api/v1/wasteRequest', createWasteRequest);

describe('POST /api/v1/wasteRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should create a waste request with valid data', async () => {
    const requestData = {
      items: [{ category: 'Plastic', quantity: 2, points: 10 }],
      userEmail: 'test@example.com',
    };

    WasteRequest.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(requestData),
    }));

    const response = await request(app)
      .post('/api/v1/wasteRequest')
      .send(requestData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Waste request submitted successfully!');
    expect(response.body.data.items).toEqual(requestData.items);
    expect(response.body.data.userEmail).toEqual(requestData.userEmail);
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
