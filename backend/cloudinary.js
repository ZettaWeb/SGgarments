// Cloudinary image hosting configuration & helpers.
// Credentials come from CLOUDINARY_* environment variables (.env).

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Uploads an image (data URL, http(s) URL or public_id) and returns the secure URL.
// folder: Cloudinary folder prefix, e.g. 'sg-fashion/products'
async function uploadImage(imageInput, folder = 'sg-fashion') {
  const result = await cloudinary.uploader.upload(imageInput, {
    folder,
    resource_type: 'image',
    overwrite: true
  });
  return result.secure_url;
}

module.exports = { cloudinary, uploadImage, isConfigured };
