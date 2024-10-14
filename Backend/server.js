import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import AuthRoutes from './routes/AuthRoute.js'
import CollectionSchedule from './routes/collectionScheduleRoutes.js'
import { router as BulkCategoryRoutes } from './routes/bulkCategoryRoute.js';
// import {router as WasteCategoryRoutes} from './routes/wasteCategoryRoute.js';
// import {router as MaintenanceRoutes} from './routes/maintenanceRoute.js';
import BrequestFormRoutes from './routes/bRequestFormRoutes.js';
import {router as WasteCategoryRoutes} from './routes/wasteCategoryRoute.js';
import {router as MaintenanceRoutes} from './routes/maintenanceRoute.js';
import {router as MaintainReplyRoutes} from './routes/maintainReplyRoutes.js';
import WasteRequestRoutes from './routes/wasteRequestRoutes.js';
import RewardRoutes from './routes/RewardRoute.js'

//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//Route
app.use('/api/v1/auth',AuthRoutes )
app.use('/api/v1/collectionSchedule',CollectionSchedule)
app.use('/api/v1/bulkCategory',BulkCategoryRoutes)
// app.use('/api/v1/wasteCategory',WasteCategoryRoutes)
// app.use('/api/v1/maintenance',MaintenanceRoutes)
app.use('/api/v1/bulkRequestForm',BrequestFormRoutes)
app.use('/api/v1/wasteCategory',WasteCategoryRoutes)
app.use('/api/v1/maintenance',MaintenanceRoutes)
app.use('/api/v1/replies',MaintainReplyRoutes)
app.use('/api/v1/wasteRequest',WasteRequestRoutes)
app.use('/api/v1/RewardRoutes',RewardRoutes)

// rest api
app.get("/" , (req,res) => {
    res.send({
        message: "Welcome to  Smart Waste Management System",
    });
});

//Port
const PORT = process.env.PORT || 8082;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
