const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, reviewController.addReview);
router.get("/:movieId", reviewController.getMovieReviews);
router.put("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
