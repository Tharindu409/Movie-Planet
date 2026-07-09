const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", collectionController.createCollection);
router.get("/", collectionController.getUserCollections);
router.get("/:id", collectionController.getCollectionDetails);
router.put("/:id", collectionController.updateCollection);
router.delete("/:id", collectionController.deleteCollection);

// Movie management within collections
router.post("/:collectionId/movies", collectionController.addMovieToCollection);
router.delete("/:collectionId/movies/:movieId", collectionController.removeMovieFromCollection);

module.exports = router;
