const express = require("express");
const router = express.Router();

//insert model  
const User = require("../models/userModel");
//insert controller
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post('/google', userController.googleLogin);
router.get("/profile", protect, userController.getMe);
router.put("/profile", protect, userController.updateProfile);
router.delete("/profile", protect, userController.deleteAccount);

// Watchlist routes
router.get("/watchlist", protect, userController.getWatchlist);
router.post("/watchlist", protect, userController.addToWatchlist);
router.delete("/watchlist/:id", protect, userController.removeFromWatchlist);

module.exports = router;