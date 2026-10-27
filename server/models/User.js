import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 50,
      match: [/^[a-z0-9_]+$/i, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    bio: { type: String, default: '', maxlength: 500 },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);