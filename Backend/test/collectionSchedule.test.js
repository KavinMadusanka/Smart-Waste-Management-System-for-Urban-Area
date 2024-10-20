// test/collectionSchedule.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import collectionScheduleModel from '../models/collectionScheduleModel';
import wasteCollectorModel from '../models/wasteCollectorModel';
import { server, app } from '../server.js'; // Import both server and app

jest.mock('../models/collectionScheduleModel');
jest.mock('../models/wasteCollectorModel');

describe('Create Collection Schedule', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Close the Express server
  });

  it('should create a new schedule', async () => {
    const mockCollector = { _id: '12345', firstName: 'Jane', lastName: 'Doe' };

    wasteCollectorModel.findById.mockResolvedValue(mockCollector);

    const newSchedule = {
      area: 'Area 1',
      pickupDate: new Date(),
      pickupTime: '09:00 AM',
      binType: 'General',
      assignedCollector: '12345',
    };

    collectionScheduleModel.prototype.save = jest.fn().mockResolvedValue(newSchedule);

    const res = await request(app)
      .post('/api/v1/collectionSchedule/create-schedule') 
      .send(newSchedule);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Schedule created successfully');
  });

  it('should return error if assigned collector is invalid', async () => {
    wasteCollectorModel.findById.mockResolvedValue(null);

    const newSchedule = {
      area: 'Area 1',
      pickupDate: new Date(),
      pickupTime: '09:00 AM',
      binType: 'General',
      assignedCollector: 'invalidId', // Invalid ID
    };

    const res = await request(app)
      .post('/api/v1/collectionSchedule/create-schedule') 
      .send(newSchedule);

    expect(res.statusCode).toEqual(400); // Change this to the expected status code from your controller
    expect(res.body.message).toBe('Invalid Waste Collector');
  });
});
