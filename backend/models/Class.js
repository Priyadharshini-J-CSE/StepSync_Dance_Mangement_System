const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  instructor: String,
  schedule: {
    days: [String], // ['Monday', 'Wednesday', 'Friday']
    time: String, // '10:00 AM'
    duration: Number // in minutes
  },
  capacity: { type: Number, default: 20 },
  enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  packages: [{
    type: { type: String, enum: ['3month', '1year'] },
    price: Number
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);