import express from 'express';
import { createWasteRequest } from '../controllers/wasteRequestController.js'; // Import the controller

const router = express.Router();

// Route to handle waste request submission
router.post('/submit-waste-request', createWasteRequest);

export default router;
