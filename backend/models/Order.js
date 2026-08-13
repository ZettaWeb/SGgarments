const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  timestamp: String,
  customer: Object,
  item: Object,
  paymentMethod: String,
  notes: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
