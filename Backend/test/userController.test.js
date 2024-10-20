import request from 'supertest';
import mongoose from 'mongoose';
import userModel from '../models/userModel';
import { app, server } from '../server.js';

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

  // Test Case 1: Successful User Registration
  it('should register a new user successfully', async () => {
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
      .post('/api/v1/auth/registerUser')
      .send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User Register Successfully');
  });

  // Test Case 2: Missing Required Fields
  it('should return an error if required fields are missing', async () => {
    const incompleteUser = {
      firstName: 'John',
      // lastName is missing
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

    const res = await request(app)
      .post('/api/v1/auth/registerUser')
      .send(incompleteUser);

    expect(res.statusCode).toEqual(200); 
    expect(res.body.success).toBe(undefined);
    expect(res.body.message).toBe('Full name name is Required'); 
  });

  // Test Case 3: User Already Registered
  it('should return an error if the user is already registered', async () => {
    const existingUser = {
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

    // Simulate existing user
    userModel.findOne = jest.fn().mockResolvedValue(existingUser);

    const res = await request(app)
      .post('/api/v1/auth/registerUser')
      .send(existingUser);

    expect(res.statusCode).toEqual(200); // Assuming you return 200 for existing users
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Already Registered customer,Please login');
  });
});
