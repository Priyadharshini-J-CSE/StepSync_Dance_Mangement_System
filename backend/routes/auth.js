const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const DatabaseManager = require('../config/database');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone, address } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { phone: phone && phone.trim() !== '' ? phone : null }
      ].filter(Boolean)
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      role, 
      phone, 
      address,
      status: role === 'admin' ? 'active' : 'inactive'
    });
    await user.save();

    // If admin, create their database
    if (role === 'admin') {
      await DatabaseManager.getConnection(user._id.toString());
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    status: req.user.status,
    phone: req.user.phone,
    address: req.user.address,
    membershipExpiry: req.user.membershipExpiry
  });
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, address },
      { new: true }
    );
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      phone: updatedUser.phone,
      address: updatedUser.address
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export user data
router.get('/export-data', auth, async (req, res) => {
  try {
    const userData = await User.findById(req.user._id).select('-password');
    const userClasses = await require('../models/Class').find({ enrolled: req.user._id });
    const userAttendance = await require('../models/Attendance').find({ user: req.user._id }).populate('class', 'name');
    const userPayments = await require('../models/Payment').find({ user: req.user._id }).populate('class', 'name');
    
    const exportData = {
      profile: userData,
      classes: userClasses,
      attendance: userAttendance,
      payments: userPayments,
      exportDate: new Date()
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deactivate account
router.put('/deactivate', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { status: 'inactive' });
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    // Remove user from all classes
    await require('../models/Class').updateMany(
      { enrolled: req.user._id },
      { $pull: { enrolled: req.user._id } }
    );
    
    // Delete user's data
    await require('../models/Attendance').deleteMany({ user: req.user._id });
    await require('../models/Payment').updateMany(
      { user: req.user._id },
      { status: 'refunded' }
    );
    await require('../models/ClassRequest').deleteMany({ user: req.user._id });
    await require('../models/Notification').deleteMany({ recipient: req.user._id });
    
    // Finally delete the user
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/settings', auth, async (req, res) => {
  try {
    const settings = req.body;
    // In a real app, you'd save settings to a UserSettings model
    // For now, just return success
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('_id name email');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign user to admin
router.put('/assign-admin', auth, async (req, res) => {
  try {
    const { adminId } = req.body;
    await User.findByIdAndUpdate(req.user._id, { adminId });
    res.json({ message: 'Admin assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;