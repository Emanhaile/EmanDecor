const express = require("express");
const router = express.Router();
const loginController = require("../Controller/Login.controller");

router.post("/api/user/login", loginController.Login);

module.exports = router;
