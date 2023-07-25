import User from '../models/user.schema.js';    // Importing User Schema
import asyncHandler from '../services/asyncHandler';   // Importing express-async-handler
import CustomError from '../utils/customError';     // Importing Custom Error Handler
import mailHelper from '../utils/mailHelper';       // Importing Mail Helper

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

export const signup = asyncHandler(async (req, res) => {
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



/******************************************************
*  
* @LOGIN
* @route http://localhost:5000/api/v1/auth/ login
* @description  user login Controller for loging in new user 
* @parameters  email, password
* @returns User object
 ******************************************************/
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {   
        throw new CustomError('Please provide all fields', 400);
    }

    const user = User.findOne({email}).select("+password") // select password field

    if(!user){
        throw new CustomError('Invalid credentials', 401);
    }   


    // check if password matches
    const isPasswordMatched =  await user.comparePassword(password); 
    
    if(isPasswardMatched) {

        const token = user.getJwtToken();
        user.password = undefined;

        res.cookie("token", token, cookieOptions);
        return res.status(200).json({
            success: true,
            user,
            token,
        });
    }
    
});

/******************************************************
 * 
 * @LOGOUT
 * @route http://localhost:5000/api/v1/auth/logout
 * @description  user logout Controller for loging out new user and clearing cookies
 * @parameters  none
 * @returns success message
 ******************************************************/

export const logout = asyncHandler(async (_req, res) => {
    /** _req  just to say req is not going to use anywhere in the below code */
    // clear cookies
    // res.cookie("token", null, cookieOptions);
    //           (   name,  value,   options  )
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});


/******************************************************
 * 
 * @FORGOT_PASSWORD
 * @route http://localhost:5000/api/v1/auth/password/forgot
 * @description  user will submit email and will get a generate a token to
 * @parameters  email
 * @returns success message - email sent
 ******************************************************/

export const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = body.email;

    const user = await User.findOne({email});

    if(!user){
        throw new CustomError('User not found', 404);
    }

    const resetToken = user.generateForgotPasswordToken();
    await user.save({validateBeforeSave: false});

    // creating an url for the user to reset the password
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/password/reset/${resetToken}`;

    const text = `Your password reset token is as follows: \n\n ${resetUrl}`;
    try {
        await mailHelper({
            email: user.email,
            subject: 'Password reset token',
            text: text,
        }) // pass the options
        res.status(200).json({
            success: true,
            message: `Email sent ${user.email}}`,
        });
    } catch (error) {

        // role back - clear fields and save
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        user.save({validateBeforeSave: false});
        throw new CustomError( error.message ||  'Email could not be sent', 500);
    }

});



