// backend/routes/payment.route.js
import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express'; // Import requireAuth
import { initiatePayment, handleWebhook, checkSubscriptionStatus } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/initiate', initiatePayment);

router.post('/webhook', handleWebhook);
router.get('/status', requireAuth(), checkSubscriptionStatus);


export default router;