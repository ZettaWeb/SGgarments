const mongoose = require('mongoose');

const storeConfigSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  storeName: String,
  whatsappNumber: String,
  phone: String,
  email: String,
  address: String,
  hours: String,
  logo: String,
  heroImage: String
}, { timestamps: true });

module.exports = mongoose.models.StoreConfig || mongoose.model('StoreConfig', storeConfigSchema);
