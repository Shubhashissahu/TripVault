import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import userRoutes from './routes/users.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

dotenv.config();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});
const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; without this, rate limiting sees one IP for everyone
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.json({ message: 'TripVault API running' }));
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);     
app.use('/api/users', userRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler: guarantees JSON responses and suppresses internal stack trace leaks
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Malformed JSON payload' });
  }
  console.error('Unhandled application error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });