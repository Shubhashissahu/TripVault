import express from 'express';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUT /api/users/profile: update own bio/username (protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (username !== undefined) user.username = username;
    await user.save();

    res.json({
      user: { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio },
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Username already taken' });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:username/profile: PUBLIC, no auth
router.get('/:username/profile', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('name username bio createdAt');

    if (!user) return res.status(404).json({ message: 'Traveller not found' });

    const trips = await Trip.find({ user: user._id, isPrivate: false })
      .select('title destination startDate endDate rating coverImage')
      .sort({ startDate: -1, createdAt: -1 });

    res.json({ user, trips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
