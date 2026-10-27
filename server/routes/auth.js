import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const signToken = (id, tokenVersion = 0) =>
  jwt.sign({ id, tokenVersion }, process.env.JWT_SECRET, { expiresIn: '7d' });

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const WEAK_PASSWORDS = new Set(['123456', '12345678', 'password', 'qwerty', '111111', '123456789']);

const validatePasswordStrength = (password) => {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (WEAK_PASSWORDS.has(password.toLowerCase())) {
    return 'Password is too common and easily guessed. Please choose a stronger password.';
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number';
  }
  return null;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Name, username, email and password are required' });
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
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

    const token = signToken(user._id, user.tokenVersion || 0);
    setAuthCookie(res, token);

    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout - clears cookie and increments tokenVersion to revoke active sessions
router.post('/logout', async (req, res) => {
  let token = null;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.id, { $inc: { tokenVersion: 1 } });
    } catch {}
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me (protected)
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;