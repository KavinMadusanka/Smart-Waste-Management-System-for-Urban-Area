import express from 'express'
import { completeBRequestFormStatusController, createbRequestFormController, deleteBRequestFormController, getAllBRequestFormController, getBRequestFormController, getSingleBRequestFormController, updateBRequestFormController, updateBRequestFormPointsController, updateBRequestFormStatusController } from '../controllers/bRequestFormController.js'
import formidable from 'express-formidable';

const router = express.Router()

//routes
// create bulk request form
router.post('/create-brequestform',formidable(),createbRequestFormController);
//update bulk request form
router.put('/update-brequestform/:_id',formidable(),updateBRequestFormController);
// get bulk request forms
router.get('/get-brequestform/:email',getBRequestFormController);
router.get('/get-brequestform',getAllBRequestFormController);
// single bulk request form
router.get('/get-single-brequestform/:_id',getSingleBRequestFormController);
// delete bulk request form
router.delete('/delete-brequestform/:_id',deleteBRequestFormController);
// Update status of bulk request form
router.patch('/update-status-brequestform/:_id', updateBRequestFormStatusController);
// Update points and status of bulk request form
router.patch('/update-points-brequestform/:_id', formidable(), updateBRequestFormPointsController);
// Update status of bulk request form
router.patch('/update-final-tatus-brequestform/:_id', completeBRequestFormStatusController);

export default router