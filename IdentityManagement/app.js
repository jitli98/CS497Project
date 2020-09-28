const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config({path: './config.env'});


const userRouter = require('./Router/userRouter');
// const authController = require('./Controllers/authController');


/********* MIDDLEWARE **********/
app.use(express.json()); // middleware (modifies incoming request data)


/******** ROUTEHANDLERS ********/
app.use('/user', userRouter);
// app.use('/authorization', authController);


/********* SERVER *********/
const port = process.env.PORT || 8000;
const hostname = process.env.HOST || '127.0.0.1';
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});;