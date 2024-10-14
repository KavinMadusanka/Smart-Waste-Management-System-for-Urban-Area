import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true
    },
    point:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    }
},{timestamps:true}
);

export default mongoose.model('Rewards', rewardSchema);