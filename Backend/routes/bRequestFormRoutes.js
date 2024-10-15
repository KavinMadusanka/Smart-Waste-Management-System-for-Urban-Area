import express from 'express'
import { completeBRequestFormStatusController, createbRequestFormController, deleteBRequestFormController, getAllBRequestFormController, getBRequestFormController, getSingleBRequestFormController, updateBRequestFormController, updateBRequestFormStatusController, updatePvalueAndStatusController } from '../controllers/bRequestFormController.js'
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
// Update pvalue, status to "three", and calculate points
router.patch('/update-pvalue-status-points/:_id', formidable(), updatePvalueAndStatusController);
// Update status of bulk request form
router.patch('/update-final-tatus-brequestform/:_id', completeBRequestFormStatusController);


export default router