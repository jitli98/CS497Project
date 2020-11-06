//controllers/create-challenge-controller
const Challenge = require('../models/challenge');
const fetch = require('node-fetch');

const hostname = 'http://submission-history:';
const submissionPort = '5050';
const submissionHostname = 'http://submission-history:';
const testingPort = '8000';

const maxChallengesPerPage = 20;

/// RETURN TEST CASES FOR SPECIFIED CHALLENGE ///
exports.challengeParametersGet = async function(req, res, next) { 
    var challengeId = req.query.challengeId; 
    console.log("got a request for test cases");
    await Challenge.find({"id": challengeId}, 'testCases id', function(err, result){
        if(err){
            res.send(err);
        } else {         
            res.json(result[0]);
        } 
    });
}


/// RETURNS SPECIFIED NUMBER OF CHALLENGE OBJECTS ///
exports.getChallengeSet = async function(req, res, next){
    console.log("Challenge Service got a request for challenge");
    var numChallenges = req.query.numChallenges;

    // Default number of challenges to return if num challenges is not specified
    if(numChallenges == null){
        numChallenges=10;
    }

    // Fetch challenges from data base
    await Challenge.find({}, function(err, result) {
        if(err){
            res.send(err);
        } else {   
            console.log(result);         
            res.json(result);
        }
    }) 
    .limit(maxChallengesPerPage);
}

// RETURNS HIGHSCORE OBJECTS FOR SPECIFIED CHALLENGE ///
exports.getHighscores = async function(req, res, next){
    var challengeId = req.query.challengeId;
    var programmingLanguage = req.query.programmingLanguage;
    console.log(req);

    if(challengeId == null || programmingLanguage == null){
       res.send(500, { error: "Unable to get highscores because no challengeId or programming language was provided." });
    }

    // Get Highscores from Submission History Service
    var url = `${submissionHostname}${submissionPort}/getChallengeHighscores?challengeId=${challengeId}&programmingLanguage=${programmingLanguage}`;
    fetch(url)                          // Send request
    .then(response => response.json())  // Parse response
    .then(data => {                     // Data contains the text/body of response
        console.log("Recieved highscores from submissions service" + data);
        res.status(200).json(data);
    })                            
    .catch(err => res.send(err));       // maybe change this to res.send(500, {error: err})); ? 
}

/// SAVE A NEW CHALLENGE TO DB ///
exports.challengeCreatePost = async function(req, res, next){
    console.log(req.body);
    // Check if a challenge with the same name already exists
    await Challenge.exists({'name': req.body.name}, function(err, result){
        if(err){
            res.send(err);
        } else if(result == true){  // the challenge already exists
            res.status(500).send('Error: That challenge name already exists');
        } 
    });

    // Challenge Name is unique if we are here
    // Create new db object from our model
    var newChallenge = new Challenge();
    newChallenge.name = req.body.name;
    newChallenge.description = req.body.description;
    newChallenge.difficulty = req.body.difficulty;
    
    // Add test cases to our db object
    // STILL NEED TO VALIDATE TEST INPUTS (THEY MUST BE ARRAYS)
    // Case 1: There are multiple test cases
    var testCaseSet = [];
    if ( req.body.testInput instanceof Array ) {
        for(var i in req.body.testInput){
            var testCase = {};
            testCase.input = JSON.parse(req.body.testInput[i]);
            testCase.expectedOutput = JSON.parse(req.body.testExpected[i]);
            testCaseSet.push(testCase);
        }   
    // Case 2: Only 1 test case
    } else {
        console.log(req.body.testInput);
        var testCase = {};
        testCase.input = JSON.parse(req.body.testInput);
        testCase.expectedOutput = JSON.parse(req.body.testExpected);
        testCaseSet.push(testCase);
    }
    newChallenge.testCases = testCaseSet;
    
    // save the new challenge in our data base
    await newChallenge.save(function(err, result){
        if(err){
            res.send(err);
        } else { 
            res.redirect('/challengeSet');
        }
    }); 
}

