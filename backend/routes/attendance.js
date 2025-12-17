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
    
    // Check if admin owns this class
    const classData = await Class.findOne({ _id: classId, createdBy: req.user._id });
    if (!classData) {
      return res.status(403).json({ message: 'Unauthorized to mark attendance for this class' });
    }
    
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
    // Check if admin owns this class
    const classData = await Class.findOne({ _id: req.params.classId, createdBy: req.user._id });
    if (!classData) {
      return res.status(403).json({ message: 'Unauthorized to view attendance for this class' });
    }
    
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

// Get user profile with CodeChef-style stats
router.get('/user/profile', auth, async (req, res) => {
  try {
    const Class = require('../models/Class');
    const Payment = require('../models/Payment');
    const User = require('../models/User');
    
    // Get completed courses
    const completedPayments = await Payment.find({
      user: req.user._id,
      status: 'completed',
      validUntil: { $lt: new Date() }
    }).populate('class', 'name');
    
    const completedCourses = completedPayments.length;
    
    // Calculate total attendance and consistency
    const totalAttendance = await Attendance.countDocuments({ user: req.user._id });
    const presentAttendance = await Attendance.countDocuments({ 
      user: req.user._id, 
      status: 'present' 
    });
    
    const consistencyRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;
    
    // Calculate star rating (1-5 stars based on consistency)
    const starRating = Math.min(5, Math.max(1, Math.floor(consistencyRate / 20) + 1));
    
    // Get badges based on milestones
    const badges = getBadges(completedCourses, consistencyRate, totalAttendance);
    
    // Calculate skill points
    const skillPoints = (completedCourses * 100) + (presentAttendance * 10) + Math.floor(consistencyRate);
    
    // Get global ranking
    const allUsers = await User.find({ role: 'user' });
    const userRankings = [];
    
    for (const user of allUsers) {
      const userCompleted = await Payment.countDocuments({
        user: user._id,
        status: 'completed',
        validUntil: { $lt: new Date() }
      });
      
      const userTotalAttendance = await Attendance.countDocuments({ user: user._id });
      const userPresentAttendance = await Attendance.countDocuments({ 
        user: user._id, 
        status: 'present' 
      });
      
      const userConsistency = userTotalAttendance > 0 ? (userPresentAttendance / userTotalAttendance) * 100 : 0;
      const userSkillPoints = (userCompleted * 100) + (userPresentAttendance * 10) + Math.floor(userConsistency);
      
      userRankings.push({ userId: user._id, skillPoints: userSkillPoints });
    }
    
    userRankings.sort((a, b) => b.skillPoints - a.skillPoints);
    const globalRank = userRankings.findIndex(u => u.userId.toString() === req.user._id.toString()) + 1;
    
    // Get skills by dance type
    const skills = await getSkillsByDanceType(req.user._id);
    
    res.json({
      completedCourses,
      totalAttendance,
      presentAttendance,
      consistencyRate: Math.round(consistencyRate),
      starRating,
      badges,
      skillPoints,
      globalRank,
      totalUsers: allUsers.length,
      skills
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function getBadges(completedCourses, consistencyRate, totalAttendance) {
  const badges = [];
  
  // Course completion badges
  if (completedCourses >= 20) badges.push({ name: 'Dance Master', color: '#ffd700', icon: '👑' });
  else if (completedCourses >= 15) badges.push({ name: 'Expert Dancer', color: '#c0c0c0', icon: '🏆' });
  else if (completedCourses >= 10) badges.push({ name: 'Advanced', color: '#cd7f32', icon: '🥉' });
  else if (completedCourses >= 5) badges.push({ name: 'Intermediate', color: '#4ecdc4', icon: '📈' });
  else if (completedCourses >= 1) badges.push({ name: 'Beginner', color: '#96ceb4', icon: '🌱' });
  
  // Consistency badges
  if (consistencyRate >= 95) badges.push({ name: 'Perfect', color: '#ff6b6b', icon: '💯' });
  else if (consistencyRate >= 85) badges.push({ name: 'Consistent', color: '#4ecdc4', icon: '⭐' });
  
  // Attendance badges
  if (totalAttendance >= 100) badges.push({ name: 'Century', color: '#ffd700', icon: '💯' });
  else if (totalAttendance >= 50) badges.push({ name: 'Half Century', color: '#c0c0c0', icon: '🎯' });
  
  return badges;
}

async function getSkillsByDanceType(userId) {
  const Class = require('../models/Class');
  const Payment = require('../models/Payment');
  
  const skills = {};
  
  // Get all completed courses grouped by dance type
  const completedPayments = await Payment.find({
    user: userId,
    status: 'completed'
  }).populate('class', 'name');
  
  for (const payment of completedPayments) {
    const className = payment.class.name.toLowerCase();
    let danceType = 'General';
    
    if (className.includes('zumba')) danceType = 'Zumba';
    else if (className.includes('hip hop') || className.includes('hiphop')) danceType = 'Hip Hop';
    else if (className.includes('ballet')) danceType = 'Ballet';
    else if (className.includes('salsa')) danceType = 'Salsa';
    else if (className.includes('contemporary')) danceType = 'Contemporary';
    
    if (!skills[danceType]) {
      skills[danceType] = { courses: 0, level: 'Beginner', stars: 1 };
    }
    
    skills[danceType].courses++;
    
    // Update skill level and stars based on courses completed
    if (skills[danceType].courses >= 10) {
      skills[danceType].level = 'Expert';
      skills[danceType].stars = 5;
    } else if (skills[danceType].courses >= 7) {
      skills[danceType].level = 'Advanced';
      skills[danceType].stars = 4;
    } else if (skills[danceType].courses >= 4) {
      skills[danceType].level = 'Intermediate';
      skills[danceType].stars = 3;
    } else if (skills[danceType].courses >= 2) {
      skills[danceType].level = 'Novice';
      skills[danceType].stars = 2;
    }
  }
  
  return skills;
}

// Get user dashboard stats
router.get('/user/stats', auth, async (req, res) => {
  try {
    const totalClasses = await Attendance.countDocuments({ user: req.user._id });
    const presentClasses = await Attendance.countDocuments({ 
      user: req.user._id, 
      status: 'present' 
    });
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyAttendance = await Attendance.countDocuments({
      user: req.user._id,
      status: 'present',
      date: { $gte: thisMonth }
    });
    
    res.json({
      totalClasses,
      presentClasses,
      monthlyAttendance,
      attendanceRate: totalClasses > 0 ? (presentClasses / totalClasses * 100).toFixed(1) : 0
    });
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