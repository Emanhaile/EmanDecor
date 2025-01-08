const express= require('express')
const router= express.Router();
const installController = require('../Controller/Install.Controller');
// Create a route to handle the install request using the GET method
router.get('/install', installController.install);
module.exports=router;