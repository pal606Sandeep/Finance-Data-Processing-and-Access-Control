import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
  name: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
},
  password: {
     type: String,
      required: true,
       select: false 
    }, 
  role: { 
    type: String, 
    enum: ['Admin', 'Analyst', 'Viewer'], 
    default: 'Viewer' 
  },
  status: {
     type: String, 
     enum: ['Active', 'Inactive'], 
     default: 'Active' 
    },
  refreshToken: {
     type: String 
    } 
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);