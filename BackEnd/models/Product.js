import mongoose from 'mongoose';
import User from './User.js';
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  status: {type :String , default:"Pending"},
});

const Product = mongoose.model('Product', productSchema);
export default Product;
