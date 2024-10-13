import wasteCollector from '../models/wasteCollectorModel.js'

// Controller to get all waste collectors
export const getWasteCollectors = async (req, res) => {
    try {
      const wasteCollectors = await wasteCollector.find(); // Assuming WasteCollector is imported
      res.status(200).json(wasteCollectors);
    } catch (error) {
      console.error('Error fetching waste collectors:', error);
      res.status(500).json({ message: 'Error fetching waste collectors' });
    }
  };
  