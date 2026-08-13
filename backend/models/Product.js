const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: Number,
  originalPrice: Number,
  discount: String,
  category: String,
  images: [String],
  shortDescription: String,
  fullDescription: String,
  features: [String],
  specs: Object,
  variants: Object,
  availability: String,
  rating: Number,
  reviewsCount: Number
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
