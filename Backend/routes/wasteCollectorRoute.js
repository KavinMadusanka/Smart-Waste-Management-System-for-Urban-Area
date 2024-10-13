import express from 'express';
import { getWasteCollectors } from './../controllers/wasteController.js'; // Adjust the import path as necessary

const router = express.Router();

// Route to get all waste collectors
router.get('/get-waste-collectors', getWasteCollectors);
