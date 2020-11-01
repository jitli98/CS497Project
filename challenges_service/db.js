// db.js
const mongoose = require("mongoose");

const account = 'ampinto';
const password = 'n6u7V5wxoPmr6piX';
const uri = `mongodb+srv://${account}:${password}@cluster0.l4vjr.mongodb.net/challenges?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.log("db.js error: " + error));;

mongoose.connection.on('connected', function(){
    console.log("db.js: Connected to MongoDB");
});

module.exports = mongoose;