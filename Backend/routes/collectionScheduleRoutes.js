import express from 'express'
import { requireSignIn } from '../middlewares/AuthMiddleware.js'
import { createCollectionSchedule, getAllCollectionSchedules, getCollectionScheduleById,  getScheduleByWasteCollectorController,  updateCollectionSchedule, updateScheduleStatus } from './../controllers/collectionScheduleController.js';

//router object
const router = express.Router()

//routing path
//create collection schedule
router.post('/create-schedule',createCollectionSchedule )

//update collection schedule
router.put('/update-schedule/:id', updateCollectionSchedule )

//get all collection schedules
router.get('/get-schedules',getAllCollectionSchedules)

//get collection schedule by ID
router.get('/get-schedules/:id', getCollectionScheduleById );

//get schedule by collector
router.get('/get-schedule-by-collector/:assignedCollectorId',getScheduleByWasteCollectorController )

// Define the PUT route for updating schedule status
router.put('/update-status/:id', updateScheduleStatus );

export default router