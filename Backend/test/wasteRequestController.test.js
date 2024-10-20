// tests/wasteRequestController.test.js

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { createWasteRequest,
  updateWasteRequestStatus,
  getAllWasteRequests,
  getSingleRequest } from '../controllers/wasteRequestController.js';
import WasteRequest from '../models/wasteRequestModel.js'; // Mock this model
import { server, app } from '../server.js';

// const app = express();
// app.use(express.json());

// Set up a mock for the WasteRequest model
jest.mock('../models/wasteRequestModel.js');

// Define the route for waste requests in your mock app
app.post('/api/v1/wasteRequest', createWasteRequest);
app.put('/api/v1/wasteRequest/:id/update-status', updateWasteRequestStatus);
app.get('/api/v1/wasteRequest', getAllWasteRequests);
app.get('/api/v1/wasteRequest/get-SingleRequest/:id', getSingleRequest);

describe('WasteRequest Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Ensure the server is closed after tests
  });

  describe('POST /api/v1/wasteRequest', () => {
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


  describe('PUT /api/v1/wasteRequest/:id/update-status', () => {
    it('should update the status of the waste request', async () => {
      const requestId = 'testId';
      const statusUpdate = { status: 'completed' };

      WasteRequest.findById.mockResolvedValue({
        _id: requestId,
        status: 'pending',
        save: jest.fn().mockResolvedValue({ _id: requestId, status: 'completed' }),
      });

      const response = await request(app)
        .put(`/api/v1/wasteRequest/${requestId}/update-status`)
        .send(statusUpdate);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Status updated successfully');
    });

    it('should return an error if the waste request is not found', async () => {
      const requestId = 'invalidId';
      WasteRequest.findById.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/v1/wasteRequest/${requestId}/update-status`)
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Waste request not found');
    });
  });

  describe('GET /api/v1/wasteRequest', () => {
    it('should return all waste requests', async () => {
      const wasteRequests = [
        { _id: '1', items: [{ category: 'Plastic', quantity: 2, points: 10 }], status: 'completed' },
        { _id: '2', items: [{ category: 'Glass', quantity: 3, points: 15 }], status: 'pending' },
      ];

      WasteRequest.find.mockResolvedValue(wasteRequests);

      const response = await request(app).get('/api/v1/wasteRequest');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should return a 404 if no waste requests are found', async () => {
      WasteRequest.find.mockResolvedValue([]);

      const response = await request(app).get('/api/v1/wasteRequest');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No waste requests found');
    });
  });

  describe('GET /api/v1/wasteRequest/get-SingleRequest/:id', () => {
    it('should return a single waste request', async () => {
      const requestId = 'testId';
      const wasteRequest = {
        _id: requestId,
        items: [{ category: 'Plastic', quantity: 2, points: 10 }],
        userEmail: 'test@example.com',
      };

      WasteRequest.findById.mockResolvedValue(wasteRequest);

      const response = await request(app)
        .get(`/api/v1/wasteRequest/get-SingleRequest/${requestId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.WasteReq._id).toBe(requestId);
      expect(response.body.userEmail).toBe('test@example.com');
    });

    it('should return a 404 if the waste request is not found', async () => {
      const requestId = 'invalidId';
      WasteRequest.findById.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/v1/wasteRequest/get-SingleRequest/${requestId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Request not found');
    });
  });


});
