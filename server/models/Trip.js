import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
    destination: { type: String, required: [true, 'Destination is required'], trim: true, maxlength: 100 },
    startDate: { type: Date },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // `this` is the document because we use .save() on updates
          return !value || !this.startDate || value >= this.startDate;
        },
        message: 'End date cannot be before start date',
      },
    },
    description: { type: String, trim: true, maxlength: 2000 },
    rating: { type: Number, min: [1, 'Rating must be at least 1'], max: [5, 'Rating cannot exceed 5'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);