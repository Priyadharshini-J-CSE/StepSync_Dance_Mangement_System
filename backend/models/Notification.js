const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['class_request', 'class_accepted', 'class_rejected', 'class_created', 'class_updated', 'class_deleted'],
    required: true 
  },
  message: { type: String, required: true },
  relatedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);