const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const movieCtrl = require("../controllers/localMovieController");
const castCtrl = require("../controllers/castController");
const analyticsCtrl = require("../controllers/analyticsController");

// Lock all routes to Admin Only
router.use(protect, adminOnly);

// Analytics
router.get("/analytics", analyticsCtrl.getAnalytics);

// User Management
router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.adminCreateUser);
router.put("/users/:id", adminController.adminUpdateUser);
router.delete("/users/:id", adminController.adminDeleteUser);

// Movie Management
router.get("/movies", movieCtrl.getMovies);
router.post("/movies", movieCtrl.createMovie);
router.put("/movies/:id", movieCtrl.updateMovie);
router.delete("/movies/:id", movieCtrl.deleteMovie);

// Cast Management
router.get("/cast", castCtrl.getCast);
router.post("/cast", castCtrl.createCast);
router.put("/cast/:id", castCtrl.updateCast);
router.delete("/cast/:id", castCtrl.deleteCast);

module.exports = router;
