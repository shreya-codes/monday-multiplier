import mongoose from 'mongoose';
const historySchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true
  },
  factor:{
    type: Number,
    required: true
  },
  input:{
    type: Number,
    required: true
  },
  output:{
    type: Number,
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

const History = mongoose.model('History', historySchema);
export default History;
