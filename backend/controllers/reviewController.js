const Review = require("../models/reviewModel");
const User = require("../models/userModel");

// Add a review
exports.addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const review = new Review({
      user: req.user.id,
      userName: user.name,
      movieId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this movie" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get reviews for a movie
exports.getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    
    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    res.status(200).json({ message: "Updated", review });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
