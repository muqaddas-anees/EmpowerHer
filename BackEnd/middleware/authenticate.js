import jwt from "jsonwebtoken";
import User from "../models/User.js";
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId, isAdmin: decoded.isAdmin }; // Attach user details
   
 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

export default authenticate;
