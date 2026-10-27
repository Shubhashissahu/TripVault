import 'dotenv/config'; // MUST be first: ESM hoists imports, so index.js's dotenv.config() runs too late for this file
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tripvault',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1600, crop: 'limit', quality: 'auto' }],
  },
});

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPG, PNG or WEBP images are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Wrapper so multer errors return clean JSON 400s instead of an HTML stack trace
export const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image must be under 5 MB'
      : err.code === 'LIMIT_UNEXPECTED_FILE' ? 'Upload field must be named "image"'
      : err.message || 'Upload failed';
    res.status(400).json({ message });
  });
};