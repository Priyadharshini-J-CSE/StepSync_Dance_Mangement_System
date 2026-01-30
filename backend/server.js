const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const attendanceRoutes = require('./routes/attendance');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const feedbackRoutes = require('./routes/feedback');
const meetingLinkRoutes = require('./routes/meetingLinks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'StepSync Dance Management System API', 
    status: 'Server is running',
    endpoints: {
      auth: '/api/auth',
      classes: '/api/classes',
      attendance: '/api/attendance',
      notifications: '/api/notifications',
      payments: '/api/payments',
      feedback: '/api/feedback',
      meetingLinks: '/api/meeting-links'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/meeting-links', meetingLinkRoutes);

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// MongoDB connection (main database for authentication)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Main MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});