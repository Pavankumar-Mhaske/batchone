import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:[true, "please provide the product name"],
            trim: true,
            maxLength: [120, "product name should be max of 120 characters"],
        },
        price:{
            type:Number,
            required:[true, "please provide the product price"],
            trim: true,
            maxLength: [5, "product price should be max of 5 digits"],
        },
        description:{
            // use some form of the editor - personal assignments
            type:String,
        },
        photos:[
            {
                secure_url:{
                    type:String,
                    required: true,
                    // images can be stored in cloudinary, firebase, aws, etc
                }
            }
        ],
        stock:{
            type:Number,
            default: 0,
        },
        sold:{
            type:Number,
            default: 0,
        },

        collectionId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Collection",
        },

    },
    {
        timestamps:true
    }

);

export default mongoose.model("Product", productSchema);
