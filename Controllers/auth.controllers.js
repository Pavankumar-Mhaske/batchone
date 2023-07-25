import User from '../models/user.schema.js';    // Importing User Schema
import asyncHandler from '../services/asyncHandler';   // Importing express-async-handler
import CustomError from '../utils/customError';     // Importing Custom Error Handler


export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    httpOnly: true,
    // could be in a separete file in utils
};


/******************************************************
*  
* @SIGNUP
* @route http://localhost:5000/api/v1/auth/signup
* @description  user signUp Controller for creating new user 
* @parameters name, email, password
* @returns user object
 ******************************************************/

export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return next(new CustomError('Please provide all fields', 400));
    }

    // check if user already exists
    const existingUser = User.findOne({email})

    if(existingUser){
        throw new CustomError('User already exists', 400);
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    // create token
    /**
     * getJwtToken is now available on the user object 
     * because in above line we have created an object from User model  
     */
    const token = user.getJwtToken();
    console.log(user);
    user.password = undefined; 

    res.cookie("token", token, cookieOptions);
    res.status(201).json({
        success: true,
        user,
        token,
    });

    


});



