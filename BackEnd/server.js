import express from "express";
import { connect } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";
import productRoutes from "./routes/productRoutes.js"; // Import product routes
import cors from "cors";
import mongoose from "mongoose";

import nodemailer from "nodemailer";

config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Use built-in express.json() for body parsing
app.use(cors()); // Enable CORS
// Connect to MongoDB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes

// Register Route
app.post("/api/register", async (req, res) => {
  const { fullName, email, password, businessName, businessDescription } =
    req.body;

  try {
    console.log("Register API called with:", req.body);

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists!" });
    }

    // Validate required fields
    if (!fullName || !email || !password || !businessName) {
      console.log("Missing required fields:", {
        fullName,
        email,
        password,
        businessName,
      });
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Hash the password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    console.log("Creating new user...");
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      businessName,
      businessDescription,
    });

    // Save the user to the database
    console.log("Saving user to the database...");
    await newUser.save();

    console.log("User registered successfully!");
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error in Register API:", error.message);

    // Return detailed error response for debugging in development
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: "Login successful!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
});

// Middleware to authenticate the user via JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId, isAdmin: decoded.isAdmin };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

// Profile Route
app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
});
//get all the user
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({ status: "Pending" });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching users" }, { error: error.message });
  }
});
// PUT /api/users/:id/status

app.put("/api/users/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error });
  }
});

app.delete("/api/users/delete/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user" }, { error: error.message });
  }
});

// Profile Update Route
app.put("/api/profile/:id", authenticate, async (req, res) => {
  const { id } = req.params; // Correctly extract the id from req.params
  const { fullName, email, phoneNumber, businessName } = req.body;
  console.log("id is " + id);

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID!" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the authenticated user's ID matches the requested ID
    if (req.user.userId !== id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this profile!" });
    }

    // Update user fields if provided
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (businessName) user.businessName = businessName;

    // Save updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully!", user }); // Return updated user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!", error: error.message }); // Provide error message in the response
  }
});

// to send mail
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASSWORD, // Your Gmail password or app password
  },
});
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Set up email options
  const mailOptions = {
    from: email, // Sender address
    to: process.env.GMAIL_USER, // Recipient email (your Gmail address)
    subject: "New Contact Form Submission", // Subject
    text: `You have received a new message from ${name} (${email}):\n\n${message}`, // Body content
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// Use product routes for handling products
app.use(productRoutes); // Add the product routes to the app

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export authenticate as a named export after the middleware definition
export { authenticate };
