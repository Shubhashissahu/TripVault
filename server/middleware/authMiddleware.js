import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = null;

  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Token revocation: reject tokens issued before a password change or logout invalidation
    if (
      decoded.tokenVersion !== undefined &&
      user.tokenVersion !== undefined &&
      decoded.tokenVersion !== user.tokenVersion
    ) {
      return res.status(401).json({ message: 'Session has been invalidated. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};