/// DELETE ALL DOCUMENTS IN DB ///
exports.deleteAllDocuments = async function(req,res){
    await Challenge.deleteMany({}, function(){
        console.log("All documents deleted from database");
    });
}

/// TEST REQUESTS ///
exports.test = function(req, res, next){
    var data = [
        {
            "challengeName": "chal 1",
            "userName": "thinhFam",
            "executionTime": "1000",
            "dateSubmitted": "10/23/2020",
            "programmingLanguage": "Java",
        },
        {   "challengeName": "chal 1",
            "userName": "austinp",
            "executionTime": "10",
            "dateSubmitted": "10/22/2020",
            "programmingLanguage": "Java"
        },
        {   "challengeName": "chal 1",
            "userName": "derpthemeus",
            "executionTime": "1",
            "dateSubmitted": "10/22/2030",
            "programmingLanguage": "TypeScript"
    }
        
    ];
    res.render("highscores", {"data":data});
}





///=========================RENDER HTML=======================================///

// RETURNS HTML PAGE CONTAINING HIGHSCORES FOR SPECIFIED CHALLENGE ///
exports.highscoresPageGet = async function(req, res, next){
    var challengeId = req.query.challengeId;
    var programmingLanguage = req.query.programmingLanguage;

    if(challengeId == null || programmingLanguage == null){
       res.send(500, { error: "Unable to get highscores because no challengeId or programming language was provided." });
    }

    // Get Highscores from Submission History Service
    var url = `${submissionHostname}${submissionPort}/getChallengeHighscores?challengeId=${challengeId}&programmingLanguage=${programmingLanguage}`;
    fetch(url)                          // Send request
    .then(response => response.json())  // Parse response
    .then(data => {                     // Data contains the text/body of response
        var submissions = makeSubmissionObjects(data);
        res.render("highscores", {"data":submissions});  
    })                            
    .catch(err => res.send(err));       // maybe change this to res.send(500, {error: err})); ? 
}

/// RETURNS AN HTML PAGE CONTAINING CHALLENGE SET  ///
exports.challengeSetPageGet = async function(req, res){
    // Fetch challenges from data base
    await Challenge.find({}, function(err, result) {
        if(err){
            res.send(err);
        } else {            
            res.render("challengeSet", {"result":result});
        }
    }) 
    .limit(maxChallengesPerPage);
}

function makeSubmissionObjects(data){
    var submissions = [];
    for(var i in data.body.userName){
        var submission = {};
        submission.userID = data.body.userID[i];
        submission.userName = data.body.userName[i];
        submission.challengeId = data.body.challengeId[i];
        submission.challengeName = data.body.challengeName[i];
        submission.programmingLanguage = data.body.programmingLanguage[i];
        submission.dateSubmitted = data.body.dateSubmitted[i];
        submission.executionTime = data.body.executionTime[i];
        submission.didAllTestsPass = data.body.didAllTestsPass[i];
        submissions.push(submission);
    }
    return submissions;
}



///==============================================================================///


//GET /getUserSubmissions?userId=12345
// get user submissions --> challenges will link to some other table of all people who have completed challenge
// user submissions will have some metrics stored with it, such as run time, memory usage, test cases past


// May need this later for error checking form data and updating html
    // check that name is valid and check that it does not already exist
    // var challenge = new Challenge(req.body);
    //     challenge.save(function(err, challenge){
    //         if(err){
    //             console.log('Error Inserting New Data');
    //             if (err.name == 'ValidationError') {
    //                 for (field in err.errors) {
    //                     console.log(err.errors[field].path); 
    //                 }
    //             }

    //             // could still set them to invalid and just change the message
    //         } else {
    //             // show a new page saying it worked
    //             res.status(201).json(challenge);
    //         }
    //     });