const express = require("express");
const router = express.Router();
const userController = require("../Controller/Register.controller");

// Create a new user
router.post("/api/users", userController.createUser);

// Get a user by ID
router.get("/api/users/:id", userController.getUserById);

// Get all users
router.get("/api/users", userController.getAllUsers);

// Update a user by ID
router.put("/api/users/:id", userController.updateUser);

// Delete a user by ID
router.delete("/api/users/:id", userController.deleteUser);
// get all user roles
// Define the route for fetching roles
router.get("/api/roles", userController.getRoles);
module.exports = router;
