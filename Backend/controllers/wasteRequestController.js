import WasteRequest from '../models/wasteRequestModel.js'; // Import the model
import QRCode from 'qrcode';

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

    console.log(newWasteRequest._id);

    // Generate QR Code with the waste request ID
    const requestUrl = `https://localhost:8082/api/v1/wasteRequest/get-SingleRequest/${newWasteRequest._id}`;
    const qrCodeUrl = await QRCode.toDataURL(requestUrl);

    // Update the waste request with the QR Code URL
    newWasteRequest.qrCode = qrCodeUrl;
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


export const updateWasteRequestStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      const wasteRequest = await WasteRequest.findById(id);
      if (!wasteRequest) {
          return res.status(404).json({ success: false, message: 'Waste request not found' });
      }

      wasteRequest.status = status; // Update status
      await wasteRequest.save();

      res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
      console.error('Error updating waste request status:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllWasteRequests = async (req, res) => {
  try {
      const wasteRequests = await WasteRequest.find(); // Fetch all waste requests

      if (!wasteRequests || wasteRequests.length === 0) {
          return res.status(404).json({ success: false, message: 'No waste requests found' });
      }

      res.status(200).json({ success: true, data: wasteRequests });
  } catch (error) {
      console.error('Error fetching waste requests:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};

// get single bulk category
export const getSingleRequest = async (req, res) => {
  const { id } = req.params;
  try {
      const WasteReq = await WasteRequest.findById(id);
      
      if (!WasteReq) {
          return res.status(404).send({
              success: false,
              message: "Request not found",
          });
      }

      const userEmail = WasteReq.userEmail;

      res.status(200).send({
          success: true,
          message: 'Single request Fetched',
          WasteReq,
          userEmail,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: 'Error while getting single request',
          error: error.message,
      });
  }
};