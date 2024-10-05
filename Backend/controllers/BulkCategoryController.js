import { error } from "console";
import fs from 'fs'
import slugify from 'slugify';
import bulkCategoryModel from "../models/bulkCategoryModel.js";

// create bulk category
export const createBulkCategoryController = async (req,res) => {
    try {
        const {name,slug,description,additionalDescription,instructions,benefits} = req.fields
        const {photo} = req.files
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'Description is Required'})
            case !additionalDescription:
                return res.status(500).send({error:'Additional Description is Required'})
            case !instructions:
                return res.status(500).send({error:'Instructions are Required'})
            case !benefits:
                return res.status(500).send({error:'Benefits are Required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:'Photo is Required and less than 1MB'})
        }
        const bulkCategories = new bulkCategoryModel({...req.fields, slug:slugify(name)})
        if(photo){
            bulkCategories.photo.data = fs.readFileSync(photo.path)
            bulkCategories.photo.contentType = photo.type
        }
        await bulkCategories.save()
        res.status(201).send({
            success:true,
            message:'Product Created Successfully',
            bulkCategories
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Creating Bulk Category'
        })
    }
}

// get all bulk categories
export const getAllBulkCategoryController = async (req, res) => {
    try {
        // Correctly call the model to fetch bulk categories
        const bulkCategories = await bulkCategoryModel.find({});  // Use bulkCategoryModel here
        
        res.status(200).send({
            success: true,
            countTotal: bulkCategories.length,  // Corrected from 'products.length' to 'bulkCategories.length'
            message: "All Bulk Categories",
            bulkCategories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting Bulk Categories',
            error: error.message,
        });
    }
};

// get single bulk category
export const getSingleBulkCategoryController = async (req, res) => {
    const { slug } = req.params;
    try {
        const bulkCategory = await bulkCategoryModel.findOne({ slug }).select("-photo");
        
        if (!bulkCategory) {
            return res.status(404).send({
                success: false,
                message: "Bulk Category not found",
            });
        }

        res.status(200).send({
            success: true,
            message: 'Single Bulk Category Fetched',
            bulkCategory,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting single bulk category',
            error: error.message,
        });
    }
};

// get photo
export const bulkCategoryPhotoController = async (req, res) => {
    try {
        // Ensure the request parameter is defined and valid
        const bulkCategory = await bulkCategoryModel.findById(req.params.cid).select("photo");

        // Check if bulkCategory was found
        if (!bulkCategory) {
            return res.status(404).send({
                success: false,
                message: 'Bulk Category not found',
            });
        }

        // Check if photo data exists
        if (bulkCategory.photo && bulkCategory.photo.data) {
            res.set('Content-Type', bulkCategory.photo.contentType);
            return res.status(200).send(bulkCategory.photo.data);
        } else {
            return res.status(404).send({
                success: false,
                message: 'Photo not available',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting photo',
            error: error.message,
        });
    }
};
