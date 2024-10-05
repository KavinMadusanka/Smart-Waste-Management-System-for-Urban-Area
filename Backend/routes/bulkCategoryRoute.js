import express from "express";
import { createBulkCategoryController, getAllBulkCategoryController } from "../controllers/BulkCategoryController.js";
import formidable from 'express-formidable';

export const router = express.Router();

//routes
// create bulk category
router.post('/create-bulkcategory',formidable(),createBulkCategoryController);
// get all bulk categories
router.get('/get-bulkCategory',getAllBulkCategoryController);