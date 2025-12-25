const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  const { request_id, amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR"
    });

    const sql = `
      INSERT INTO payments (request_id, razorpay_order_id, amount)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [request_id, order.id, amount]);

    res.json({
      order_id: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Order creation failed' });
  }
};

exports.verifyPayment = (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    request_id
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    const sql = `
      UPDATE payments
      SET razorpay_payment_id=?, status='SUCCESS'
      WHERE razorpay_order_id=?
    `;
    db.query(sql, [razorpay_payment_id, razorpay_order_id]);

    db.query(
      `UPDATE requests SET status='ACCEPTED' WHERE id=?`,
      [request_id]
    );

    res.json({ message: 'Payment successful' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
};
