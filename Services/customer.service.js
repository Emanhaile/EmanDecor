// service.js
const db = require("../DBconfig/DBconfig");

// Create a new customer
const createCustomer = async (customerData) => {
  try {
    // SQL query to insert a new customer
    const insertCustomerQuery =
      "INSERT INTO customers (user_id, customer_firstName, customer_lastName, company_name, address, customer_email, customer_phone) VALUES (?,?, ?, ?, ?, ?, ?)";
    const result = await db.query(insertCustomerQuery, [
      customerData.user_id,
      customerData.customer_firstName,
      customerData.customer_lastName,
      customerData.company_name,
      customerData.address,
      customerData.customer_email,
      customerData.customer_phone,
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
const getAllCustomers = async () => {
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
    "SELECT * FROM customers ORDER BY customer_firstName ASC";
  const rows = await db.query(getAllCustomersQuery);
  return rows;
};

// Get a customer by ID
const getCustomerById = async (id) => {
  if (!id) throw new Error("Customer ID is required");

  try {
    // SQL query to get customer by ID
    const getCustomerByIdQuery =
      "SELECT * FROM customers WHERE customer_id = ?";
    const rows = await db.query(getCustomerByIdQuery, [id]);
    if (rows.length === 0) throw new Error("Customer not found");
    return rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update customer by ID
const updateCustomer = async (id, customerData) => {
  if (!id) throw new Error("Customer ID is required");

  try {
    // SQL query to check if customer exists by ID
    const checkCustomerQuery = "SELECT * FROM customers WHERE customer_id = ?";
    const [existingCustomer] = await db.query(checkCustomerQuery, [id]);
    if (!existingCustomer) throw new Error("Customer not found");

    // Update customer information
    const updateCustomerQuery =
      "UPDATE customers SET customer_firstName = ?, customer_lastName = ?, company_name = ?, address = ?, customer_email = ?, customer_phone = ? WHERE customer_id = ?";
    await db.query(updateCustomerQuery, [
      customerData.customer_firstName,
      customerData.customer_lastName,
      customerData.company_name,
      customerData.address,
      customerData.customer_email,
      customerData.customer_phone,
      id,
    ]);

    return { message: "Customer updated successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete customer by ID
const deleteCustomer = async (id) => {
  if (!id) throw new Error("Customer ID is required");

  try {
    // SQL query to check if customer exists by ID
    const checkCustomerQuery = "SELECT * FROM customers WHERE customer_id = ?";
    const [existingCustomer] = await db.query(checkCustomerQuery, [id]);
    if (!existingCustomer) throw new Error("Customer not found");

    // SQL query to delete customer
    const deleteCustomerQuery = "DELETE FROM customers WHERE customer_id = ?";
    await db.query(deleteCustomerQuery, [id]);

    return { message: "Customer deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
