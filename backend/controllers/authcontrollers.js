const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

exports.signup = async (req, res) => {
  // same logic you already have
   try {
      const { username, email, password } = req.body;
  
      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
  
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashed = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        username,
        email,
        password: hashed,
        profilePic: `https://placehold.co/100x100`, // Replace with Cloudinary logic
      });
  
      res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
  // same login logic
  try {
      const { emailOrUsername, password } = req.body;
  
      const user = await User.findOne({
        $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
      });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  
      res.json({
        token,
        user: {
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          followers: user.followers,
          following: user.following,
          library: user.library,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
};

exports.getProfile = async (req, res) => {
  // get user from token
  const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
};
