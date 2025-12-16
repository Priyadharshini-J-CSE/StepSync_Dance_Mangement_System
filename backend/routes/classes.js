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
    const classes = await Class.find({ isActive: true }).populate('createdBy', 'name');
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

    // Notify all users about new class
    const users = await User.find({ role: 'user' });
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type: 'class_created',
      message: `New class "${newClass.name}" has been created`,
      relatedClass: newClass._id
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
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
    const classToDelete = await Class.findById(req.params.id);
    
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
    const requests = await ClassRequest.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('class', 'name');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled users for a class (Admin only)
router.get('/:id/enrolled', adminAuth, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('enrolled', 'name email');
    console.log('Class enrolled users:', classData.enrolled);
    res.json(classData.enrolled || []);
  } catch (error) {
    console.error('Error getting enrolled users:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;