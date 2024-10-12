import express from 'express';
import { createMaintenanceRequest, deleteMaintenanceRequest, getAllMaintenanceRequests, getMaintenanceRequestById, updateMaintenanceRequest } from '../controllers/maintenanceController.js';
import formidable from 'express-formidable';


export const router = express.Router();

// Define routes and link to controller functions
router.post('/create-maintenance', createMaintenanceRequest);

router.get('/get-maintenance', getAllMaintenanceRequests);

router.get('/get-single-maintenance/:id', getMaintenanceRequestById);

router.put('/update-maintenance/:id', updateMaintenanceRequest);

router.delete('/delete-maintenance/:id', deleteMaintenanceRequest);


