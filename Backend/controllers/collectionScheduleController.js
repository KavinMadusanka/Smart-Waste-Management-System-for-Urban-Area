import CollectionSchedule from './../models/collectionScheduleModel.js';
import User from './../models/userModel.js'

export const createCollectionSchedule = async (req, res) => {
    try {
        const { area, pickupDate, pickupTime, binType, assignedCollectorId } = req.body;

        // Check if the assigned collector exists and is a WasteCollector
        const collector = await User.findOne({ _id: assignedCollectorId, accountType: 'Waste Collector' });
        if (!collector) {
            return res.status(400).json({ message: 'Invalid Waste Collector' });
        }

        // Create a new collection schedule
        const newSchedule = new CollectionSchedule({
            area,
            pickupDate,
            pickupTime,
            binType,
            assignedCollector: collector.email
        });

        await newSchedule.save();
        res.status(201).json({ success: true, message: 'Schedule created successfully', schedule: newSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating schedule' });
    }
};


//update collection schedule
export const updateCollectionSchedule = async (req, res) => {
    const { id } = req.params; // Get the schedule ID from the URL parameters
    const { area, pickupDate, pickupTime, binType, assignedCollectorId,status } = req.body;

    try {
        // Check if the assigned collector exists and is a WasteCollector
        const collector = await User.findOne({ _id: assignedCollectorId, accountType: 'Waste Collector' });
        if (!collector) {
            return res.status(400).json({ message: 'Invalid Waste Collector' });
        }

        // Update the collection schedule
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
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json({ success: true, message: 'Schedule updated successfully', schedule: updatedSchedule });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ success: false, message: 'Error updating schedule' });
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

