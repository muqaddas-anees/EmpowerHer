import {v2 as cloudinary} from 'cloudinary';
import dotenv, { config } from 'dotenv';
config(); // Load environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Replace with your Cloudinary API key
    api_secret:process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
  });

export default cloudinary;