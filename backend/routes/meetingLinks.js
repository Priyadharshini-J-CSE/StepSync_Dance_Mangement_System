const express = require('express');
const Notification = require('../models/Notification');
const Class = require('../models/Class');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Send meeting link notification to enrolled users
router.post('/send-meeting-link/:classId', auth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId).populate('enrolled', 'name email');
    
    if (!classData || classData.mode !== 'online') {
      return res.status(400).json({ message: 'Invalid online class' });
    }

    if (classData.enrolled.length === 0) {
      return res.status(400).json({ message: 'No enrolled students to notify' });
    }

    // Create notifications for enrolled users only
    const notifications = classData.enrolled.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type: 'meeting_link',
      message: `Meeting link for "${classData.name}": ${process.env.FRONTEND_URL || 'http://localhost:3000'}${classData.meetingLink}`,
      relatedClass: classData._id
    }));

    await Notification.insertMany(notifications);
    
    res.json({ message: `Meeting link sent to ${classData.enrolled.length} enrolled students` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;