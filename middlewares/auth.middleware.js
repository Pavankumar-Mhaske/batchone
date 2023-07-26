import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from '../services/asyncHandler';   // Importing express-async-handler
import CustomError from '../utils/customError';     // Importing Custom Error Handler
import config from "../config/index.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token ;
    if(
        req.cookies.token || 
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    )

    {
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
        console.log("token from cookie", token);
    }

    if(!token){
        throw new CustomError("Not authorized to access this route", 401);
    }

    try {
        
    } catch (error) {
        throw new CustomError("something went wrong! Not authorized to access this route", 401);
    }
});