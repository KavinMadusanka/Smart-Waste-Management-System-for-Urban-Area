import CollectionSchedule from './../models/collectionScheduleModel.js';
import wasteCollector from '../models/wasteCollectorModel.js';
import collectionScheduleModel from './../models/collectionScheduleModel.js';

//create collection schedule
export const createCollectionSchedule = async (req, res) => {
    try {
        const { area, pickupDate, pickupTime, binType, assignedCollector } = req.body;

        // Input validation
        if (!area || !pickupDate || !pickupTime || !binType || !assignedCollector) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if the assigned collector exists and is a WasteCollector
        const collector = await wasteCollector.findById(assignedCollector);
        if (!collector) {
            return res.status(400).json({ success: false, message: 'Invalid Waste Collector' });
        }

        // Create a new collection schedule
        const newSchedule = new CollectionSchedule({
            area,
            pickupDate,
            pickupTime,
            binType,
            assignedCollector: collector._id
        });

        await newSchedule.save();
        res.status(201).json({ success: true, message: 'Schedule created successfully', schedule: newSchedule });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ success: false, message: 'Error creating schedule', error: error.message });
    }
};


//update collection schedule
export const updateCollectionSchedule = async (req, res) => {
    const { id } = req.params; // Get the schedule ID from the URL parameters
    const { area, pickupDate, pickupTime, binType, assignedCollector, status } = req.body;

    try {
        const collector = await wasteCollector.findById(assignedCollector);
        if (!collector) {
            return res.status(400).json({ success: false, message: 'Invalid Waste Collector' });
        }

        const updatedSchedule = await CollectionSchedule.findByIdAndUpdate(
            id,
            {
                area,
                pickupDate,
                pickupTime,
                binType,
                assignedCollector: collector._id,
                status
            },
            { new: true } // Return the updated document
        );

        if (!updatedSchedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        res.status(200).json({ success: true, message: 'Schedule updated successfully', schedule: updatedSchedule });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ success: false, message: 'Error updating schedule', error: error.message });
    }
};


//get all collection schedules
export const getAllCollectionSchedules = async (req, res) => {
    try {
        const schedules = await CollectionSchedule.find().populate('assignedCollector', 'firstName lastName'); // Populates collector details
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
};


//get collection schedule by ID
export const getCollectionScheduleById = async (req, res) => {
    const { id } = req.params; // Get the schedule ID from the URL parameters

    try {
        // Fetch the schedule by ID, populating the assigned collector details
        const schedule = await CollectionSchedule.findById(id).populate('assignedCollector', 'firstName lastName');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json(schedule); // Return the schedule details
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
    }
};


export const getScheduleByWasteCollectorController = async (req, res) => {
    try {
        const collectionSchedules = await collectionScheduleModel.find({ assignedCollector: req.params.assignedCollectorId });

        res.status(200).send({
            success: true,
            collectionSchedules, // Ensure you're using the correct variable name
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error fetching schedules', // Updated error message
            error: error.message || 'An unexpected error occurred.',
        });
    }
};
