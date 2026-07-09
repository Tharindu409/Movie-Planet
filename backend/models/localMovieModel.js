const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  posterImage: {
    type: String, // URL or base64
  },
  trailerLink: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("LocalMovie", movieSchema);
