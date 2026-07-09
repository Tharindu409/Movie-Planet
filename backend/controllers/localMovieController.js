const LocalMovie = require("../models/localMovieModel");

exports.createMovie = async (req, res) => {
  try {
    const movie = new LocalMovie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await LocalMovie.find({}).sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await LocalMovie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await LocalMovie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await LocalMovie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
