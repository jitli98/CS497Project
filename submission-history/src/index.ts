import express from 'express';
import mysql from 'promise-mysql';
var fs = require('fs');
var multer = require('multer');
const bodyParser = require("body-parser");
const server = express();
var data = fs.readFileSync('data.json');
var words = JSON.parse(data);

server.use(express.json());
server.use(express.urlencoded({ extended: true })); 
server.use(bodyParser.text()); // for req.body
server.use(bodyParser.urlencoded({ extended: true })); // for req.body

async function start() {

// Create connection
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'submissionHistory'
});

// Connect
//db.connect().catch((err) => console.error(err))
//db.connect((error) => {
//    if (error) {
//        console.log("Connection " + error);
//    }
//    else {
//        console.log("MySql Connected...");
//    }
//});


// Create DB
server.get('/submission-history', (req, res) => {
    let sql = 'CREATE DATABASE submissionHistory';
     db.query(sql, (error, result) => {
        if (error) {
            console.log("Create Database " + error);
            res.status(401).json({
                status: "failed",
                message: error
            });
        }
        else {
            res.status(200).json({
                status: "success",
                message: "Submission History Database Created..."
            });
        }
    });
});

// Create table
server.get('/table', (req, res) => {
    let sql = 'CREATE TABLE submissionTable(submission int PRIMARY KEY AUTO_INCREMENT, userID INT(255), userName VARCHAR(255), challengeId INT(255), challengeName VARCHAR(255), programmingLanguage CHAR(255), dateSubmitted DATETIME ,executionTime INT, didAllTestsPass BOOL)'; 
     db.query(sql, (error, result) => {
        if (error) {
            console.log("Create table " + error);
            res.status(401).json({
                status: "failed",
                message: error
            });
        }
        else {
            res.status(200).json({
                status: "success",
                message: "Submission Table created..."
            });
        }
    });
});

// Create submission
// To do this may cause SQL injection. Fix it after presentation
server.post('/createSubmission', async (req, res) => {
    try {
        let sql = `INSERT INTO submissionTable(userID, userName, challengeId, challengeName, programmingLanguage, dateSubmitted, executionTime, didAllTestsPass) VALUES(${req.body.userID}, "${req.body.userName}", ${req.body.challengeId}, ${JSON.stringify(req.body.challengeName)}, "${req.body.programmingLanguage}", "${new Date().toISOString().slice(0, 19).replace('T', ' ')}", "${req.body.executionTime}", ${req.body.didAllTestsPass})`;
            let result = await db.query(sql);
        res.status(200).json({
            status: "success",
            message: "Data inserted..."
        });
    }
    catch (error) {
        console.log("Insert Submimssion Table " + error);
        res.status(401).json({
            status: "failed",
            message: error
        });
    }
});

// Insert local json file to mySQL
/*server.get('/insertSubmission', async (req, res) => {
    try {
        for (let i = 0; i < words.length; i++) {
            let sql = `INSERT INTO submissionTable(userID, userName, challengeId, challengeName, programmingLanguage, dateSubmitted, executionTime, didAllTestsPass) VALUES(${words[i].userID}, "${words[i].userName}", ${words[i].challengeId}, ${JSON.stringify(words[i].challengeName)}, "${words[i].programmingLanguage}", "${words[i].dateSubmitted}", "${words[i].executionTime}", ${words[i].didAllTestsPass})`;
            let result = await db.query(sql);
        }
        res.status(200).json({
            status: "success",
            message: "Data inserted..."
        });
    }
    catch (error) {
        console.log("Insert Submimssion Table " + error);
        res.status(401).json({
            status: "failed",
     */
//            message: error
//        });
//    }
//});

// Gerry's request
server.get('/getUserSubmissions', (req, res) => {
    let sql = `SELECT * FROM submissionTable WHERE userId = ${req.query.userId} ORDER BY dateSubmitted DESC`;
    let query = db.query(sql, (error, results) => {
        if (error) {
            console.log("Select " + error);
            if (req.query.userId == '') {
                res.status(404).json({
                    status: "failed",
                    message: "ID is missing"
                });
            }
            else {
                res.status(401).json({
                status: "failed",
                    message: "ID is mismatch"
                });
            }
        }
        else {
            res.status(200).json({
                status: "success",
                message: "Post fetched...",
                data: {
                    results
                }
            });
        }
        
    });
});

// Austin's request 
server.get('/getChallengeHighscores', (req, res) => {
    let sql = `SELECT * FROM submissionTable WHERE challengeId = ${req.query.challengeId} AND programmingLanguage = ${JSON.stringify(req.query.programmingLanguage)} ORDER BY executionTime`;
    let query = db.query(sql, (error, results) => {
        if (error) {
            console.log("Select " + error);
            if (req.query.userId == '' || req.query.programmingLanguage == '') {
                res.status(404).json({
                    status: "failed",
                    message: "ID or language is missing"
                });
            }
            else {
                res.status(401).json({
                    status: "failed",
                    message: "ID or language is mismatch"
                });
            }
        }
        else {
            res.status(200).json({
                status: "success",
                message: "Post fetched...",
                data: {
                    results
                }
            });
            
        }
    });
});

// ===========================================================================================
// Update post
//server.get('/updatepost/:id', (req, res) => {
//    let newTitle = 'Updated Title';
//    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
//    let query = db.query(sql, (error, result) => {
//        if (error) {
//            console.log("Update " + error);
//        }
//        console.log(result);
//        res.send('Post updated...');
//    });
//});

// Delete post
//server.get('/deletepost/:id', (req, res) => {
//    let newTitle = 'Updated Title';
//    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
//    let query = db.query(sql, (error, result) => {
//        if (error) {
//            console.log("Delete " + error);
//        }
//        console.log(result);
//        res.send('Post deleted...');
//    });
//});
// ===========================================================================================

// Server is now listening in port 5050
server.listen(process.env.PORT || 5050, () => {
    console.log('Server started on port 5050');
});

}

start();
