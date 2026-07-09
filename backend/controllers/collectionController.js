const Collection = require("../models/collectionModel");

// Create collection
exports.createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const collection = new Collection({
      user: req.user.id,
      name,
      description
    });
    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all collections for a user
exports.getUserCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single collection
exports.getCollectionDetails = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (collection.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update collection details
exports.updateCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (collection.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    collection.name = name || collection.name;
    collection.description = description || collection.description;
    
    await collection.save();
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (collection.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await collection.deleteOne();
    res.status(200).json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add movie to collection
exports.addMovieToCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { movieId, title, poster_path } = req.body;

    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (collection.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    // Prevent duplicates
    const exists = collection.movies.find(m => m.movieId === movieId);
    if (exists) return res.status(400).json({ message: "Movie already in collection" });

    collection.movies.push({ movieId, title, poster_path });
    await collection.save();
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove movie from collection
exports.removeMovieFromCollection = async (req, res) => {
  try {
    const { collectionId, movieId } = req.params;
    
    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (collection.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    collection.movies = collection.movies.filter(m => m.movieId !== movieId);
    await collection.save();
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
