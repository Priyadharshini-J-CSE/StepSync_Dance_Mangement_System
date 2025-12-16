const mongoose = require('mongoose');

const classRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  package: { type: String, enum: ['3month', '1year'], required: true },
  status: { type: String, enum: ['inactive', 'pending', 'accepted', 'rejected'], default: 'pending' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  requestDate: { type: Date, default: Date.now },
  responseDate: Date,
  autoRejectDate: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } // 3 days from now
});

module.exports = mongoose.model('ClassRequest', classRequestSchema);