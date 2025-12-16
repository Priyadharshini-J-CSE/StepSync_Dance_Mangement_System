const express = require('express');
const Notification = require('../models/Notification');
const ClassRequest = require('../models/ClassRequest');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Class = require('../models/Class');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name')
      .populate('relatedClass', 'name')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept class request (Admin only)
router.post('/accept-request/:requestId', adminAuth, async (req, res) => {
  try {
    const request = await ClassRequest.findById(req.params.requestId)
      .populate('user')
      .populate('class');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'accepted';
    request.responseDate = new Date();
    await request.save();

    // User can be active for this specific class, but overall status remains separate

    // Add user to class enrolled list
    await Class.findByIdAndUpdate(request.class._id, {
      $addToSet: { enrolled: request.user._id }
    });

    // Create notification for user
    await new Notification({
      recipient: request.user._id,
      sender: req.user._id,
      type: 'class_accepted',
      message: `Your request to join "${request.class.name}" has been accepted`,
      relatedClass: request.class._id
    }).save();

    res.json({ message: 'Request accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject class request (Admin only)
router.post('/reject-request/:requestId', adminAuth, async (req, res) => {
  try {
    const request = await ClassRequest.findById(req.params.requestId)
      .populate('user')
      .populate('class');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update request status
    request.status = 'rejected';
    request.responseDate = new Date();
    await request.save();

    // Refund payment if exists
    if (request.payment) {
      await Payment.findByIdAndUpdate(request.payment, { status: 'refunded' });
    }

    // Create notification for user
    await new Notification({
      recipient: request.user._id,
      sender: req.user._id,
      type: 'class_rejected',
      message: `Your request to join "${request.class.name}" has been rejected`,
      relatedClass: request.class._id
    }).save();

    res.json({ message: 'Request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;