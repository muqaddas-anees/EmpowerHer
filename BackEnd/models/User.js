import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  businessDescription: { type: String },
  phoneNumber: { type: String },
  isAdmin: { type: Boolean, default: false },
  status: { type: String, default: "Pending" },
  
});

const User = mongoose.model('User', userSchema);
export default User;
