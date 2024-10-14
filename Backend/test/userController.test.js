// test/userController.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import userModel from '../models/userModel';
import { app, server } from '../server.js'; // Import both the app and server instances

// Mock Mongoose model to avoid hitting the database in unit tests
jest.mock('../models/userModel');

describe('User Registration', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Ensure the server is closed after tests
  });

  it('should register a new user', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
      contactNumber: '1234567890',
      address: {
        street: '123 Street',
        city: 'City',
        postalCode: '12345',
        country: 'Country',
      },
      wasteBinType: 'General',
    };

    userModel.prototype.save = jest.fn().mockResolvedValue(newUser);

    const res = await request(app)
      .post('/api/v1/auth/registerUser') // Ensure this endpoint matches your routing
      .send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User Register Successfully');
  });
});
