import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'currentStock não pode ser negativo'],
  },
  minStock: {
    type: Number,
    required: true,
    min: [0, 'minStock não pode ser negativo'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'price deve ser maior ou igual a 0'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
