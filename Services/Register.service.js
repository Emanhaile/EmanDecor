const db = require("../DBconfig/Dbconfig");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt

// Check if a user already exists by email
async function checkIfUserExists(email) {
  const query = "SELECT * FROM users WHERE user_email = ? ";
  const rows = await db.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// Register a new user
const registerUser = async (userData) => {
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      userData.user_password_value,
      salt
    );

    // Insert new user into users table
    const insertUserQuery = `
      INSERT INTO users (user_firstName, user_lastName, user_email, user_password) 
      VALUES (?, ?, ?, ?)
    `;
    const rows = await db.query(insertUserQuery, [
      userData.user_firstName,
      userData.user_lastName,
      userData.user_email,
      hashedPassword,
    ]);

    const user_id = rows.insertId;
    const defaultRoleId = 1; // Default role ID for "user"

    // Assign default role to new user
    const insertUserRoleQuery = `
      INSERT INTO user_role (user_id, role_id) 
      VALUES (?, ?)
    `;
    await db.query(insertUserRoleQuery, [user_id, defaultRoleId]);

    return {
      user_id: user_id,
      user_firstName: userData.user_firstName,
      user_lastName: userData.user_lastName,
      user_email: userData.user_email,
    };
  } catch (error) {
    console.error(`Registration Error: ${error.message}`);
    throw new Error(`Registration Error: ${error.message}`);
  }
};

// Get all users with their roles
const getAllUsers = async () => {
  try {
    const getAllUsersQuery = `
      SELECT 
        u.user_id, u.user_firstName, u.user_lastName, u.user_email, r.company_role, u.CreatedAt
      FROM 
        users u
      JOIN 
        user_role ur ON u.user_id = ur.user_id
      JOIN 
        roles r ON ur.role_id = r.role_id
    `;
    const rows = await db.query(getAllUsersQuery);
    return rows;
  } catch (error) {
    console.error(`Error fetching users: ${error.message}`);
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

// Get user by ID with roles
const getUserById = async (id) => {
  if (!id) throw new Error("User ID is required");

  try {
    const getUserByIdQuery = `
      SELECT 
        u.user_id, u.user_firstName, u.user_lastName, u.user_email, r.company_role
      FROM 
        users u
      JOIN 
        user_role ur ON u.user_id = ur.user_id
      JOIN 
        roles r ON ur.role_id = r.role_id
      WHERE 
        u.user_id = ?
    `;
    const rows = await db.query(getUserByIdQuery, [id]);
    if (rows.length === 0) throw new Error("User not found");
    return rows[0];
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const getUserByEmailQuery = `
      SELECT 
        u.user_id, 
        u.user_firstName, 
        u.user_lastName, 
        u.user_email, 
        u.user_password, 
        r.role_id AS user_role
      FROM 
        users u
      INNER JOIN 
        user_role ur ON u.user_id = ur.user_id
      INNER JOIN 
        roles r ON ur.role_id = r.role_id
      WHERE 
        u.user_email = ?
    `;

    // Execute the query with the provided email
    const rows = await db.query(getUserByEmailQuery, [email]);

    // Return the first row from the result set
    return rows[0];
  } catch (error) {
    // Log and throw a descriptive error message
    console.error(`Error fetching user by email: ${error.message}`);
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
};

// Get all roles
const getAllRoles = async () => {
  try {
    const getAllRolesQuery = "SELECT * FROM roles";
    const rows = await db.query(getAllRolesQuery);
    return rows;
  } catch (error) {
    console.error(`Error fetching roles: ${error.message}`);
    throw new Error(`Error fetching roles: ${error.message}`);
  }
};

// Update user by ID
const updateUser = async (id, userData) => {
  if (!id) throw new Error("User ID is required");

  try {
    const checkUserQuery = "SELECT * FROM users WHERE user_id = ?";
    const existingUser = await db.query(checkUserQuery, [id]);
    if (existingUser.length === 0) throw new Error("User not found");

    const updateUserQuery = `
      UPDATE users 
      SET user_firstName = ?, user_lastName = ?, user_email = ?
      WHERE user_id = ?
    `;
    await db.query(updateUserQuery, [
      userData.user_firstName,
      userData.user_lastName,
      userData.user_email,
      id,
    ]);

    if (userData.role_id) {
      const updateRoleQuery = `
        UPDATE user_role 
        SET role_id = ? 
        WHERE user_id = ?
      `;
      await db.query(updateRoleQuery, [userData.role_id, id]);
    }

    return { message: "User updated successfully" };
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Delete user by ID
const deleteUser = async (id) => {
  if (!id) throw new Error("User ID is required");

  try {
    const checkUserQuery = "SELECT * FROM users WHERE user_id = ?";
    const existingUser = await db.query(checkUserQuery, [id]);
    if (existingUser.length === 0) throw new Error("User not found");

    const deleteUserRolesQuery = "DELETE FROM user_role WHERE user_id = ?";
    await db.query(deleteUserRolesQuery, [id]);

    const deleteUserQuery = "DELETE FROM users WHERE user_id = ?";
    await db.query(deleteUserQuery, [id]);

    return { message: "User deleted successfully" };
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  checkIfUserExists,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getAllRoles,
  updateUser,
  deleteUser,
};
