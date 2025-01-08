const db = require('../DBconfig/Dbconfig'); // Import the query function from db.js
// Find user by email
exports.findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE user_email = ?';
    const result = await db.query(query, [email]);
    return result[0];  // Return the first user (if found) or undefined
};

// Save the password reset token
exports.saveResetToken = async (email, token) => {
    const query = 'INSERT INTO password_resets (user_email, reset_token) VALUES (?, ?)';
    const result = await db.query(query, [email, token]);
    return result;  // Return the result of the insert operation
};
