import asyncHandler from 'express-async-handler';
import mercadopago from 'mercadopago';
import Order from '../models/orderModel.js';


mercadopago.configure({
    access_token: 'APP_USR-1209633050172911-010912-1463741671619f47d35fb7faf0bc2e94-699230790'
})




const payMercadoPago = asyncHandler(async (req,res) => {
// Crea un objeto de preferencia
const order = req.body;
let preference;

  const payer = {
    name: order.user.name,
    email: order.user.email,
    address: {
    street_name: order.shippingAddress.address,
    zip_code: order.shippingAddress.postalCode

  }
}

const items = order.orderItems.map(i => (
  {
    title: i.name,
    unit_price: Number(i.price),
    quantity: i.qty
  }
))
  

preference = {
    payer,
    items,
    shipments: {
      mode: 'not_specified',
      cost: order.shippingPrice,
      
    },
    back_urls:{
      success: `http://localhost:5000/api/pay/mercadopago`,
      failure: `http://localhost:3000`,
      pending: `http://localhost:3000/login`
    },
    //
    auto_return: 'all',
    statement_descriptor: 'ProShop',
    external_reference: order._id,
    binary_mode: true,
    notification_url:`https://cokiwh3649.loca.lt/api/pay/webhook`,    
    
  };

  

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json(response);
  }catch(error){
    res.status(400).json({message: error})
  }
  
})

const webhook = (req, res) => {
 
  res.end('ok')
  res.status(200);
  
}

const getMercadoPagoPaymentStatus = asyncHandler(async(req, res) => {

  if (req.query.type='payment_id'){
    const paymentInfo = {
      payment_id:req.query.payment_id,
      status: req.query.status,
      external_reference: req.query.external_reference,
      merchant_order_id: req.query.merchant_order_id

    };
    //console.log(paymentInfo);
    const mpInfo = await mercadopago.payment.findById(paymentInfo.payment_id);
    console.log(mpInfo);
    const order = await Order.findById(paymentInfo.external_reference);
    if(order){
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
          id: paymentInfo.payment_id,
          status: paymentInfo.status,
          update_time: mpInfo.body.date_last_updated,
          email_address: mpInfo.body.payer.email

      };
      
      await order.save();
      res.redirect(`http://localhost:3000/order/${paymentInfo.external_reference}`)
    }
    
    
  }else{
    res.status(400)
    throw new Error('An error ocurred')
  }
})



export {payMercadoPago, webhook, getMercadoPagoPaymentStatus};