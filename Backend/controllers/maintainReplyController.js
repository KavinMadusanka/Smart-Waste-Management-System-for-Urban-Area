import Reply from './../models/maintainReplyModel.js'; // Adjust the path as necessary

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
  const { requestId, status, scheduledDate, estimateDuration, repairDescription, assignedTechnician, rejectDescription } = req.body;

  try {
    const reply = new Reply({
      requestId,
      status,
      scheduledDate,
      estimateDuration,
      repairDescription,
      assignedTechnician,
      rejectDescription,
    });

    // Save the reply to the database
    await reply.save();

    // Optionally, update the original request status
    await MaintainRequest.findByIdAndUpdate(requestId, { status: status }, { new: true });

    res.status(201).json({ message: 'Reply created successfully', reply });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ message: 'Error creating reply' });
  }
};
