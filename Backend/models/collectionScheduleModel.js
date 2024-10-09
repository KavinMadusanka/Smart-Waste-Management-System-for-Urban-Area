import mongoose from "mongoose";

// Create Collection Schedule Schema
const collectionScheduleSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true,
        trim: true
    },
    pickupDate: {
        type: Date,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    binType: {
        type: String,
        enum: ['General', 'Recyclable', 'Bulk'],
        required: true
    },
    assignedCollector: {
        type: String,
        // type: mongoose.ObjectId,
        // ref: 'users', // Reference to WasteCollector from the User model
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Missed'],
        default: 'Scheduled'
    },
});

export default mongoose.model('CollectionSchedule', collectionScheduleSchema);
