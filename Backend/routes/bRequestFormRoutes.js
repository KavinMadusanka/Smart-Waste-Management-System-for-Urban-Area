import express from 'express'
import { createbRequestFormController, deleteBRequestFormController, getAllBRequestFormController, getBRequestFormController, getSingleBRequestFormController, updateBRequestFormController } from '../controllers/bRequestFormController.js'
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

export default router