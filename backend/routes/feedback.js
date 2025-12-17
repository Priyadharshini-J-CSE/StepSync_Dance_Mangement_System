const express = require('express');
const Feedback = require('../models/Feedback');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit feedback
router.post('/', auth, async (req, res) => {
  try {
    const { classId, rating, comment } = req.body;
    const feedback = new Feedback({
      user: req.user._id,
      class: classId,
      rating,
      comment
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's feedback
router.get('/my-feedback', auth, async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id })
      .populate('class', 'name')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get public feedback for landing page
router.get('/public', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name')
      .populate('class', 'name')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;