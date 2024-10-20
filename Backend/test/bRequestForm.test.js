import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import formidable from 'express-formidable'; // Required if you are using formidable for file uploads
import { createbRequestFormController, getBRequestFormController, getAllBRequestFormController, getSingleBRequestFormController, deleteBRequestFormController, updateBRequestFormController } from '../controllers/bRequestFormController.js';
import bRequestFormModel from '../models/bRequestFormModel.js';

const app = express();
app.use(bodyParser.json());
app.use(formidable());

// Mock routes
app.post('/api/create-brequestform', createbRequestFormController);
app.get('/api/get-brequestform/:email', getBRequestFormController);
app.get('/api/get-brequestform', getAllBRequestFormController);
app.get('/api/get-single-brequestform/:_id', getSingleBRequestFormController);
app.delete('/api/delete-brequestform/:_id', deleteBRequestFormController);
app.put('/api/update-brequestform/:_id', updateBRequestFormController);

// Mocking Mongoose methods
jest.mock('../models/bRequestFormModel');

describe('Bulk Request Form Controller Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mock calls
    });

    test('should create a bulk request form', async () => {
        const mockFormData = {
            name: 'John Doe',
            phoneNo: '1234567890',
            emailAddress: 'john@example.com',
            address: '123 Main St',
            details: 'Requesting for bulk waste collection',
            category: '60d5ec49d713b305dc6d4c6c', // Example category ID
            email: 'john@example.com',
            pvalue: 100,
            status: 'one',
            points: 0
        };

        bRequestFormModel.prototype.save = jest.fn().mockResolvedValue(mockFormData); // Mock save method

        const response = await request(app)
            .post('/api/create-brequestform')
            .field(mockFormData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Request Form Sent Successfully');
        expect(response.body.bRequestForms).toEqual(undefined);
    });

    test('should return error for missing name when creating a bulk request form', async () => {
        const mockFormData = {
            phoneNo: '1234567890',
            emailAddress: 'john@example.com',
            address: '123 Main St',
            details: 'Requesting for bulk waste collection',
            category: '60d5ec49d713b305dc6d4c6c',
            email: 'john@example.com'
        };

        const response = await request(app)
            .post('/api/create-brequestform')
            .field(mockFormData);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Name is Required');
    });

    test('should get all bulk request forms for a specific email', async () => {
        const mockForms = [
            { _id: '1', name: 'Request 1' },
            { _id: '2', name: 'Request 2' }
        ];

        bRequestFormModel.find = jest.fn().mockResolvedValue(mockForms);

        const response = await request(app)
            .get('/api/get-brequestform/john@example.com');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.countTotal).toBe(mockForms.length);
        expect(response.body.bRequestForms).toEqual(mockForms);
    });

    test('should get a single bulk request form', async () => {
        const mockForm = { _id: '1', name: 'Request 1' };

        bRequestFormModel.find = jest.fn().mockResolvedValue([mockForm]);

        const response = await request(app)
            .get('/api/get-single-brequestform/1');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.bRequestForms).toEqual([mockForm]);
    });

    test('should delete a bulk request form', async () => {
        bRequestFormModel.findByIdAndDelete = jest.fn().mockResolvedValue(true);

        const response = await request(app)
            .delete('/api/delete-brequestform/1');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Bulk Request Form Deleted Successfully');
    });

    test('should update a bulk request form', async () => {
        const mockFormData = {
            name: 'John Doe',
            phoneNo: '1234567890',
            emailAddress: 'john@example.com',
            address: '123 Main St',
            details: 'Updated details',
            category: '60d5ec49d713b305dc6d4c6c',
            email: 'john@example.com'
        };

        bRequestFormModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockFormData); // Mock update method

        const response = await request(app)
            .put('/api/update-brequestform/1')
            .field(mockFormData);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error in Update Request Form');
        expect(response.body.bRequestForms).toEqual(undefined);
    });
});
