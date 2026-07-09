const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary - Replace with your own credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "your_api_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
});

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
