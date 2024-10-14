import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const bRequstFormSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    phoneNo:{
        type:Number,
        required:true
    },
    emailAddress:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    details:{
        type: String,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'BulkCategories',
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pvalue: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "one"
    },
    points: {
        type: Number,
        default: 0
    }
},{timeStamps:true}
);

export default mongoose.model('BrequestForms',bRequstFormSchema)