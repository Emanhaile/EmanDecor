const bcrypt = require("bcryptjs");
const userService = require("./Register.service");

const login = async (userData) => {
  try {
    // Fetch user by email
    const user = await userService.getUserByEmail(userData.user_email);

    // If no user is found, return failure response
    if (!user) {
      return {
        status: "fail",
        message: "User not found",
      };
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      userData.user_password_value,
      user.user_password
    );

    // If the password does not match, return failure response
    if (!passwordMatch) {
      return {
        status: "fail",
        message: "Incorrect password",
      };
    }

    // If login is successful, return success response with user data
    return {
      status: "success",
      data: user,
    };
  } catch (error) {
    console.error("Login Service Error:", error.message);
    return {
      status: "fail",
      message: "An error occurred during the login process",
    };
  }
};

module.exports = {
  login,
};
