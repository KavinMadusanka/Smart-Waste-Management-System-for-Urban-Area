import { error } from "console";
import fs from 'fs'
import slugify from 'slugify';
import RewardModel from "../models/RewardModel.js";

// create bulk category
export const createReward = async (req,res) => {
    try {
        const {name,slug,point,description} = req.fields
        const {photo} = req.files
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !point:
                return res.status(500).send({error:'point is Required'})
            case !description:
                return res.status(500).send({error:'Description is Required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:'Photo is Required and less than 1MB'})
        }
        const bulkCategories = new RewardModel({...req.fields, slug:slugify(name)})
        if(photo){
            bulkCategories.photo.data = fs.readFileSync(photo.path)
            bulkCategories.photo.contentType = photo.type
        }
        await bulkCategories.save()
        res.status(201).send({
            success:true,
            message:'Reward Created Successfully',
            bulkCategories
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Creating Reqards'
        })
    }
}

// get all bulk categories
export const getAllReward = async (req, res) => {
    try {
        // Correctly call the model to fetch bulk categories
        const bulkCategories = await RewardModel.find({});  // Use bulkCategoryModel here
        
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
export const getSingleRewaard = async (req, res) => {
    const { slug } = req.params;
    try {
        const bulkCategory = await RewardModel.findOne({ slug }).select("-photo");
        
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
export const RewardPhotoController = async (req, res) => {
    try {
        // Ensure the request parameter is defined and valid
        const bulkCategory = await RewardModel.findById(req.params.cid).select("photo");

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

// delete bulk category
export const deleteReward = async (req, res) => {
    try {
        // Find the bulk category by the correct parameter (cid)
        const bulkCategory = await RewardModel.findByIdAndDelete(req.params.cid).select("-photo");

        // If no bulk category is found, return 404
        if (!bulkCategory) {
            return res.status(404).send({
                success: false,
                message: 'Bulk Category not found',
            });
        }

        // If bulk category was deleted successfully
        res.status(200).send({
            success: true,
            message: 'Bulk Category Deleted Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting Bulk Category',
            error: error.message,
        });
    }
};

// update bulk category
export const updateReward = async (req, res) => {
    try {
        const { name, slug, point, description } = req.fields;
        const { photo } = req.files;
        
        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' });
            case !point:
                return res.status(500).send({ error: 'Description is Required' });
            case !description:
                return res.status(500).send({error:'Description is Required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is Required and less than 1MB' });
        }

        // Update the bulk category
        const bulkCategory = await RewardModel.findByIdAndUpdate(
            req.params.cid, 
            { ...req.fields, slug: slugify(name) }, 
            { new: true } // To return the updated document
        );

        // If the category was not found
        if (!bulkCategory) {
            return res.status(404).send({
                success: false,
                message: 'Bulk Category not found',
            });
        }

        // If a new photo is uploaded, update it
        if (photo) {
            bulkCategory.photo.data = fs.readFileSync(photo.path);
            bulkCategory.photo.contentType = photo.type;
        }

        // Save the updated document
        await bulkCategory.save();

        // Send response
        res.status(201).send({
            success: true,
            message: 'Bulk Category Updated Successfully',
            bulkCategory,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Updating Bulk Category',
        });
    }
};
