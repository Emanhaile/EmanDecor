const express = require("express");
const router = express.Router();
const customerController = require("../Controller/CustomDeclaration.controller");

// Customer routes
router.post("/api/custom", customerController.createCustomDeclaration);
router.get("/api/custom", customerController.getAllCustomDeclarations);
router.get("/api/custom/:id", customerController.getCustomDeclarationById); // Fetch by single ID
router.get(
  "/api/custom/customer/:user_id",
  customerController.getCustomDeclarationsByCustomerId
); // Fetch by customer ID
router.put("/api/custom/:id", customerController.updateCustomDeclaration);
router.delete("/api/custom/:id", customerController.deleteCustomDeclaration);

module.exports = router;
