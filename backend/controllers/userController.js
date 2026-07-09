const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Watchlist Controllers
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  const { id, title, poster_path, release_date } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    // Check if duplicate
    const exists = user.watchlist.some(movie => movie.id === id);
    if (exists) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    user.watchlist.push({ id, title, poster_path, release_date });
    await user.save();
    res.status(200).json({ message: "Added to watchlist", watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(req.user.id);
    user.watchlist = user.watchlist.filter(movie => movie.id !== parseInt(id));
    await user.save();
    res.status(200).json({ message: "Removed from watchlist", watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({
      message: "Profile updated",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete own account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_secret_key", // In production, set JWT_SECRET in .env
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Google Sign-In
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'No id token provided' });

  try {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // create a user with a random password (social login)
      const randomPass = crypto.randomBytes(16).toString('hex');
      const hashed = await bcrypt.hash(randomPass, 10);
      user = new User({ name, email, password: hashed });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google login error', err);
    res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
};