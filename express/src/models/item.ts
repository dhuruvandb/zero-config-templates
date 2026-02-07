import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [1, 'Item name cannot be empty'],
    maxlength: [100, 'Item name too long']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item;