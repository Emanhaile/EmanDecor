const loginService = require("../Services/Login.service");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

async function Login(req, res, next) {
  console.log(req.body);
  const { user_email, user_password_value } = req.body;

  try {
    // Validate input
    if (!user_email || !user_password_value) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required",
      });
    }

    // Call the login method from the login service
    const user = await loginService.login({ user_email, user_password_value });

    // Check if login was unsuccessful
    if (user.status === "fail") {
      return res.status(403).json({
        status: user.status,
        message: user.message,
      });
    }

    // Check if user data exists and has necessary properties
    // const userRecord = user.data;
    // if (!userRecord || !userRecord.user_id || !userRecord.user_email) {
    //   return res.status(500).json({
    //     status: "error",
    //     message: "Invalid user data received",
    //   });
    // }

    // Create a JWT token with user data
    const payload = {
      user_id: user.data.user_id,
      user_email: user.data.user_email,
      user_firstName: user.data.user_firstName,
      user_lastName: user.data.user_lastName,
      user_role: user.data.user_role,
    };
    console.log(payload);

    // Ensure jwtSecret is defined
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set");
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: "JWT_SECRET environment variable is missing",
      });
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

    // Prepare the response data
    console.log("token is", token);

    const sendBack = {
      user_token: token,
    };

    // Send the token back to the client
    return res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: sendBack,
    });
  } catch (err) {
    // Handle any unexpected errors
    console.error("Login Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

module.exports = { Login };
