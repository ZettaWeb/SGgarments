// Contact form submission handlers.

const fs = require('fs');
const path = require('path');
const Enquiry = require('../models/Enquiry');
const { isDbConnected } = require('../db');
const { getStoreConfig } = require('./configController');

const enquiriesFilePath = path.join(__dirname, '../data/enquiries.json');

function stripMongo(doc) {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

async function readEnquiries() {
  if (isDbConnected()) {
    try {
      const docs = await Enquiry.find({}).lean();
      return docs.map(stripMongo);
    } catch (err) {
      console.error('Error reading enquiries from MongoDB:', err);
    }
  }

  try {
    if (!fs.existsSync(enquiriesFilePath)) {
      fs.writeFileSync(enquiriesFilePath, '[]', 'utf8');
      return [];
    }
    const raw = fs.readFileSync(enquiriesFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading enquiries data:', err);
    return [];
  }
}

async function saveEnquiries(enquiries) {
  if (isDbConnected()) {
    try {
      const ops = enquiries.map(e => ({
        updateOne: {
          filter: { enquiryId: e.enquiryId },
          update: { $set: e },
          upsert: true
        }
      }));
      await Enquiry.bulkWrite(ops);
      return true;
    } catch (err) {
      console.error('Error saving enquiries to MongoDB:', err);
    }
  }

  try {
    fs.writeFileSync(enquiriesFilePath, JSON.stringify(enquiries, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving enquiry:', err);
    return false;
  }
}

// POST /api/v1/enquiries
exports.createEnquiry = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in your Name, Phone Number, and Message.'
    });
  }

  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid 10-digit phone number.'
    });
  }

  const storeConfig = await getStoreConfig();
  const storeWhatsapp = storeConfig.whatsappNumber;
  const enquiryId = 'ENQ-' + Math.floor(100000 + Math.random() * 900000);

  const enquiryRecord = {
    enquiryId,
    timestamp: new Date().toISOString(),
    name,
    phone: cleanPhone,
    email: email || '',
    message
  };

  const enquiries = await readEnquiries();
  enquiries.push(enquiryRecord);
  await saveEnquiries(enquiries);

  const waMsg = `*SG GARMENTS STORE ENQUIRY*\n*ID:* #${enquiryId}\n\nName: ${name}\nPhone: ${cleanPhone}\nEmail: ${email || 'N/A'}\n\n*Message:*\n${message}`;
  const whatsappUrl = `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(waMsg)}`;

  res.status(201).json({
    success: true,
    message: 'Enquiry submitted successfully',
    enquiryId,
    whatsappUrl
  });
};

// GET /api/v1/enquiries
exports.getEnquiries = async (req, res) => {
  const enquiries = await readEnquiries();
  res.json({
    success: true,
    count: enquiries.length,
    data: enquiries
  });
};
