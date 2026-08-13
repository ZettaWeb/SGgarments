// Image upload handler. Uploads images to Cloudinary and returns the secure URL.

const { uploadImage, isConfigured } = require('../cloudinary');

function isValidImageInput(value) {
  if (typeof value !== 'string' || !value) return false;
  return (
    value.startsWith('data:image/') ||
    value.startsWith('http://') ||
    value.startsWith('https://')
  );
}

// POST /api/v1/upload (admin only)
// Body: { image: <data URL or http(s) URL>, folder?: string }
exports.uploadImage = async (req, res) => {
  if (!isConfigured()) {
    return res.status(500).json({
      success: false,
      error: 'Cloudinary is not configured. Set CLOUDINARY_* environment variables.'
    });
  }

  const { image, folder } = req.body || {};

  if (!isValidImageInput(image)) {
    return res.status(400).json({
      success: false,
      error: 'image must be a base64 data URL (data:image/...) or an http(s) URL.'
    });
  }

  try {
    const secureUrl = await uploadImage(image, folder || 'sg-fashion');
    return res.json({
      success: true,
      message: 'Image uploaded successfully.',
      url: secureUrl
    });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Image upload failed. Please try again.'
    });
  }
};
