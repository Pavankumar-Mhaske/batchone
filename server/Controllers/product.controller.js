import Product from `../models/product.schema.js`
import formidable from 'formidable'
import fs from 'fs'  // node js file system module
import {s3FileDelete,s3FileUpload } from  `../services/imageUpload.js`
import Mongoose from 'mongoose'
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../utils/customError.js';
import config from `../config/index.js`

/*********************************************************
 * 
 * @ADD PRODUCT
 * @route http://localhost:5000/api/v1/product
 * @description add a product
 * @parameters  name, price, description, category, quantity, shipping, images
 * @returns product object
 * ******************************************************/

export const addProduct = asyncHandler(async (req, res) => {

    const form = formidable({
        multiples: true,
        keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {

        try {
            if(err){
                throw new CustomError('Image could not be uploaded', 400)
            }
            // every filename should be unique
            let productId = new Mongoose.Types.ObjectId().toHexString() // generate a random id
            // console.log(fields, files)

            // check if all the fields are present
            const {name, price, description, category, quantity, shipping} = fields
            if(!name || !price || !description || !category || !quantity || !shipping){
                throw new CustomError('Please fill all the fields', 400);
            }

            // check if all the fields are valid
            

            // check if all the fields are valid


            // handle images
            let imgArrayResp = Promise.all(
                // get all the keys from the files object in the form of an array
                Object.keys(files).map(async (filekey, index) => {
                    const element = files[filekey];
                    // console.log(element)
                    const data = fs.readFileSync(element.filepath)

                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key:`products/${productId}/photo_${index + 1}.png`,  // key is like the name of the file
                        body: data,
                        contentType: element.mimetype,  // mimetype is like the type of the file (e.g. image/jpeg)

                    })
                    return {
                        secure_url: upload.Location
                    }
                })

            )

            let imgArray = await imgArrayResp ;

            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields,
            })

            if(!product){
                throw new CustomError('Product could not be created', 400)
                // code to remove the images from s3
            }

            res.status(201).json({
                success: true,
                data: product

            })
 
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                error: error.message || `something went wrong` // error.message is the message property of the error object
            })
            
            
        }
    });

});


/*********************************************************
 * @GET_ALL_PRODUCTS
 * @route http://localhost:5000/api/v1/product
 * @description get all products
 * @parameters  none
 * @returns array of product objects
 * ******************************************************/

export const getAllProducts = asyncHandler(async (req, res) => {
    
        try {
            const products = await Product.find()
            if(!products){
                throw new CustomError('Products could not be found', 404)
            }
            res.status(200).json({
                success: true,
                products
    
            })
            
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                error: error.message || `something went wrong` // error.message is the message property of the error object
            })
            
        }
    });

/*********************************************************
 * @GET_PRODUCT_BY_ID
 * @route http://localhost:5000/api/v1/product/:id
 * @description get a product by id
 * @parameters  id
 * @returns product object
 * ******************************************************/

export const getProductById = asyncHandler(async (req, res) => {
        
            try {
                const product = await Product.findById(req.params.id)
                if(!product){
                    throw new CustomError('Product could not be found', 404)
                }
                res.status(200).json({
                    success: true,
                    product
        
                })
                
            } catch (error) {
                console.log(error)
                res.status(400).json({
                    success: false,
                    error: error.message || `something went wrong` // error.message is the message property of the error object
                })
                
            }
        });

// assignments to read 

/*
        1.model.aggregate( [{}, {}, {}] )  // read about this
        2. mongodb -> 
        $ group 
        $ push 
        $ ROOT
        $ lookup
        $ project
        
*/

