import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true
  },
  factor: {
    type: Number,
    required: true,
    default: 1
  },
  input: {
    type: Number,
    required: false,
  }
});

const Item = mongoose.model('Item', itemSchema);

export default Item; 


