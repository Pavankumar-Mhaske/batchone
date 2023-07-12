import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs/dist/bcrypt";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index";

const userSchema = mongoose.Schema({
    name : {
        type:String,
        required: [true, "name is required"],
        maxLength: [50 , "name must be less than 50"],
    },
    email : {
        type:String,
        required: [true, "email is required"],
        unique: true,
    },
    password : {
        type:String,
        required: [true, "password is required"],
        minLength: [8 , "password must be at least 8 characters"],
        select: false,
    },
    role:{
        type:String,
        enum: Object.values(AuthRoles),
        default:AuthRoles.USER
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry:Date,
},
{
    timestamps:true
}

);

// challenge 1 - encrypt the password - hooks
userSchema.pre("save", async function(next){
    if(!this.modified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
} )

// add more features directly to your schema
userSchema.methods = {
    // campare password
    comparePassword : async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    },

    // generate JWT token
    getJwtToken: function(){
        return JWT.sign({
            _id: this._id,
            role:this.role
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRY
        },        
        )
    }

    
}
export default mongoose.model("User", userSchema)