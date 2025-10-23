import mongoose from 'mongoose';

const StockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  type: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.StockMovement || mongoose.model('StockMovement', StockMovementSchema);
