import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//@ Desc Create new order
//@route POST /api/orders
//@acces Private route

const addOrderItems = asyncHandler(async(req, res) => {
    const {
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice} = req.body;

        if(orderItems && orderItems.length === 0) {
            res.status(400)
            throw new Error('No order items');
        } else {
            const order = new Order({
                orderItems, 
                user: req.user._id,
                shippingAddress, 
                paymentMethod, 
                itemsPrice, 
                taxPrice, 
                shippingPrice, 
                totalPrice
            })

            const createdOrder = await order.save();

            res.status(201).json(createdOrder);
        }
});

//@ Desc GET order by id
//@route GET /api/orders/:id
//@acces Private route

const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(
                                req.params.id).populate('user', 'name email');

    if(order){
        res.json(order)
    }else {
        res.status(404);
        throw new Error ('Order not found');
    }
});

//@ Desc Update order to paid
//@route PUT /api/orders/:id/pay
//@acces Private route

const updateOrderToPaid = asyncHandler(async(req, res) => {
    
    if(req.body.payment_id){
    const mercadPagoResponse = {
        payment_id: req.body.payment_id,
        status: req.body.status,
        external_reference: req.body.external_reference,
        merchant_order_id: req.body.merchant_order_id
    }

    const order = await Order.findById(req.params.id)

    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: mercadoPagoResponse.payment_id,
            status: mercadoPagoResponse.status,
            update_time: 'Prueba',
            email_address: 'Prueba@mail.ml'
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    }}else {
        res.status(404);
        throw new Error ('Order not found');
    }
});

//@ Desc GET logged in user orders
//@route GET /api/orders/myorders
//@acces Private route

const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.json(orders);
    
});

//@ Desc GET all orders
//@route GET /api/orders
//@acces Private Admin route

const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
    
});

//@ Desc Update order to delivered
//@route GET /api/orders/:id/deliver
//@acces Private Admin route

const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();
       
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    }else {
        res.status(404);
        throw new Error ('Order not found');
    }
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered
}