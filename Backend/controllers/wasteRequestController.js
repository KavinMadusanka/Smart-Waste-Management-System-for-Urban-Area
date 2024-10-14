import WasteRequest from '../models/wasteRequestModel.js'; // Import the model

// Create a new waste request
export const createWasteRequest = async (req, res) => {
  try {
    const { items, userEmail } = req.body;
    console.log('Items received:', items);
    // Ensure that at least one item is provided
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one waste item.' });
    }
    if (!userEmail){
        return res.status(400).json({ success: false, message: 'Email is Required' });
    }

    // Create the waste request
    const newWasteRequest = new WasteRequest({
      items: items.map(item => ({
        category: item.category,
        quantity: item.quantity,
        points: item.points
      })),
      userEmail: userEmail, // Assuming the userId is provided in the request
    });

    // Save the request to the database
    await newWasteRequest.save();

    res.status(201).json({
        success: true,
        message: 'Waste request submitted successfully!',
        data: newWasteRequest, // Return the saved request data
      });
  } catch (error) {
    console.error('Error submitting waste request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting the waste request.',
    });
  }
};
