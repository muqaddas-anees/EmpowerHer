import express from 'express';
import Product from '../models/Product.js';
import authenticate from '../middleware/authenticate.js';
import mongoose from 'mongoose';
import fs from 'fs';
const router = express.Router();


//get all the pending products for admin to approve
router.get("/api/products/admin", async (req, res) => {
  try {
    const products = await Product.find({ status: "Pending" }).populate("seller", "fullName email");

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT API to update product status
router.put("/api/products/:id/status", async (req, res) => {
  const { id } = req.params; // Product ID from the route parameter
  const { status } = req.body; // New status from the request body

  try {
    // Check if the status is valid
    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the product by ID and update its status
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    // If the product is not found, return an error
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Respond with the updated product
    res.status(200).json({ message: `Product status updated to ${status}`, product: updatedProduct });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
});







import {upload} from '../multer.js';
import cloudinary from '../middleware/cloudinary.js';
// Assuming your Product model is here


// Multer configuration to handle file uploads

// POST route to add a product
router.post('/api/products', authenticate, upload.single('image'), async (req, res) => {
  const { name, category, price, description } = req.body;
  const seller = req.user._id;
  
  try {
    console.log('Multer file data:', req.file);
    // If the image is uploaded, send it to Cloudinary
    let imageUrl = '';

    if (req.file && req.file.path) {
     
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Get the secure URL from the Cloudinary response
      imageUrl = result.secure_url;
    }
    console.log(` the path image is ${imageUrl}`);

    // Create a new product with the image URL and other details
    const newProduct = new Product({
      name,
      image: imageUrl, // Store the Cloudinary image URL
      category,
      price,
      description,
      seller,
    });

    // Save the new product to the database
    await newProduct.save();
    
    // Return the newly added product
    fs.unlinkSync(req.file.path);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product' });
  }
});




router.get("/api/consumer/products", async (req, res) => {
  try {
    const products = await Product.find({status: 'Accepted'});

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET route to fetch all products
router.get("/api/products", authenticate, async (req, res) => {
  try {
    const products = await Product.find({seller: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});


router.put("/api/products/edit/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, image, category, price, description} = req.body;

  try {
    // Validate product ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID!" });
    }

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, image, category, price, description, },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product updated successfully!", updatedProduct });
  } catch (error) {
    console.error("Error editing product:", error.message);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});
// DELETE route to remove a product by ID
router.delete("/api/products/delete/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the product ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID!" });
    }

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});


export default router;
