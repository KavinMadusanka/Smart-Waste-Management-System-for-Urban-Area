import bRequestFormModel from '../models/bRequestFormModel.js';
import fs from 'fs'
import slugify from 'slugify';

//create bulk request form
export const createbRequestFormController = async (req,res) => {
    try {
        const {name,slug,phoneNo,emailAddress,address,details,category,email} = req.fields

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !phoneNo:
                return res.status(500).send({error:'Phone Number is Required'})
            case !emailAddress:
                return res.status(500).send({error:'E mail is Required'})
            case !address:
                return res.status(500).send({error:'Address is Required'})
            case !details:
                return res.status(500).send({error:'Details are Required'})
            case !category:
                return res.status(500).send({error:'Category is Required'})
            case !email:
                return res.status(500).send({error:'E mail is Required'})
        }

        const bRequestForms = new bRequestFormModel({...req.fields,slug:slugify(name)})
        await bRequestForms.save()
        res.status(201).send({
            success:true,
            message:'Request Form Sent Successfully',
            bRequestForms
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Sending Request Form'
        })
    }
};

// get all bulk request forms (email)
export const getBRequestFormController = async (req,res) => {
    const {email} = req.params;
    try{
        const bRequestForms = await bRequestFormModel.find({email});
        res.status(200).send({
            success:true,
            countTotal:bRequestForms.length,
            message:"All Bulk Request Forms",
            bRequestForms,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in getting Bulk Request Forms',
            error: error.message
        })
    }
};

// get all bulk request forms
export const getAllBRequestFormController = async (req,res) => {
    try{
        const bRequestForms = await bRequestFormModel.find({});
        res.status(200).send({
            success:true,
            countTotal:bRequestForms.length,
            message:"All Bulk Request Forms",
            bRequestForms,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in getting Bulk Request Forms',
            error: error.message
        })
    }
};

// get single Bulk Request Form
export const getSingleBRequestFormController = async (req,res) => {
    const {_id} = req.params
    try {
        const bRequestForms = await bRequestFormModel.find({_id});
        res.status(200).send({
            success:true,
            message:'Single Bulk Request Form Fetched',
            bRequestForms,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting single Bulk Request Form',
            error
        })
    }
};

// delete Bulk Request Form
export const deleteBRequestFormController = async (req,res) => {
    try {
        await bRequestFormModel.findByIdAndDelete(req.params._id);
        res.status(200).send({
            success:true,
            message:'Bulk Request Form Deleted Successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while deleting Bulk Request Form',
            error
        })
    }
};

// update Bulk Request Form
export const updateBRequestFormController = async (req,res) => {
    try {
        const {name,slug,phoneNo,emailAddress,address,details,category,email} = req.fields

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !phoneNo:
                return res.status(500).send({error:'Phone Number is Required'})
            case !emailAddress:
                return res.status(500).send({error:'E mail is Required'})
            case !address:
                return res.status(500).send({error:'Address is Required'})
            case !details:
                return res.status(500).send({error:'Details are Required'})
            case !category:
                return res.status(500).send({error:'Category is Required'})
            case !email:
                return res.status(500).send({error:'E mail is Required'})
        }

        const bRequestForms = await bRequestFormModel.findByIdAndUpdate(req.params._id, {...req.fields, slug:slugify(name)}, {new:true})
        await bRequestForms.save()
        res.status(201).send({
            success:true,
            message:'Request Form Updated Successfully',
            bRequestForms
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Update Request Form'
        })
    }
};