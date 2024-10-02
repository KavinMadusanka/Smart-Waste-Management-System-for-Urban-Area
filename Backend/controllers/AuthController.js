import { comparePassword, hashPassword } from "../helpers/AuthHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"


export const registerController = async (req, res) => {
    try{
        const { firstName, 
                lastName, 
                email, 
                password, 
                contactNumber, 
                address, 
                accountType, 
                wasteBinType
            } = req.body;

    //validation
    if (!firstName) {
        return res.send({ message: "First name name is Required" });
    }
    if (!lastName) {
        return res.send({ message: "Last name name is Required" });
    }
    if (!email) {
        return res.send({ message: "Full name name is Required" });
    }
    if (!password) {
        return res.send({ message: "Full name name is Required" });
    }
    if (!contactNumber) {
        return res.send({ message: "Contact number is Required" });
    }
    if (!address) {
        return res.send({ message: "Address is Required" });
    }
    if (!accountType) {
        return res.send({ message: "Account type is Required" });
    }
    if (!wasteBinType) {
        return res.send({ message: "Waste bin type is Required" });
    }

    //check user
    const existingUser = await userModel.findOne({email})

    //existing user
    if(existingUser){
        return res.status(200).send({
            success:false,
            message:'Already Registered customer,Please login'
        })
    }

    //register user
    const hashedPassword = await hashPassword(password)
    //save
    const user = await new userModel({
        firstName,
        lastName,
        email,
        password,
        contactNumber,
        address,
        accountType,
        wasteBinType
    }).save()

    res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
    })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in registration",
            error
        })
    }

}