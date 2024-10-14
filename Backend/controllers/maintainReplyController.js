import mongoose from 'mongoose'; // Ensure mongoose is imported for ObjectId validation
import Reply from './../models/maintainReplyModel.js'; // Adjust the path as necessary
import Maintenance from './../models/maintenanceModel.js'; // This is the correct model for maintenance requests

// Controller to get all replies
export const getAllReplies = async (req, res) => {
  try {
    const replies = await Reply.find().populate('requestId'); // Populate with request details
    res.status(200).json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Error fetching replies' });
  }
};

// Controller to create a new reply for a maintenance request
export const createReply = async (req, res) => {
  try {
    const { requestId, status, scheduledDate, estimateDuration, repairDescription, assignedTechnician, rejectDescription} = req.body;

    // Validate the requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: 'Invalid requestId format' });
    }

    // Check if the maintenance request exists
    const existingRequest = await Maintenance.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    // Validate required fields based on status
    if (status === 'Approved') {
      if (!scheduledDate || !estimateDuration || !repairDescription || !assignedTechnician) {
        return res.status(400).json({ error: 'All fields are required for an approved request.' });
      }
    } else if (status === 'Rejected') {
      if (!rejectDescription) {
        return res.status(400).json({ error: 'Reject description is required for a rejected request.' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid status. Must be either "Approved" or "Rejected".' });
    }

    const newReply = new Reply({
      requestId,
      status,
      scheduledDate: new Date(scheduledDate), // Ensure date is in proper format
      estimateDuration,
      repairDescription,
      assignedTechnician,
      rejectDescription: req.body.rejectDescription || null,
    });

    await newReply.save(); // Save the new reply to the database
    res.status(201).json({ success: true, message: 'Reply created successfully' });
  } catch (error) {
    console.error('Error creating reply:', error); // Log the actual error for debugging
    res.status(500).json({ message: 'Error creating reply', error: error.message }); // Return the specific error message to the client
  }
};
