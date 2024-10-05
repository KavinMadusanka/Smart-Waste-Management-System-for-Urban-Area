import mongoose from "mongoose";

const bulkCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    additionalDescription:{
        type:String,
        required:true
    },
    instructions:{
        type:String,
        required:true
    },
    benefits:{
        type:String,
        required:true
    }
},{timestamps:true}
);

export default mongoose.model('BulkCategories', bulkCategorySchema);