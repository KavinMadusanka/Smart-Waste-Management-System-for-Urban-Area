import express from 'express';
import { createMaintenanceRequest, deleteMaintenanceRequest, getAllMaintenanceRequests, getAllMaintenanceRequestsForUser, getMaintenanceRequestById, getUserMaintenanceRequestsWithReplies, updateMaintenanceRequest } from '../controllers/maintenanceController.js';
import formidable from 'express-formidable';


export const router = express.Router();

// Define routes and link to controller functions
router.post('/create-maintenance', createMaintenanceRequest);

// In your routes file, define the new route
router.get('/get-user-maintenance/:email', getAllMaintenanceRequestsForUser);

// Route to get all maintenance requests and replies for a specific user
router.get('/get-user-maintenance-replies/:email', getUserMaintenanceRequestsWithReplies);

router.get('/get-maintenance', getAllMaintenanceRequests);

router.get('/get-single-maintenance/:id', getMaintenanceRequestById);

router.put('/update-maintenance/:id', updateMaintenanceRequest);

router.delete('/delete-maintenance/:id', deleteMaintenanceRequest);


