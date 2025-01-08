const express = require('express');
const router = express.Router();
const userController = require('../Controller/forgetpassword.controller');

// Route to handle forgot password requests
router.post('/forgot-password', userController.forgotPassword);
// Route to handle reset password requests
router.post('/reset-password/:token', userController.resetPassword);


module.exports = router;
