import express from 'express'
import { createCollectionSchedule, getAllCollectionSchedules, getCollectionScheduleById, updateCollectionSchedule } from './../controllers/collectionScheduleController.js';

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

export default router