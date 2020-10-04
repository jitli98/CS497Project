const express = require('express');
const mongoose = require('mongoose');

const config = require('./config/');

const userRouter = require('./router/userRouter');
const authRouter = require('./router/authRouter');

const app = express();

/********* MIDDLEWARE **********/
app.use(express.json()); // middleware (modifies incoming request data)


/******** ROUTEHANDLERS ********/
app.use('/userprofile', userRouter);
app.use('/', authRouter);


/********* SERVER *********/
const port = config.port || 8000;
const hostname = config.host || '127.0.0.1';
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

/********* DATABASE *********/
const DB = config.database.url.replace('<password>', config.database.password);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection is successful!');
});