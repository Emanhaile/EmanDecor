// controller.js
const commentService = require("../Services/Comment.service");

// Create a new customer
const createComment = async (req, res) => {
  try {
    const result = await commentService.createComment(req.body);
    // res.status(201).json(result);
    if (!result) {
      res.status(400).json({
        error: "Failed to create customers",
      });
    } else {
      res.status(200).json({
        status: "true",
        customer_id: result.customer_id,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
const getAllcomments = async (req, res) => {
  try {
    const comment = await commentService.getAllcomments();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a customer by ID
const getcommentById = async (req, res) => {
  try {
    const comment = await commentService.getcommentById(req.params.id);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
const updatecomment = async (req, res) => {
  try {
    const result = await commentService.updatecomment(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a customer
const deletecomment = async (req, res) => {
  try {
    const result = await commentService.deleteComment(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getAllcomments,
  getcommentById,
  updatecomment,
  deletecomment,
};
