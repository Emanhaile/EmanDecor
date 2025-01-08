
const db = require("../DBconfig/Dbconfig"); // Adjust the path as needed

// Create a new custom declaration
const createCustomDeclaration = async (customDeclarationData) => {
  try {
    const { user_id, customer_id, file_name, file_path } = customDeclarationData;

    // Validate customer ID existence
    const customerQuery = "SELECT * FROM customers WHERE customer_id = ?";
    const customer = await db.query(customerQuery, [customer_id]);

    const userQuery = "SELECT * FROM users WHERE user_id = ?";
    const user = await db.query(userQuery, [user_id]);
    if (!customer || customer.length === 0) {
      throw new Error(`Customer with ID ${customer_id} does not exist.`);
    }

    // Insert custom declaration
    const insertQuery = `
      INSERT INTO customdeclarations (user_id, customer_id, file_name, file_path)
      VALUES (?,?, ?, ?)
    `;
    const result = await db.query(insertQuery, [user_id, customer_id, file_name, file_path]);

    return {
      declaration_id: result.insertId,
      status: "true",
    };
  } catch (error) {
    console.error("Error creating custom declaration:", error.message);
    throw new Error("An error occurred while creating the custom declaration: " + error.message);
  }
};


// Get all custom declarations
const getAllCustomDeclarations = async () => {
  try {
    const query = "SELECT  cd.declaration_id, cd.file_name, cd.file_path, cd.upload_date, c.customer_firstName, c.customer_lastName, c.company_name FROM  Customdeclarations cd JOIN customers c ON cd.customer_id = c.customer_id;";
    const rows = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error retrieving all custom declarations:", error.message);
    throw new Error("An error occurred while retrieving custom declarations.");
  }
};
const getCustomDeclarationsByCustomerId = async (user_id) => {
  if (user_id === undefined || user_id === null) {
    throw new Error("Customer ID cannot be undefined or null");
  }

  try {
    const query =  `
    SELECT *
        FROM \`Customdeclarations\` cd
        JOIN \`customers\` c ON cd.customer_id = c.customer_id
        JOIN \`users\` u ON cd.user_id = u.user_id
        WHERE u.user_id =?` ; 
    const rows = await db.query(query, [user_id]); // Ensure customer_id is properly passed
    return rows; // This should return an array of declarations
  } catch (error) {
    console.error(
      "Error retrieving custom declarations by customer ID:",
      error.message
    );
    throw new Error("An error occurred while retrieving custom declarations.");
  }
};

// Get custom declaration by ID
const getCustomDeclarationById = async (id) => {
  if (!id) throw new Error("Custom declaration ID is required");

  try {
    const query = "SELECT * FROM Customdeclarations WHERE declaration_id = ?";
    const rows = await db.query(query, [id]);
    if (rows.length === 0) throw new Error("Custom declaration not found");
    return rows[0];
  } catch (error) {
    console.error("Error retrieving custom declaration by ID:", error.message);
    throw new Error(
      "An error occurred while retrieving the custom declaration."
    );
  }
};

// Update custom declaration by ID
const updateCustomDeclaration = async (id, customDeclarationData) => {
  if (!id) throw new Error("Custom declaration ID is required");

  try {
    const { file_name, file_path, customer_id } = customDeclarationData;

    // Ensure the custom declaration exists before updating
    const existingDeclaration = await getCustomDeclarationById(id);
    if (!existingDeclaration) {
      throw new Error("Custom declaration not found");
    }

    const query = `
      UPDATE Customdeclarations
      SET file_name = ?, file_path = ?, customer_id = ?
      WHERE declaration_id = ?
    `;
    await db.query(query, [
      file_name ||  existingDeclaration.file_name,
      file_path ||  existingDeclaration.file_path,
      customer_id || existingDeclaration.customer_id,
      id,
    ]);

    return { message: "Custom declaration updated successfully" };
  } catch (error) {
    console.error("Error updating custom declaration:", error.message);
    throw new Error("An error occurred while updating the custom declaration.");
  }
};

// Delete custom declaration by ID
const deleteCustomDeclaration = async (id) => {
  if (!id) throw new Error("Custom declaration ID is required");


try {
    // Ensure the custom declaration exists before deleting
    const existingDeclaration = await getCustomDeclarationById(id);
    if (!existingDeclaration) {
      throw new Error("Custom declaration not found");
    }

    const query = "DELETE FROM Customdeclarations WHERE declaration_id = ?";
    await db.query(query, [id]);
    return { message: "Custom declaration deleted successfully" };
  } catch (error) {
    console.error("Error deleting custom declaration:", error.message);
    throw new Error("An error occurred while deleting the custom declaration.");
  }
};

module.exports = {
  createCustomDeclaration,
  getCustomDeclarationsByCustomerId,
  getAllCustomDeclarations,
  getCustomDeclarationById,
  updateCustomDeclaration,
  deleteCustomDeclaration,
};