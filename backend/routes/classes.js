const express = require('express');
const Class = require('../models/Class');
const ClassRequest = require('../models/ClassRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find({ 
      isActive: true,
      ...(req.user.role === 'admin' ? { createdBy: req.user._id } : {})
    }).populate('createdBy', 'name');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create class (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const classData = { ...req.body, createdBy: req.user._id };
    
    const newClass = new Class(classData);
    await newClass.save();
    
    // Auto-generate internal meeting link for online classes
    if (classData.mode === 'online') {
      newClass.meetingLink = `/video-call/${newClass._id}`;
      await newClass.save();
    }

    // No notifications sent when creating classes

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found or unauthorized' });
    }
    
    // Notify enrolled users about class update
    const enrolledUsers = updatedClass.enrolled;
    const notifications = enrolledUsers.map(userId => ({
      recipient: userId,
      sender: req.user._id,
      type: 'class_updated',
      message: `Class "${updatedClass.name}" has been updated`,
      relatedClass: updatedClass._id
    }));
    await Notification.insertMany(notifications);

    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete class (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const classToDelete = await Class.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!classToDelete) {
      return res.status(404).json({ message: 'Class not found or unauthorized' });
    }
    
    // Notify enrolled users about class deletion
    const notifications = classToDelete.enrolled.map(userId => ({
      recipient: userId,
      sender: req.user._id,
      type: 'class_deleted',
      message: `Class "${classToDelete.name}" has been cancelled`,
      relatedClass: classToDelete._id
    }));
    await Notification.insertMany(notifications);

    await Class.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request to join class (User only)
router.post('/:id/request', auth, async (req, res) => {
  try {
    const { package } = req.body;
    const classId = req.params.id;
    
    const existingRequest = await ClassRequest.findOne({
      user: req.user._id,
      class: classId,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already pending' });
    }

    const classRequest = new ClassRequest({
      user: req.user._id,
      class: classId,
      package
    });
    await classRequest.save();

    // Notify admin about new request
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      sender: req.user._id,
      type: 'class_request',
      message: `${req.user.name} requested to join a class`,
      relatedClass: classId
    }));
    await Notification.insertMany(notifications);

    // User status remains based on their overall profile, class request has its own status

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get class requests (Admin only)
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    // Get admin's classes first
    const adminClasses = await Class.find({ createdBy: req.user._id }).select('_id');
    const adminClassIds = adminClasses.map(c => c._id);
    
    const requests = await ClassRequest.find({ 
      status,
      class: { $in: adminClassIds }
    })
      .populate('user', 'name email')
      .populate('class', 'name')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's class requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await ClassRequest.find({ user: req.user._id })
      .populate('class', 'name schedule packages')
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled users for a class (Admin only)
router.get('/:id/enrolled', adminAuth, async (req, res) => {
  try {
    const classData = await Class.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    }).populate('enrolled', 'name email');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found or unauthorized' });
    }
    
    res.json(classData.enrolled || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;