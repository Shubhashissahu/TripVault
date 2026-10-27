import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const [emailTaken, usernameTaken] = await Promise.all([
      User.exists({ email: email.toLowerCase() }),
      User.exists({ username: username.toLowerCase() }),
    ]);
    if (emailTaken) return res.status(409).json({ message: 'Email already registered' });
    if (usernameTaken) return res.status(409).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, username, email, password: hashed });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      // Race condition safety net: two simultaneous signups with the same value
      return res.status(409).json({ message: 'Email or username already taken' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors)[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const valid = user && (await bcrypt.compare(password, user.password));

    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;