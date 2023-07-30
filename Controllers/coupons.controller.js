/************************************************
 * @CREATE_COUPON
 * @route: http://localhost:5000/api/v1/coupon
 * @description: Controller used for creating a new coupon
 * @description: Only admin and Moderator can create a coupon
 * @access: private
 * @parameters: none
 * @returns: coupon object with success message
 * **********************************************/

export const createCoupon = asyncHandler(async (req, res) => {
    try {
        const {name, expiry, discount} = req.body
        const coupon = await Coupon.create({
            name,
            expiry,
            discount
        })
        if(!coupon){
            throw new CustomError('Coupon could not be created', 400)

        }
        res.status(201).json({
            success: true,
            coupon

        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: error.message || `something went wrong` // error.message is the message property of the error object
        })

    }
});
/************************************************
 * @DEACTIVATE_COUPON
 * @route: http://localhost:5000/api/v1/coupon/:id
 * @description: Controller used to deactivate a coupon
 * @description: Only admin and Moderator can update a coupon
 * @access: private
 * @parameters: id
 * @returns: coupon object with success message
 * **********************************************/

export const deactivateCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, {active: false}, {new: true})
        if(!coupon){
            throw new CustomError('Coupon could not be deactivated', 400)

        }
        res.status(201).json({
            success: true,
            coupon

        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: error.message || `something went wrong` // error.message is the message property of the error object
        })

    }
}
);

/************************************************
 * @DELETE_COUPON
 * @route: http://localhost:5000/api/v1/coupon/:id
 * @description: Controller used to delete a coupon
 * @description: Only admin and Moderator can delete a coupon
 * @access: private
 * @parameters: id
 * @returns: coupon object with success message
 * **********************************************/


export const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id)
        if(!coupon){
            throw new CustomError('Coupon could not be deleted', 400)

        }
        res.status(201).json({
            success: true,
            coupon

        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: error.message || `something went wrong` // error.message is the message property of the error object
        })

    }
}
);


/************************************************
 * @GET_ALL_COUPONS
* @route: http://localhost:5000/api/v1/coupons
* @description: Controller used to get all coupons
* @description: Only admin and Moderator can get all coupons
* @access: private
* @parameters: none
* 
* @returns: coupon object with success message

* **********************************************/


export const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find({})
        if(!coupons){
            throw new CustomError('Coupons could not be found', 400)

        }
        res.status(201).json({
            success: true,
            coupons

        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: error.message || `something went wrong` // error.message is the message property of the error object
        })

    }
}
);

