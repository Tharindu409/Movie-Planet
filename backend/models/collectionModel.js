const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  movies: [{
    movieId: {
      type: String, // TMDB Movie ID
      required: true,
    },
    title: String,
    poster_path: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model("Collection", collectionSchema);
