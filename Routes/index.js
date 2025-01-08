const express = require("express");
const router = express.Router(); // Corrected Router initialization
const register = require("../Routes/Register.route");
const login = require("../Routes/login.route");
const filesubmission = require("./eventBooking.route");
const install = require("../Routes/Install.route");
// const customer = require("../Routes/Customer.route");
const notification = require("../Routes/Notification.route");
const comment = require('../Routes/Comment.Route')
const forgetpassword= require('../Routes/Forgetpassword.route')
const qrcodes =require('../Routes/Qrcodes.route')
// Route definitions
router.use(install); // Ensure install.route exports install
router.use(login); // Ensure register.route exports registerUser
router.use(register); // Ensure login.route exports loginUser
// router.use(customer); // Ensure customer.route exports customer
router.use(filesubmission); // Ensure filesubmission.route exports fileSubmission
router.use(notification);
router.use(comment);
router.use(forgetpassword);
router.use(qrcodes)
// Export router
module.exports = router;
