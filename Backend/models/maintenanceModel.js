import mongoose from "mongoose";

// Define the schema for the 'maintenance' collection
const maintenanceSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    issueDescription: {
        type: String,
        required: true
    },
    objectType: {
        type: String,
        required: true,  // e.g., "Waste Bin", "Sensor"
        enum: ['Waste Bin', 'Sensor', 'Lid', 'Other'] // You can define the expected types here
    },
    material: {
        type: String,
        required: true,  // e.g., "Plastic", "Metal"
        enum: ['Plastic', 'Metal', 'Composite', 'Other'] // List the material types
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
export default mongoose.model('Maintenance', maintenanceSchema);


