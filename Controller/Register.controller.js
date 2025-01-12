// const bcrypt = require("bcrypt");
// const userService = require("../Services/Register.service");
// // Check if user exists by email

// // Create a new user
// async function createUser(req, res) {
//   try {
//     const userData = req.body;

//     // Validate inputs
//     // if (
//     //   !user_firstName ||
//     //   !user_lastName ||
//     //   !user_email ||
//     //   !user_password ||
//     //   !/^[a-zA-Z\s'-]+$/.test(user_firstName) ||
//     //   !/^[a-zA-Z\s'-]+$/.test(user_lastName) ||
//     //   !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user_email) ||
//     //   user_password.length < 8
//     // ) {
//     //   return res.status(400).json({ error: "Please provide valid user data" });
//     // }

//     // Check if user email already exists
//     const userExists = await userService.checkIfUserExists(req.body.user_email);
//     if (userExists) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash the password
//     //const hashedPassword = await bcrypt.hash(user_password, 12);

//     // Create user in the database
//     // const userData = {
//     //   user_firstName,
//     //   user_lastName,
//     //   user_email,
//     //   user_password: hashedPassword,
//     // };

//     const users = await userService.registerUser(userData);
//     // if (!result || result.error) {
//     //   return res.status(400).json({ error: "Failed to create user" });
//     // }

//     // Respond with success
//     // return res
//     //   .status(201)
//     //   .json({ status: "success", message: "User registered successfully" });
//     if (!users) {
//       res.status(400).json({
//         error: "Failed to create user",
//       });
//     } else {
//       res.status(200).json({
//         status: "true",
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Something went wrong!" });
//   }
// }

// // Get a user by ID
// async function getUserById(req, res) {
//   try {
//     const userId = req.params.id;

//     // Fetch the user by ID
//     const users = await userService.getUserById(userId);

//     if (!users) {
//       return res.status(404).json({ status: "fail", error: "User not found" });
//     }

//     // Respond with success
//     return res.status(200).json({ status: "success", data: users });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error fetching user" });
//   }
// }

// // Get all users
// async function getAllUsers(req, res) {
//   try {
//     // Fetch all users
//     const users = await userService.getAllUsers();

//     // Respond with success
//     if (!users) {
//       res.status(400).json({
//         error: "Failed to get all users!",
//       });
//     } else {
//       res.status(200).json({
//         status: "success",
//         data: users,
//       });
//     }
//     // return res.status(200).json({ status: "success", data: users });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error fetching users" });
//   }
// }

// // Update a user by ID
// async function updateUser(req, res) {
//   try {
//     const userId = req.params.id;
//     const userData = req.body;

//     // Validate inputs
//     // if (
//     //   !userId ||
//     //   !userData ||
//     //   !userData.user_firstName ||
//     //   !userData.user_lastName ||
//     //   !userData.user_email ||
//     //   !userData.user_password ||
//     //   !/^[a-zA-Z\s'-]+$/.test(userData.user_firstName) ||
//     //   !/^[a-zA-Z\s'-]+$/.test(userData.user_lastName) ||
//     //   !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
//     //     userData.user_email
//     //   ) ||
//     //   userData.user_password.length < 8
//     // ) {
//     //   return res.status(400).json({ error: "Please provide valid user data" });
//     // }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(userData.user_password_value, 12);

//     // Update the user in the database
//     const updatedUser = await userService.updateUser(userId, {
//       ...userData,
//       user_password: hashedPassword,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ status: "fail", error: "User not found" });
//     }

//     // Respond with success
//     return res
//       .status(200)
//       .json({ status: "success", message: "User updated successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error updating user" });
//   }
// }

// // Delete a user by ID
// async function deleteUser(req, res) {
//   try {
//     const userId = req.params.id;

//     // Delete the user from the database
//     const deleted = await userService.deleteUser(userId);

//     if (!deleted) {
//       return res.status(404).json({ status: "fail", error: "User not found" });
//     }

//     // Respond with success
//     return res
//       .status(200)
//       .json({ status: "success", message: "User deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Error deleting user" });
//   }
// }
// async function getRoles(req, res, next) {
//   try {
//     const roles = await userService.getAllRoles();
//     // res.status(200).json(roles);
//     if (!roles) {
//       res.status(400).json({
//         error: "Failed to get all roles!",
//       });
//     } else {
//       res.status(200).json({
//         status: "success",
//         data: roles,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching roles:", error);
//     res.status(500).json({ error: "An error occurred while fetching roles" });
//   }
// }
// module.exports = {
//   createUser,
//   getUserById,
//   getAllUsers,
//   updateUser,
//   deleteUser,
//   getRoles,
// };
const bcrypt = require("bcryptjs");
const userService = require("../Services/Register.service");

// Create a new user
async function createUser(req, res) {
  try {
    const userData = req.body;
    // const { user_email, user_password, user_firstName, user_lastName } =
    //   req.body;

    // Validate inputs
    // if (
    //   !user_firstName ||
    //   !user_lastName ||
    //   !user_email ||
    //   !user_password ||
    //   !/^[a-zA-Z\s'-]+$/.test(user_firstName) ||
    //   !/^[a-zA-Z\s'-]+$/.test(user_lastName) ||
    //   !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user_email) ||
    //   user_password.length < 8
    // ) {
    //   return res.status(400).json({ error: "Invalid user data provided" });
    // }

    // Check if user email already exists
    const userExists = await userService.checkIfUserExists(req.body.user_email);
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    //const hashedPassword = await bcrypt.hash(user_password, 12);

    // Create user in the database
    // const newUser = {
    //   user_firstName,
    //   user_lastName,
    //   user_email,
    //   user_password: hashedPassword,
    // };
    const createdUser = await userService.registerUser(userData);

    if (!createdUser) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    return res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get a user by ID
async function getUserById(req, res) {
  try {
    const userId = req.params.id;

    // Fetch the user by ID
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ status: "success", data: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();

    if (!users) {
      return res.status(400).json({ error: "Failed to fetch users" });
    }

    return res.status(200).json({ status: "success", data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update a user by ID
// async function updateUser(req, res) {
//   try {
//     const userId = req.params.id;
//     const { user_firstName, user_lastName, user_email, user_password } =
//       req.body;

//     // Validate inputs
//     if (
//       !user_firstName ||
//       !user_lastName ||
//       !user_email ||
//       !/^[a-zA-Z\s'-]+$/.test(user_firstName) ||
//       !/^[a-zA-Z\s'-]+$/.test(user_lastName) ||
//       !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user_email)
//     ) {
//       return res.status(400).json({ error: "Invalid user data provided" });
//     }

//     // Hash the password if it was updated
//     const hashedPassword = user_password
//       ? await bcrypt.hash(user_password, 12)
//       : undefined;

//     const updatedUserData = {
//       user_firstName,
//       user_lastName,
//       user_email,
//       ...(hashedPassword && { user_password: hashedPassword }), // only update password if provided
//     };

//     const updatedUser = await userService.updateUser(userId, updatedUserData);

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res
//       .status(200)
//       .json({ status: "success", message: "User updated successfully" });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }
// Update a user by ID
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const userUpdates = req.body; // Get all fields from the request body

    // Perform the update
    const updatedUser = await userService.updateUser(userId, userUpdates);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ status: "success", message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a user by ID
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ status: "success", message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get all roles
async function getRoles(req, res) {
  try {
    const roles = await userService.getAllRoles();

    if (!roles) {
      return res.status(400).json({ error: "Failed to fetch roles" });
    }

    return res.status(200).json({ status: "success", data: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getRoles,
};
