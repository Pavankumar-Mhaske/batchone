import Producr from '../models/product.schema.js';
import Order from '../models/order.schema.js';
import Coupon from  `../models/coupon.schema.js`;
import asyncHandler from `../services/asyncHandler.js`;
import CustomError from '../utils/customError.js';
import razorpay from '../config/razorpay.config.js';

/*********************************************************
 * @GENERATE_RAZORPAY_ORDER_ID
 * @route https://localhost:5000/api/v1/orders/razorpay
 * @discription Controller used for generating razorpay id
 * @discription Create a Razorpay id which is used for placing order
 * @returns Order Object with `Razorpay order id generated successfully`
 *********************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
    ``` Business Logic ```
    // verify product and coupon from frontend
    // verify product and coupon from backend
    // make DB query to get all products and info
    // total amound an final amount
    // coupon discount check from DB
    // discount amount = total amount * coupon discount
    // final Amount = total amount - dic
    const { totalAmount, currency } = req.body;
    const options = {
        amount:Math.round(totalAmount * 100),
        currency:`INR`,
        receipt: `receipt_order_${new Date().getTime()} : Amount ${totalAmount} `,
 
    };

    // payment gateway integration
    const order = await razorpay.orders.create(options);


    // if order is not generated
    if (!order) {
        throw new CustomError(`Razorpay order id not generated`, 500);
    }

    // if order is generated
    res.status(200).json({
        success: true,
        data: order,
    });
});

