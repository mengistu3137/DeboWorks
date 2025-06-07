// backend/controllers/payment.controller.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.model.js'; 

const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL;

// Function to initiate a payment
export const initiatePayment = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const { plan } = req.body; // 'monthly' or 'yearly'

    if (!clerkUserId) {
        return res.status(401).json({ message: "Not authenticated to initiate payment" });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const amount = plan === 'monthly' ? 50 : 500; 
    const tx_ref = `${uuidv4()}-${Date.now()}`; 

    try {
        const response = await axios.post(`${CHAPA_BASE_URL}/transaction/initialize`, {
            amount: amount.toString(),
            currency: 'ETB',
            email: user.email, 
            first_name: user.username, 
            last_name: '.', 
            tx_ref: tx_ref,
            callback_url: process.env.BACKEND_URL,
            return_url: `${process.env.CLIENT_URL}`, // }/premium-success?tx_ref=${tx_ref}
            customization: {
                title: 'Subscription',
                description: `${plan} plan`
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.CHASECK_TEST}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.status === 'success') {
             user.current_tx_ref = tx_ref; 
             await user.save();

            return res.status(200).json({ checkoutUrl: response.data.data.checkout_url });
        } else {
            return res.status(400).json({ message: response.data.message || 'Failed to initiate payment with Chapa' });
        }

    } catch (error) {
       
        console.error('Error initiating Chapa payment:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'An error occurred while initiating payment.');
    }
};



export const handleWebhook = async (req, res) => {
    const event = req.body;
    console.log('Chapa Webhook Received:', event);

    // Chapa recommends verifying the transaction using the tx_ref
    const tx_ref = event.tx_ref;

    if (!tx_ref) {
        return res.status(400).json({ message: "Missing tx_ref in webhook payload" });
    }

    try {
        const verificationResponse = await axios.get(`${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
            {
            headers: {
                Authorization: `Bearer ${process.env.CHASECK_TEST}`
            }
        });

        const transaction = verificationResponse.data.data;

        if (verificationResponse.data.status === 'success' && transaction.status === 'success') {
            const user = await User.findOne({ current_tx_ref: tx_ref });

            if (!user) {
                console.error(`User not found for tx_ref: ${tx_ref}`);
                return res.status(200).json({ message: "User not found for this transaction, but payment verified." });
            }

            const paidAmount = parseFloat(transaction.amount);
            let paidPlan = null;
            if (paidAmount === 50) {
                paidPlan = 'monthly';
            } else if (paidAmount === 500) {
                paidPlan = 'yearly';
            } else {
                 console.warn(`Unexpected amount paid for tx_ref ${tx_ref}: ${paidAmount}`);
                 return res.status(200).json({ message: "Payment verified, but amount mismatch." });
            }


            user.isPremium = true;
            user.subscriptionPlan = paidPlan;
            user.subscriptionEndDate = paidPlan === 'monthly'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // +365 days
            user.current_tx_ref = undefined; // Clear the temporary reference
            await user.save();

            console.log(`User ${user.username} upgraded to premium (${paidPlan}) via Chapa`);
            return res.status(200).json({ message: "Payment successfully verified and user updated" });

        } else {
            console.error(`Chapa payment verification failed for tx_ref ${tx_ref}:`, verificationResponse.data.message);
             
            return res.status(400).json({ message: "Payment verification failed or payment not successful" });
        }

    } catch (error) {
        
        console.error('Error handling Chapa webhook:', error.response?.data || error.message);
        
        throw new Error(error.response?.data?.message || 'An error occurred while processing the webhook.');
    }
};



export const checkSubscriptionStatus = async (req, res) => {
     const clerkUserId = req.auth.userId;

     if (!clerkUserId) {
         return res.status(401).json({ message: "Not authenticated" });
     }

     const user = await User.findOne({ clerkUserId }).select('isPremium subscriptionPlan subscriptionEndDate');

     if (!user) {
         return res.status(404).json({ message: "User not found" });
     }

     const isActive = user.isPremium && user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date();

     return res.status(200).json({
         isPremium: isActive,
         subscriptionPlan: user.subscriptionPlan,
         subscriptionEndDate: user.subscriptionEndDate
     });
};