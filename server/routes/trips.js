import express from 'express';
import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Every trip route requires a valid JWT
router.use(protect);

// Only these fields can ever be written by a client
const ALLOWED_FIELDS = ['title', 'destination', 'startDate', 'endDate', 'description', 'rating'];

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
    await req.trip.deleteOne();
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    handleError(err, res);
  }
});

export default router;