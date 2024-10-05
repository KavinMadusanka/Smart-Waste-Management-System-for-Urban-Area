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
        password:hashedPassword,
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

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                success: false,
                message: "Invalid password"
            });
        }

        // Determine role based on account type or admin role
        let role = user.role;  // Default role
        if (role !== 1) {  // If not admin, check account type
            if (user.accountType === 'Resident') {
                role = 'Resident';
            } else if (user.accountType === 'WasteCollector') {
                role = 'Waste Collector';
            }
        }

        // Token generation
        const token = JWT.sign({ _id: user._id, role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Send response
        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role,  // Use the determined role
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);  // Improved error logging
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};


export const getAllWasteCollectors = async (req, res) => {
    try {
        const wasteCollectors = await userModel.find({ accountType: 'Waste Collector' });
        res.status(200).json(wasteCollectors);
    } catch (error) {
        console.error('Error fetching waste collectors:', error); // Log the actual error
        res.status(500).json({ error: 'Failed to fetch waste collectors' });
    }
};
