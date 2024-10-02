import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import AuthRoutes from './routes/AuthRoute.js'


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
