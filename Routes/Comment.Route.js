const express = require("express");
const router = express.Router();
const commentController = require("../Controller/Comment.controller");

// POST request to create a new comment declaration
router.post("/api/comment", commentController.createComment);

// GET request to fetch all comment declarations
router.get("/api/comment", commentController.getAllcomments);

// GET request to fetch a comment declaration by its unique ID
router.get("/api/comment/:id", commentController.getcommentById);

// GET request to fetch comment declarations by user ID


// PUT request to update a specific comment declaration by its ID
router.put("/api/comment/:id", commentController.updatecomment);

// DELETE request to remove a comment declaration by its ID
router.delete("/api/comment/:id", commentController.deletecomment);

// Export the router to use it in the main application file
module.exports = router;
