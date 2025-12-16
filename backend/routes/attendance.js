const express = require('express');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Mark attendance (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { userId, classId, date, status } = req.body;
    
    // Check if attendance already exists for this user, class, and date
    const existingAttendance = await Attendance.findOne({
      user: userId,
      class: classId,
      date: new Date(date)
    });
    
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.markedBy = req.user._id;
      await existingAttendance.save();
      res.json(existingAttendance);
    } else {
      // Create new attendance
      const attendance = new Attendance({
        user: userId,
        class: classId,
        date: new Date(date),
        status,
        markedBy: req.user._id
      });
      await attendance.save();
      res.status(201).json(attendance);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a class (Admin only)
router.get('/class/:classId', adminAuth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ class: req.params.classId })
      .populate('user', 'name email')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's attendance
router.get('/user', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user._id })
      .populate('class', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics
router.get('/stats/:userId', adminAuth, async (req, res) => {
  try {
    const totalClasses = await Attendance.countDocuments({ user: req.params.userId });
    const presentClasses = await Attendance.countDocuments({ 
      user: req.params.userId, 
      status: 'present' 
    });
    
    res.json({
      totalClasses,
      presentClasses,
      attendanceRate: totalClasses > 0 ? (presentClasses / totalClasses * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;