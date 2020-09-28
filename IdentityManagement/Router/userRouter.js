const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router(); //creates a sub router for the different directories

router
    .route('/')
    .get(userController.getUserInfo);

module.exports = router;