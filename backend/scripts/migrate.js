// One-time data migration: seeds backend/data/*.json into MongoDB.
// Run with: node backend/scripts/migrate.js
// Safe to re-run — it upserts by unique id (products: id, orders: orderId,
// enquiries: enquiryId, config: key "main").

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Enquiry = require('../models/Enquiry');
const StoreConfig = require('../models/StoreConfig');

const dataDir = path.join(__dirname, '../data');

function readJson(fileName, fallback) {
  try {
    const file = path.join(dataDir, fileName);
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err.message);
    return fallback;
  }
}

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to .env first.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Products
  const products = readJson('products.json', []);
  if (products.length) {
    await Product.bulkWrite(
      products.map(p => ({
        updateOne: { filter: { id: p.id }, update: { $set: p }, upsert: true }
      }))
    );
    console.log(`Products migrated: ${products.length}`);
  } else {
    console.log('No products to migrate.');
  }

  // Orders
  const orders = readJson('orders.json', []);
  if (orders.length) {
    await Order.bulkWrite(
      orders.map(o => ({
        updateOne: { filter: { orderId: o.orderId }, update: { $set: o }, upsert: true }
      }))
    );
    console.log(`Orders migrated: ${orders.length}`);
  } else {
    console.log('No orders to migrate.');
  }

  // Enquiries
  const enquiries = readJson('enquiries.json', []);
  if (enquiries.length) {
    await Enquiry.bulkWrite(
      enquiries.map(e => ({
        updateOne: { filter: { enquiryId: e.enquiryId }, update: { $set: e }, upsert: true }
      }))
    );
    console.log(`Enquiries migrated: ${enquiries.length}`);
  } else {
    console.log('No enquiries to migrate.');
  }

  // Store config
  const savedConfig = readJson('config.json', {});
  const defaults = {
    storeName: process.env.STORE_NAME || 'SG Fashion',
    whatsappNumber: process.env.STORE_WHATSAPP_NUMBER || '919876543210',
    phone: process.env.STORE_PHONE || '+91 98765 43210',
    email: process.env.STORE_EMAIL || 'support@sggarments.com',
    address: process.env.STORE_ADDRESS || 'Commercial Hub, M.G. Road, Kolkata, West Bengal — 700007',
    hours: process.env.STORE_HOURS || 'Mon – Sat: 10:00 AM – 8:30 PM | Sun: 11:00 AM – 6:00 PM'
  };
  const config = { key: 'main', ...defaults, ...savedConfig };
  await StoreConfig.findOneAndUpdate({ key: 'main' }, { $set: config }, { upsert: true });
  console.log('Store config migrated.');

  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
