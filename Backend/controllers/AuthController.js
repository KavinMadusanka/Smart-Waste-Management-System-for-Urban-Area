import { comparePassword, hashPassword } from "../helpers/AuthHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"
import wasteCollectorModel from "../models/wasteCollectorModel.js";

//register user
export const userRegisterController = async(req,res) => {
    try{
        const {firstName,
               lastName,
               email,
               password,
               contactNumber,
               address,
               wasteBinType,             
            } = req.body

    //validation
    if (!firstName) {
        return res.send({ message: "Full name name is Required" });
    }
    if (!lastName) {
        return res.send({ message: "Full name name is Required" });
    }
    if (!email) {
        return res.send({ message: "Email is Required" });
    }
    if (!password) {
        return res.send({ message: "DOB is Required" });
    }
    if (!contactNumber) {
        return res.send({ message: "Phone Number is Required" });
    }
    if (!address) {
        return res.send({ message: "Residential Address is Required" });
    }
    if (!wasteBinType) {
        return res.send({ message: "Password is Required" });
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
               wasteBinType,
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
            message:'Error in Registration',
            error
        })
    }
};


// Waste Collector Registration Controller
export const wasteCollectorRegisterController = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        contactNumber,
        address,
      } = req.body;

      const hashedPassword = await hashPassword(password)

      // Create the shop object with all details and binary image
      const shop = await new wasteCollectorModel({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        contactNumber,
        address,
      }).save();
  
      res.status(201).json({
        success: true,
        message: 'Waste Collector registered successfully',
        shop,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error in registration',
      });
    }
  };
  




//login for customer,user and admin  
export const LoginController = async (req, res) => {
  
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).send({ success: false, message: "Email and password are required" });
      }
  
      // Check in users table
      let user = await userModel.findOne({ email });
      if (user) {
        const match = await comparePassword(password, user.password);
        if (match) {
          const token = JWT.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
          return res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            role: user.role,
            user,
          });
        }
      }
  
      // Check in shops table
      let wasteCollector = await wasteCollectorModel.findOne({ email });
      if (wasteCollector) {
        const match = await comparePassword(password, wasteCollector.password);
        if (match) {
          const token = JWT.sign({ _id: wasteCollector._id, role: 2 }, process.env.JWT_SECRET, { expiresIn: "7d" });
          return res.status(200).send({
            success: true,
            message: "wasteCollector login successful",
            token,
            role: 2,
            wasteCollector,
          });
        }
      }
  
      // If no match found
      return res.status(400).send({ success: false, message: "Invalid email or password" });
      
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).send({ success: false, message: "Error during login", error });
    }
  };


export const getAllWasteCollectors = async (req, res) => {
  try {
      const wasteCollector = await wasteCollectorModel.find(); // Fetch all shops from the database
      res.status(200).send({
          success: true,
          wasteCollector,
      });
  } catch (error) {
      console.error(error);
      res.status(500).send({
          success: false,
          message: 'Error fetching shops',
          error,
      });
  }
};


// Update user points by email
export const updateUserPoints = async (req, res) => {
  const userEmail = req.params.email; // Get user email from the URL parameters
  const { points } = req.body; // Get points from request body

  try {
      // Ensure points is a number
      if (typeof points !== 'number') {
          return res.status(400).json({ success: false, message: 'Points must be a number' });
      }

      // Find the user by email and update their points
      const updatedUser = await userModel.findOneAndUpdate(
          { email: userEmail }, // Query by email
          { $inc: { points } }, // Increment the user's points
          { new: true } // Return the updated user
      );

      if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
      console.error('Error updating user points:', error.message); // Log the error message
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};