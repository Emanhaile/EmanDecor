// controller.js
const customerService = require("../Services/customer.service");

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const result = await customerService.createCustomer(req.body);
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
const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const result = await customerService.updateCustomer(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const result = await customerService.deleteCustomer(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
