import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, payOrderMercadoPago, deliverOrder } from '../actions/orderActions';
import {ORDER_PAY_RESET, ORDER_DELIVER_RESET, ORDER_PAY_MERCADOPAGO_RESET} from '../constants/orderConstants';


const OrderScreen = ({match, history, location}) => {
    let orderId = match.params.id;
   
    console.log(match)
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const {order, loading, error } = orderDetails;

    const userLogin = useSelector(state => state.userLogin);
    const {userInfo} = userLogin;



    const orderPayMercadoPago = useSelector(state => state.orderPayMercadoPago);
    const {loading: loadingPayMercadoPago, success: successPayMercadoPago, mercadopagoInfo } = orderPayMercadoPago;

    const orderDeliver = useSelector(state => state.orderDeliver);
    const {loading: loadingDeliver, success: successDeliver } = orderDeliver;
    if(match.params.payment_id){
        const mercadPagoResponse = {
            payment_id: match.payment_id,
            status: match.status,
            external_reference: match.external_reference,
            merchant_order_id: match.merchant_order_id
        }
        console.log(mercadPagoResponse)
    }
    

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    if(!loading){
        order.itemsPrice = addDecimals(order.orderItems.reduce(
         (acc, item) => acc + item.price *item.qty, 0));
    }

    useEffect(()=> {
        if(!userInfo){
            history.push('/login');
        } 
          
        if(!order || order._id !== orderId){
            dispatch({type: ORDER_PAY_RESET});
            dispatch({type: ORDER_DELIVER_RESET});
            dispatch({type:ORDER_PAY_MERCADOPAGO_RESET});
            dispatch(getOrderDetails(orderId));
            
        }else if(!mercadopagoInfo && !loadingPayMercadoPago){
            dispatch(payOrderMercadoPago(order))
        }
            
    }, [dispatch, orderId, order, history, userInfo, mercadopagoInfo, loadingPayMercadoPago])

    const deliverHandler = () => {
        if(order){
            dispatch(deliverOrder(order));
            
        }
        
    }

    return loading 
            ? <Loader /> 
            : error ? <Message variant='danger'>{error}</Message>
            : <>
                <h1>Order {order._id}</h1>
                <Row>
                <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name: </strong> {order.user.name}
                            
                        </p>
                        <p>
                        <strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {' '}
                            {order.shippingAddress.city}, {' '}
                            {order.shippingAddress.postalCode},{' '} 
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered
                          ? <Message variant='success'>Delivered on {order.deliverdAt}</Message>
                          :<Message variant='danger'>Not Delivered</Message>
                        }
                    </ListGroup.Item> 

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {'MercadoPago'}  
                        </p>
                          {order.isPaid 
                          ? <Message variant='success'>Paid on {order.paidAt}</Message>
                          :<Message variant='danger'>Not paid</Message>
                        }
                    </ListGroup.Item>   

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 
                        ? <Message> Your Cart Is Empty</Message>
                        : (<ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => 
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                
                                                <Image src={item.image} alt={item.name} fluid rounded />

                                            </Col>

                                            <Col>

                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>

                                            </Col>

                                            <Col md={4}>

                                                    {item.qty} x ${item.price} = ${item.qty * item.price}

                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                          </ListGroup>)
                    }
                    </ListGroup.Item>
                </ListGroup>
                </Col>    
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            
                                    {order && !order.isPaid && mercadopagoInfo 
                                    ?(<><a href={mercadopagoInfo.response.init_point} rel='noreferrer' target='_blank'><Button className='btn btn-block'> Pagar</Button></a></>)
                                    :<Button className='btn btn-block' disabled>Pay Order</Button>}
                                    
                                    
                                </ListGroup.Item>
                            
                           {loadingDeliver && <Loader />}
                           {userInfo &&
                                userInfo.isAdmin 
                            && order.isPaid 
                            && !order.isDelivered && (
                               <ListGroup.Item>
                                   <Button 
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverHandler}>
                                        Mark as delivered
                                    </Button>
                               </ListGroup.Item>
                           )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>   
            </>
            
}

export default OrderScreen;