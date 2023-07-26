import Collection from '../models/collection.model.js';
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../utils/customError.js';


// controller for getUser Profile
/******************************************************
 * 
 * @CREATE_COLLECTION
 * @REQUEST_TYPE GET
 * @route http://localhost:5000/api/v1/collection
 * @description create a collection
 * @parameters  name
 * @returns collection
 *  ******************************************************/

export const createCollection = asyncHandler(async (req, res) => {
    const {name} = req.body;

    if(!name){
        throw new customError ('Please provide a name', 400);
    }

    // take name from frontend and create a collection into the database
    const collection = await Collection.create({
        name,

    });
    // send this response to the frontend
    res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        collection,
    });
});



export const updateCollection = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {id: collectionId } = req.params;

    if(!name){
        throw new customError ('Please provide a name', 400);
    }

    // take name from frontend and create a collection into the database
    const updatedCollection = await Collection.findByIdAndUpdate(collectionId, {
        name,

    },  
    {    
        new: true,
        runValidators: true,
    });
    if(!updatedCollection){
        throw new customError ('Collection not found', 404);
    }

    // send this response to the frontend
    res.status(201).json({
        success: true,
        message: 'Collection updated successfully',
        updatedCollection,
    });
});


// delete the collection
export const deleteCollection = asyncHandler(async (req, res) => {
    const {id: collectionId } = req.params;

    const collectionToDelete = await Collection.findByIdAndDelete(collectionId);

    if(!collectionToDelete){
        throw new customError ('Collection not found', 404);
    }

    // To free up the space in the database we need to delete the collection
    collectionToDelete.remove();

    // send this response to the frontend
    res.status(200).json({
        success: true,
        message: 'Collection deleted successfully',
        collectionToDelete,
    });
});