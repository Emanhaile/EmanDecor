// Import the mysql2/promise module
const mysql = require("mysql2/promise");
require("dotenv").config();  // Ensure environment variables are loaded

// Configuration object for the database connection
const dbconfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,  // Adjust as needed based on traffic
};

// Create a connection pool using the specified configuration
const pool = mysql.createPool(dbconfig);

// Function to execute a SQL query using the connection pool
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;  // Return the result of the query
  } catch (error) {
    console.error('Database query error:', error);
    throw error;  // Rethrow the error for higher-level handling
  }
}

// Export the query function to make it accessible from other files
module.exports = { query };
