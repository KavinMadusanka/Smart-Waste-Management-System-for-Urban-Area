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