const express = require('express');


const router = express.Router();

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: ' rzp_test_EomCIJWKMnixw5',
    key_secret: ' evXFugDi9PzaB79gOqMOwBX9'
});

razorpay.orders.create({
    amount: 50000, // amount in paise
    currency: 'INR',
    receipt: 'order_rcptid_11',
    payment_capture: '1'
}, (err, order) => {
    console.log(order);
});


router
    .route
    .get('/pay', async (req, res) => {
    const options = {
        amount: 50000, // amount in paise
        currency: 'INR',
        receipt: 'order_rcptid_11',
        payment_capture: '1'
    };
    try {
        const order = await razorpay.orders.create(options);
        res.render('payment', {
            order: order
        });
    } catch (error) {
        console.log(error);
    }
});


router
    .route
    .post('/verify', async (req, res) => {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    } = req.body;

    const signature = crypto.createHmac('sha256', 'YOUR_API_KEY_SECRET')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (signature === razorpay_signature) {
        res.send('Payment Successful');
    } else {
        res.send('Payment Failed');
    }
});


