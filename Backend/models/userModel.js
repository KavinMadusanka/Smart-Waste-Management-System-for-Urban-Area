import mongoose from "mongoose";

// Create User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    accountType: {
        type: String,
        required: true,
        enum: ['Resident', 'WasteCollector']
    },
    wasteBinType: {
        type: String,
        enum: ['General', 'Recyclable'],
        default: 'General'
    },
    role: {
        type: Number,
        default: 0,
    }
});

export default mongoose.model('users', userSchema);
