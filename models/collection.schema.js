import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema({
    name : {
        type :String,
        required: [true, "please provide a category name"], 
        trim : true,
        maxLength: [120, "collection name should not be more than 120 characters"],
        
    }
})