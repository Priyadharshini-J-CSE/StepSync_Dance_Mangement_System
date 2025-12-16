const express = require('express');
const Payment = require('../models/Payment');
const ClassRequest = require('../models/ClassRequest');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Process payment
router.post('/', auth, async (req, res) => {
  try {
    const { classId, amount, package, paymentMethod } = req.body;
    
    // Generate receipt number
    const receiptNumber = 'RCP' + Date.now();
    
    // Calculate validity dates
    const validFrom = new Date();
    const validUntil = new Date();
    if (package === '3month') {
      validUntil.setMonth(validUntil.getMonth() + 3);
    } else {
      validUntil.setFullYear(validUntil.getFullYear() + 1);
    }

    const payment = new Payment({
      user: req.user._id,
      class: classId,
      amount,
      package,
      paymentMethod,
      status: 'completed',
      transactionId: 'TXN' + Date.now(),
      receiptNumber,
      validFrom,
      validUntil
    });

    await payment.save();

    // Update class request with payment
    await ClassRequest.findOneAndUpdate(
      { user: req.user._id, class: classId, status: 'pending' },
      { payment: payment._id }
    );

    res.status(201).json({
      payment,
      receipt: {
        receiptNumber,
        amount,
        package,
        validFrom,
        validUntil,
        transactionId: payment.transactionId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('class', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get receipt
router.get('/receipt/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('class', 'name');
    
    if (!payment || payment.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;