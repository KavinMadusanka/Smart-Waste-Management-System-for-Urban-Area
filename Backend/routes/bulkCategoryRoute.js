import express from "express";
import { bulkCategoryPhotoController, createBulkCategoryController, deleteBulkCategoryController, getAllBulkCategoryController, getSingleBulkCategoryController } from "../controllers/BulkCategoryController.js";
import formidable from 'express-formidable';

export const router = express.Router();

//routes
// create bulk category
router.post('/create-bulkcategory',formidable(),createBulkCategoryController);
// get all bulk categories
router.get('/get-bulkCategory',getAllBulkCategoryController);
// get single bulk category
router.get('/get-single-product/:slug', getSingleBulkCategoryController);
// get photo
router.get('/bulkcategory-photo/:cid',bulkCategoryPhotoController);
// delete bulk category
router.delete('/delete-bulkCategory/:cid',deleteBulkCategoryController);