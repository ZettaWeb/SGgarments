const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  enquiryId: { type: String, required: true },
  timestamp: String,
  name: String,
  phone: String,
  email: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
