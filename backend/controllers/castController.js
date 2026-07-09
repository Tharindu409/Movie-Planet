const Cast = require("../models/castModel");

exports.createCast = async (req, res) => {
  try {
    const cast = new Cast(req.body);
    await cast.save();
    res.status(201).json(cast);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCast = async (req, res) => {
  try {
    const cast = await Cast.find({}).sort({ name: 1 });
    res.status(200).json(cast);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateCast = async (req, res) => {
  try {
    const cast = await Cast.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cast) return res.status(404).json({ message: "Cast not found" });
    res.status(200).json(cast);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteCast = async (req, res) => {
  try {
    const cast = await Cast.findByIdAndDelete(req.params.id);
    if (!cast) return res.status(404).json({ message: "Cast not found" });
    res.status(200).json({ message: "Cast deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
