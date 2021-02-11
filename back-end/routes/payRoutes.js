import express from 'express';

import {payMercadoPago, webhook, getMercadoPagoPaymentStatus} from '../controllers/mercadopagoController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mercadopago', protect, payMercadoPago);
router.get('/mercadopago', getMercadoPagoPaymentStatus);
router.post('/webhook', webhook);

export default router;