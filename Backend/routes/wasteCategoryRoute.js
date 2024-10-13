import express from "express";
import { createWasteCategoryController, getAllWasteCategoryController, getSingleWasteCategoryController, wasteCategoryPhotoController, deleteWasteCategoryController, updateWasteCategoryController } from "../controllers/wasteCategoryController.js";
import formidable from 'express-formidable';

export const router = express.Router();

//routes
// create bulk category
router.post('/create-wasteCategory',formidable(),createWasteCategoryController);
// get all bulk categories
router.get('/get-wasteCategory',getAllWasteCategoryController);
// get single bulk category
router.get('/get-single-product/:slug', getSingleWasteCategoryController);
// get photo
router.get('/watecategory-photo/:cid',wasteCategoryPhotoController);
// delete bulk category
router.delete('/delete-wasteCategory/:cid',deleteWasteCategoryController);
// update bulk category
router.put('/update-wasteCategory/:cid',formidable(),updateWasteCategoryController);