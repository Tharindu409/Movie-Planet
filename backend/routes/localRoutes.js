const express = require('express');
const router = express.Router();
const movieCtrl = require('../controllers/localMovieController');
const castCtrl = require('../controllers/castController');

// Public local movies
router.get('/movies', movieCtrl.getMovies);
router.get('/movies/:id', movieCtrl.getMovieById);

// Public cast
router.get('/cast', castCtrl.getCast);
router.get('/cast/:id', async (req, res) => {
  try {
    const Cast = require('../models/castModel');
    const c = await Cast.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Cast not found' });
    res.status(200).json(c);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
