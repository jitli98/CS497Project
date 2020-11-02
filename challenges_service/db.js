// db.js
require('dotenv').config();
const mongoose = require("mongoose");
const url = process.env.DATABASE_URL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.log("db.js error: " + error));;

mongoose.connection.on('connected', function(){
    console.log("db.js: Connected to MongoDB");
});

module.exports = mongoose;