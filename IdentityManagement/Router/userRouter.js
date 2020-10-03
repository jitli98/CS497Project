const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router(); //creates a sub router for the different directories

router
    .route('/')
    .get(userController.getUserProfile);


module.exports = router;