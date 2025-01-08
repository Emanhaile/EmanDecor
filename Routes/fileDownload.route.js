const express = require("express");
const path = require("path");
const router = express.Router();

// Endpoint to download a file
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(404).send("File not found");
    }
  });
});

// Additional document-related routes can be added here

module.exports = router;
