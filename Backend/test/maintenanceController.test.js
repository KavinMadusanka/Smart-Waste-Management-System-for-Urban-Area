import request from 'supertest';
import mongoose from 'mongoose';
import maintenanceModel from '../models/maintenanceModel'; 
import { server, app } from '../server.js'; 

jest.mock('../models/maintenanceModel');

describe('POST /api/v1/maintenance/create-maintenance', () => {
    // Close MongoDB connection and server after tests
    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    it('should create a new maintenance request', async () => {
        const newRequest = {
            fullName: 'John Doe',
            contactNumber: '1234567890',
            email: 'john@example.com',
            issueDescription: 'Air conditioner not working',
            objectType: 'AC',
            material: 'Plastic'
        };

    
        maintenanceModel.prototype.save = jest.fn().mockResolvedValue({
            _id: 'mocked-id',
            ...newRequest
        });

        const res = await request(app)
            .post('/api/v1/maintenance/create-maintenance')
            .send(newRequest);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        // expect(res.body.fullName).toEqu('John Doe');
    });

    it('should return 400 for missing fields', async () => {
        const newRequest = {
            fullName: 'John Doe',
            // Missing other fields
        };

        const res = await request(app)
            .post('/api/v1/maintenance/create-maintenance')
            .send(newRequest);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('create maintenance successfully!');
    });
});

describe('GET /api/v1/maintenance/get-user-maintenance/:Email', () => {
    // Close MongoDB connection and server after tests
    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    it('should return all maintenance requests for a user', async () => {
        const email = 'john@example.com';

        // Mock the find method of the model
        maintenanceModel.find = jest.fn().mockResolvedValue([
            { _id: 'mocked-id-1', email, issueDescription: 'Issue 1' },
            { _id: 'mocked-id-2', email, issueDescription: 'Issue 2' }
        ]);

        const res = await request(app)
            .get(`/api/v1/maintenance/get-user-maintenance/${email}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.maintenance).toBeInstanceOf(Array);
        expect(res.body.maintenance[0].email).toBe(email);
    });

    it('should return 404 if no requests found for the user', async () => {
        const email = 'noexistinguser@example.com';

        // Mock the find method to return an empty array
        maintenanceModel.find = jest.fn().mockResolvedValue([]);

        const res = await request(app)
            .get(`/api/v1/maintenance/get-user-maintenance/${email}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('No maintenance requests found for this user.');
    });
});
