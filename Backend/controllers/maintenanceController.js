import Maintenance from '../models/maintenanceModel.js';
import Reply from '../models/maintainReplyModel.js';
import fs from 'fs'

// Create a new maintenance request
export const createMaintenanceRequest = async (req, res) => {
    const { fullName, contactNumber, email, issueDescription, objectType, material } = req.body;

    try {
        // Create a new maintenance request with the provided data
        const newRequest = new Maintenance({
            fullName, 
            contactNumber,
            email,
            issueDescription,
            objectType,
            material
        });

        // Save the request to the database
        const savedRequest = await newRequest.save();

        // Send a success response
        res.status(201).json({success: true,
            message: 'create maintenance successfully!',
            data: savedRequest,});
    } catch (error) {
        // Send an error response in case of failure
        res.status(400).json({ message: error.message });
    }
};

// Get all maintenance requests for a specific user
// Get all maintenance requests for a specific user
export const getAllMaintenanceRequestsForUser = async (req, res) => {
    const { email } = req.params; // Assuming you are getting the email from the request parameters
    try {
        // Fetch all maintenance requests
        const maintenanceRequests = await Maintenance.find({ email }); // Use the email to filter requests

        // Check if requests were found
        if (!maintenanceRequests || maintenanceRequests.length === 0) {
            return res.status(404).json({ message: 'No maintenance requests found for this user.' });
        }

        // Send the filtered requests
        res.status(200).json({ maintenance: maintenanceRequests }); // Ensure the structure matches what the frontend expects
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        res.status(500).json({ message: error.message });
    }
};


// Get all maintenance requests and replies for a specific user
export const getUserMaintenanceRequestsWithReplies = async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch all maintenance requests for the user based on their email
        const maintenanceRequests = await Maintenance.find({ email });

        if (maintenanceRequests.length === 0) {
            return res.status(404).json({ message: 'No maintenance requests found for this user.' });
        }

        // Log fetched maintenance requests
        console.log('Fetched maintenance requests:', maintenanceRequests);

        // For each request, find the associated reply, if any
        const requestsWithReplies = await Promise.all(
            maintenanceRequests.map(async (request) => {
                const reply = await Reply.findOne({ requestId: request._id }).populate('assignedTechnician');
                
                // Log each request and its reply
                console.log('Request:', request);
                console.log('Reply:', reply);

                return {
                    requestDetails: request,
                    replyDetails: reply ? reply : { message: 'No reply yet from the admin' }
                };
            })
        );

        // Log the final result before sending the response
        console.log('Requests with replies:', requestsWithReplies);
        
        res.status(200).json({ userRequestsWithReplies: requestsWithReplies });

    } catch (error) {
        console.error('Error fetching user maintenance requests and replies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Get all maintenance requests
export const getAllMaintenanceRequests = async (req, res) => {
    try {
        // Fetch all maintenance requests from the database
        const maintenanceRequests = await Maintenance.find();

        // Send the retrieved data as a response
        res.status(200).json(maintenanceRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single maintenance request by ID
export const getMaintenanceRequestById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the request by its ID
        const maintenanceRequest = await Maintenance.findById(id);

        if (!maintenanceRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        // Send the retrieved data as a response
        res.status(200).json(maintenanceRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a maintenance request
export const updateMaintenanceRequest = async (req, res) => {
    const { id } = req.params;
    const { fullName, contactNumber, email, issueDescription, objectType, material } = req.body;

    try {
        // Find the request by ID and update it with the new data
        const updatedRequest = await Maintenance.findByIdAndUpdate(
            id,
            { fullName, contactNumber, email, issueDescription, objectType, material },
            { new: true } // Return the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        // Send the updated request as a response
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a maintenance request
export const deleteMaintenanceRequest = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the request by ID and remove it
        const deletedRequest = await Maintenance.findByIdAndRemove(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        // Send a success message as a response
        res.status(200).json({ message: 'Maintenance request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
