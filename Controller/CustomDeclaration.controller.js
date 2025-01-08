
const upload = require("../upload"); // Import multer configuration
const customDeclarationService = require("../Services/CustomDeclaration.services");

// Handle custom declaration creation
const createCustomDeclaration = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      // Log the incoming request body
      console.log("Request body:", req.body);
      
      const { user_id, customer_id, file_name } = req.body;

      if (!customer_id || !file_name) {
        return res.status(400).json({ error: "Required fields are missing." });
      }

      // Prepare custom declaration data
      const customDeclarationData = {
        user_id,
        customer_id,
        file_name,
        file_path: req.file ? req.file.path : null,
      };

      const result = await customDeclarationService.createCustomDeclaration(customDeclarationData);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating custom declaration:", error);
      res.status(500).json({
        error: `An error occurred while creating the custom declaration: ${error.message}`,
      });
    }
  });
};

// Handle getting all custom declarations
const getAllCustomDeclarations = async (req, res) => {
  try {
    const customDeclarations =
      await customDeclarationService.getAllCustomDeclarations();
    res.status(200).json(customDeclarations);
  } catch (error) {
    console.error("Error retrieving custom declarations:", error);
    res.status(500).json({
      error: "An error occurred while retrieving custom declarations.",
    });
  }
};

// Handle getting custom declaration by ID
const getCustomDeclarationById = async (req, res) => {
  const { id } = req.params;
  try {
    const customDeclaration =
      await customDeclarationService.getCustomDeclarationById(id);
    if (!customDeclaration) {
      return res.status(404).json({ error: "Custom declaration not found." });
    }
    res.status(200).json(customDeclaration);
  } catch (error) {
    console.error("Error retrieving custom declaration:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the custom declaration.",
    });
  }
};
// Handle getting custom declarations by customer ID
const getCustomDeclarationsByCustomerId = async (req, res) => {
  const { user_id } = req.params; // Ensure `customer_id` is correctly extracted
  if (!user_id) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  try {
    const customDeclarations =
      await customDeclarationService.getCustomDeclarationsByCustomerId(
        user_id
      );
    if (customDeclarations.length === 0) {
      return res
        .status(404)
        .json({ error: "No custom declarations found for this customer." });
    }
    res.status(200).json(customDeclarations);
  } catch (error) {
    console.error(
      "Error retrieving custom declarations by customer ID:",
      error.message
    );
    res.status(500).json({
      error: "An error occurred while retrieving custom declarations.",
    });
  }
};

// Handle updating custom declaration by ID
const updateCustomDeclaration = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if custom declaration exists before updating
    const existingCustomDeclaration =
      await customDeclarationService.getCustomDeclarationById(id);
    if (!existingCustomDeclaration) {
      return res.status(404).json({ error: "Custom declaration not found." });
    }

    // Handle file upload if a new file is provided
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({ error: err.message });
      }

      // Prepare update data
      const updateData = {
        file_name: req.body.file_name ||  existingCustomDeclaration.file_name,
        file_path: req.file
          ? req.file.path

: existingCustomDeclaration.file_path,
        customer_id:
          req.body.customer_id || existingCustomDeclaration.customer_id,
      };

      const result = await customDeclarationService.updateCustomDeclaration(
        id,
        updateData
      );
      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error updating custom declaration:", error);
    res.status(500).json({
      error: "An error occurred while updating the custom declaration.",
    });
  }
};

// Handle deleting custom declaration by ID
const deleteCustomDeclaration = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if custom declaration exists before deleting
    const existingCustomDeclaration =
      await customDeclarationService.getCustomDeclarationById(id);
    if (!existingCustomDeclaration) {
      return res.status(404).json({ error: "Custom declaration not found." });
    }

    const result = await customDeclarationService.deleteCustomDeclaration(id);
    res
      .status(200)
      .json({ message: "Custom declaration deleted successfully" });
  } catch (error) {
    console.error("Error deleting custom declaration:", error);
    res.status(500).json({
      error: "An error occurred while deleting the custom declaration.",
    });
  }
};

module.exports = {
  createCustomDeclaration,
  getAllCustomDeclarations,
  getCustomDeclarationById,
  getCustomDeclarationsByCustomerId,
  updateCustomDeclaration,
  deleteCustomDeclaration,
};