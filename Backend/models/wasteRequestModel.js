import mongoose from 'mongoose';

// Define the waste request schema
const wasteRequestSchema = new mongoose.Schema({
  items: [
    {
        category: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        points: { 
            type: Number, 
            required: true 
        },
    },
  ],
  userEmail: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('WasteRequest', wasteRequestSchema);
