const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  amount: { type: Number, required: true },
  package: { type: String, enum: ['3month', '1year'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
  paymentMethod: String,
  transactionId: String,
  receiptNumber: String,
  validFrom: Date,
  validUntil: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);