const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "movie-planet",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 500, height: 750, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
