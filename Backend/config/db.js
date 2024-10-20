import mongoose from 'mongoose';
import colors from 'colors';

class Database {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) {
            console.log(`MongoDB is already connected.`.bgGreen.white);
            return;
        }

        try {
            const conn = await mongoose.connect(process.env.MONGO_URL);
            this.isConnected = true;
            console.log(`Connected to MongoDB Database - Waste Management`.bgMagenta.white);
        } catch (error) {
            console.log(`Error connecting to MongoDB: ${error}`.bgRed.white);
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log(`MongoDB connection closed.`.bgYellow.white);
        }
    }
}

// Create a singleton instance
const database = new Database();

// Export the singleton instance and connect method
export default {
    connect: () => database.connect(),
    disconnect: () => database.disconnect(),
};