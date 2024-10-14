import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance', required: true }, // Reference to Maintenance
  status: { type: String, enum: ['Approved', 'Rejected'], required: true },
  scheduledDate: { type: Date, required: function() { return this.status === 'Approved'; } },
  estimateDuration: { type: String, required: function() { return this.status === 'Approved'; } },
  repairDescription: { type: String, required: function() { return this.status === 'Approved'; } },
  assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: 'wasteCollector', required: function() { return this.status === 'Approved'; } }, // Updated to reference 'Technician'
  rejectDescription: { type: String, required: function() { return this.status === 'Rejected'; } },
}, { timestamps: true });

export default mongoose.model('Reply', replySchema);
