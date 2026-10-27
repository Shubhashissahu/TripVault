import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Trip from '../models/Trip.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/upload.js';

// Extracts Cloudinary public_id from secure URL to allow clean deletion
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('/upload/')) return null;
  const parts = url.split('/upload/')[1];
  if (!parts) return null;
  const withoutVersion = parts.replace(/^v\d+\//, '');
  const dotIndex = withoutVersion.lastIndexOf('.');
  return dotIndex !== -1 ? withoutVersion.substring(0, dotIndex) : withoutVersion;
};

const router = express.Router();

// Every trip route requires a valid JWT
router.use(protect);

// Only these fields can ever be written by a client
const ALLOWED_FIELDS = ['title', 'destination', 'startDate', 'endDate', 'description', 'rating', 'isPrivate'];

const pickAllowed = (body) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key)));

// Rejects malformed IDs with a clean 400 instead of a Mongoose crash
const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid trip ID' });
  }
  next();
};

// Loads the trip and enforces ownership. Reused by GET/PUT/DELETE by id.
const loadOwnedTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    req.trip = trip;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
};

// POST /api/trips: create
router.post('/', async (req, res) => {
  try {
    const trip = await Trip.create({ ...pickAllowed(req.body), user: req.user.id });
    res.status(201).json(trip);
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/trips: list the logged-in user's trips only
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/trips/:id: single trip
router.get('/:id', validateId, loadOwnedTrip, (req, res) => {
  res.json(req.trip);
});

// PUT /api/trips/:id: update (owner only)
router.put('/:id', validateId, loadOwnedTrip, async (req, res) => {
  try {
    req.trip.set(pickAllowed(req.body)); // `user` can never be reassigned
    await req.trip.save();               // runs all validators, including the date check
    res.json(req.trip);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/trips/:id: delete (owner only)
router.delete('/:id', validateId, loadOwnedTrip, async (req, res) => {
  try {
    const photosToDelete = [...(req.trip.photos || [])];
    await req.trip.deleteOne();

    // Cleanup Cloudinary assets asynchronously in the background so storage quota isn't wasted
    if (photosToDelete.length > 0) {
      Promise.allSettled(
        photosToDelete.map((url) => {
          const publicId = extractPublicId(url);
          return publicId ? cloudinary.uploader.destroy(publicId) : Promise.resolve();
        })
      ).catch((err) => console.error('Cloudinary cleanup error on delete:', err));
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    handleError(err, res);
  }
});

const MAX_PHOTOS = 20;

const photoLimit = (req, res, next) => {
  if (req.trip.photos.length >= MAX_PHOTOS) {
    return res.status(400).json({ message: `A trip can have at most ${MAX_PHOTOS} photos` });
  }
  next();
};

// POST /api/trips/:id/upload: attach one photo (owner only)
// Order matters: ownership is verified BEFORE multer runs, so strangers can't burn your Cloudinary quota
router.post('/:id/upload', validateId, loadOwnedTrip, photoLimit, uploadImage, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const url = req.file.path; // Cloudinary secure URL

    // Atomic update enforcing quota at the database level to prevent race condition limit bypasses
    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: req.trip._id,
        $expr: { $lt: [{ $size: '$photos' }, MAX_PHOTOS] },
      },
      [
        {
          $set: {
            photos: { $concatArrays: ['$photos', [url]] },
            coverImage: {
              $cond: {
                if: { $or: [{ $eq: ['$coverImage', ''] }, { $not: ['$coverImage'] }] },
                then: url,
                else: '$coverImage',
              },
            },
          },
        },
      ],
      { new: true }
    );

    if (!updatedTrip) {
      // If concurrent uploads exceeded MAX_PHOTOS, immediately delete the uploaded file from Cloudinary
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
      return res.status(400).json({ message: `A trip can have at most ${MAX_PHOTOS} photos` });
    }

    res.status(201).json(updatedTrip);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/trips/:id/photos: delete a single photo (owner only)
router.delete('/:id/photos', validateId, loadOwnedTrip, async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl || typeof photoUrl !== 'string') {
      return res.status(400).json({ message: 'photoUrl is required' });
    }

    if (!req.trip.photos.includes(photoUrl)) {
      return res.status(404).json({ message: 'Photo not found in this trip' });
    }

    const remainingPhotos = req.trip.photos.filter((p) => p !== photoUrl);
    const newCoverImage = req.trip.coverImage === photoUrl
      ? (remainingPhotos[0] || '')
      : req.trip.coverImage;

    req.trip.photos = remainingPhotos;
    req.trip.coverImage = newCoverImage;
    await req.trip.save();

    // Clean up from Cloudinary in the background
    const publicId = extractPublicId(photoUrl);
    if (publicId) {
      cloudinary.uploader.destroy(publicId).catch((err) =>
        console.error('Cloudinary photo deletion failed:', err)
      );
    }

    res.json(req.trip);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /api/trips/:id/cover: set a specific photo as cover (owner only)
router.put('/:id/cover', validateId, loadOwnedTrip, async (req, res) => {
  try {
    const { coverImage } = req.body;
    if (!coverImage || typeof coverImage !== 'string' || !req.trip.photos.includes(coverImage)) {
      return res.status(400).json({ message: 'Selected photo is not part of this trip' });
    }

    req.trip.coverImage = coverImage;
    await req.trip.save();
    res.json(req.trip);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;