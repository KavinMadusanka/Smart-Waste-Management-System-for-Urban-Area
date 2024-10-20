import express from 'express';
import { createWasteRequest,
    updateWasteRequestStatus,
    getAllWasteRequests,
    getSingleRequest } from '../controllers/wasteRequestController.js'; // Import the controller

const router = express.Router();

// Route to handle waste request submission
router.post('/submit-waste-request', createWasteRequest);
router.get('/all', getAllWasteRequests);
router.get('/get-SingleRequest/:id', getSingleRequest);
router.put('/:id/update-status', updateWasteRequestStatus);

export default router;
