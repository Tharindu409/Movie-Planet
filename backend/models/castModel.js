const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  biography: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // URL
  },
  birthDate: {
    type: Date,
  },
  moviesAppearedIn: [{
    type: String, // Titles or IDs
  }]
}, { timestamps: true });

module.exports = mongoose.model("Cast", castSchema);
