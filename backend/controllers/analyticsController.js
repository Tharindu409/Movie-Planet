const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const LocalMovie = require("../models/localMovieModel");

// Dashboard Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await LocalMovie.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Most Rated Movies (movies with the most reviews)
    const mostReviewed = await Review.aggregate([
      { $group: { _id: "$movieId", reviewCount: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 5 }
    ]);

    // Most Rated Movies (highest average rating with at least 1 review)
    const topRated = await Review.aggregate([
      { $group: { _id: "$movieId", avgRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
      { $match: { reviewCount: { $gte: 1 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 }
    ]);

    // Recent users (last 5 signups)
    const recentUsers = await User.find({}).select("-password").sort({ createdAt: -1 }).limit(5);

    // Recent reviews
    const recentReviews = await Review.find({}).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalMovies,
      totalReviews,
      mostReviewed,
      topRated,
      recentUsers,
      recentReviews
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
