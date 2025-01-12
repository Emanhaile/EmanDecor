// service.js
const db = require("../DBconfig/Dbconfig");

// Create a new customer
const createComment= async (customerData) => {
  try {
    // SQL query to insert a new customer
    const insertCustomerQuery =
      "INSERT INTO comments ( name, email, comment) VALUES (?,?, ?)";
    const result = await db.query(insertCustomerQuery, [
      customerData.name,
      customerData.email,
      customerData.comment,
      
    ]);
    const customerId = result.insertId;

    return {
      // message: "Customer created successfully",
      customer_id: customerId,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all customers
const getAllcomments = async () => {
  //   try {
  //     // SQL query to get all customers
  //     const getAllCustomersQuery = `
  //     SELECT
  //         c.customer_id, c.customer_firstName, c.customer_lastName, c.company_name,
  //         c.customer_email, c.customer_phone, d.project_name, d.document_type,
  //         d.file_path, d.status, d.upload_date
  //     FROM
  //         customers c
  //     JOIN
  //         documents d ON c.customer_id = d.customer_id
  //     ORDER BY
  //         c.customer_firstName ASC, d.upload_date ASC
  // `;

  //     const rows = await db.query(getAllCustomersQuery);
  //     return rows;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // get all customers

  const getAllCustomersQuery =
    "SELECT * FROM comments ORDER BY name ASC";
  const rows = await db.query(getAllCustomersQuery);
  return rows;
};

// Get a customer by ID
const getcommentById = async (id) => {
  if (!id) throw new Error("comment ID is required");

  try {
    // SQL query to get customer by ID
    const getCustomerByIdQuery =
      "SELECT * FROM comments WHERE id = ?";
    const rows = await db.query(getCustomerByIdQuery, [id]);
    if (rows.length === 0) throw new Error("Customer not found");
    return rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update customer by ID
const updatecomment = async (id, customerData) => {
  if (!id) throw new Error("Comment ID is required");

  try {
    // SQL query to check if customer exists by ID
    const checkCustomerQuery = "SELECT * FROM comments WHERE id = ?";
    const [existingCustomer] = await db.query(checkCustomerQuery, [id]);
    if (!existingCustomer) throw new Error("comment not found");

    // Update customer information
    const updateCustomerQuery =
      "UPDATE comments SET name = ?, email= ?, comment= ? WHERE id = ?";
    await db.query(updateCustomerQuery, [
      customerData.name,
      customerData.email,
      customerData.comment,
      id,
    ]);

    return { message: "Comment updated successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete comment by ID
const deleteComment= async (id) => {
  if (!id) throw new Error("comment ID is required");

  try {
    // SQL query to check if comment exists by ID
    const checkCustomerQuery = "SELECT * FROM comments WHERE id = ?";
    const [existingCustomer] = await db.query(checkCustomerQuery, [id]);
    if (!existingCustomer) throw new Error("comment not found");

    // SQL query to delete customer
    const deleteCustomerQuery = "DELETE FROM comments WHERE id = ?";
    await db.query(deleteCustomerQuery, [id]);

    return { message: "comment deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createComment,
  getAllcomments,
  getcommentById,
  updatecomment,
  deleteComment
};
