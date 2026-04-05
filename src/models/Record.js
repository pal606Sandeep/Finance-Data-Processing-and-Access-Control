import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  type: { 
    type: String, 
    enum: ['Income', 'Expense'], 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  description: { 
    type: String, 
    trim: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isDeleted: {
     type: Boolean, 
     default: false 
    }
}, { timestamps: true });

export default mongoose.model('Record', recordSchema);