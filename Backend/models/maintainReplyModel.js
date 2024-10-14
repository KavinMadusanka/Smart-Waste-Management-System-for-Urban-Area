import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance', required: true }, // Updated to reference 'Maintenance'
  status: { type: String, enum: ['Approved', 'Rejected'], required: true },
  scheduledDate: { type: Date, required: function() { return this.status === 'Approved'; } },
  estimateDuration: { type: String, required: function() { return this.status === 'Approved'; } },
  repairDescription: { type: String, required: function() { return this.status === 'Approved'; } },
  assignedTechnician: { type: String, required: function() { return this.status === 'Approved'; } },
  rejectDescription: { type: String, required: function() { return this.status === 'Rejected'; } },
}, { timestamps: true });

export default mongoose.model('Reply', replySchema);
