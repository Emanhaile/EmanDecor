// /routes/routes.js

const express = require('express');
const { generateQRCode, getCompanyProfile } = require('../Controller/Qrcodes.controller');
const multer = require('multer');
const path = require('path');

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Store uploaded images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  }
});

const upload = multer({ storage: storage });

// Define the routes
const router = express.Router();

// Route to generate QR code
router.post('/generate-qr', upload.single('photo_url'), generateQRCode);

// Route to view the company profile
router.get('/profile/:company_id', getCompanyProfile);

module.exports = router;
