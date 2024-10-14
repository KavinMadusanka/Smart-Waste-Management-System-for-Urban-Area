// test/userController.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import userModel from '../models/userModel';
import { app, server } from '../server.js'; // Import both the app and server instances
import { comparePassword } from '../helpers/AuthHelper'; // Ensure this path is correct

// Mock Mongoose model and AuthHelper
jest.mock('../models/userModel');
jest.mock('../helpers/AuthHelper');

describe('User Login', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Ensure the server is closed after tests
  });

  it('should login a user with valid credentials', async () => {
    const mockUser = {
      email: 'testuser@example.com',
      password: 'hashedPassword', // Assume this is the hashed password in the database
      role: 0
    };

    // Mock the Mongoose query and password comparison
    userModel.findOne.mockResolvedValue(mockUser);
    comparePassword.mockImplementation((inputPassword, storedPassword) => {
      return inputPassword === '123456'; // Mock implementation for comparing passwords
    });

    const res = await request(app)
      .post('/api/v1/auth/login') // Ensure this endpoint matches your routing
      .send({ email: 'testuser@example.com', password: '123456' });

    // Assertions
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
  });

  it('should return error if login credentials are incorrect', async () => {
    userModel.findOne.mockResolvedValue(null); // Simulate user not found

    const res = await request(app)
      .post('/api/v1/auth/login') // Ensure this endpoint matches your routing
      .send({ email: 'invalid@example.com', password: '123456' });

    // Assertions
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
