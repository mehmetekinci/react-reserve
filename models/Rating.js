import mongoose from 'mongoose';

const { ObjectId, Number } = mongoose.Schema.Types;

const RatingSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },

  product: {
    type: ObjectId,
    ref: 'Product',
  },
  star: {
    type: Number,
  },
});

export default mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
