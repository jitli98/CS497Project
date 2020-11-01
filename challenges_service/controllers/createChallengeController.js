//controllers/create-challenge-controller
const Challenge = require('../models/challenge');
const fetch = require('node-fetch');

const hostname = 'http://localhost:';
const submissionPort = '7000';
const testingPort = '8000';

const maxChallengesPerPage = 20;

/// RETURN TEST CASES FOR SPECIFIED CHALLENGE ///
exports.challengeParametersGet = async function(req, res, next) { 
    var challengeId = req.query.challengeId; 
    await Challenge.find({"name": challengeId}, 'testCases', function(err, result){
        if(err){
            res.send(err);
        } else {         
            res.json(result)
        } 
    });
}

/// SAVE A NEW CHALLENGE TO DB ///
exports.challengeCreatePost = async function(req, res, next){
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
        var testCase = {};
        testCase.input = [JSON.parse(req.body.testInput)];
        testCase.expectedOutput = JSON.parse(req.body.testExpected);
        testCaseSet.push(testCase);
    }
    newChallenge.testCases = testCaseSet;
    console.log(newChallenge.testCases);

    // save the new challenge in our data base
    await newChallenge.save(function(err, result){
        if(err){
            res.send(err);
        } else { 
            res.redirect('/challengeSet');
        }
    }); 
}

/// RETURNS SPECIFIED NUMBER OF CHALLENGES ///
exports.getChallengeSet = async function(req, res, next){
    var numChallenges = req.query.num;

    // Default number of challenges to return if num challenges is not specified
    if(numChallenges == null){
        numChallenges=10;
    }

    // Fetch challenges from data base
    await Challenge.find({}, function(err, result) {
        if(err){
            res.send(err);
        } else {            
            res.json(result);
        }
    }) 
    .limit(maxChallengesPerPage);
}


/// RETURNS AN HTML PAGE CONTAINING CHALLENGE SET  ///
exports.challengeSetPageGet = async function(req, res){
    // Fetch challenges from data base
    await Challenge.find({}, function(err, result) {
        if(err){
            res.send(err);
        } else {            
            console.log(result);
            res.render("challengeSet", {"result":result});
        }
    }) 
    .limit(maxChallengesPerPage);
}


// RETURNS HTML PAGE CONTAINING HIGHSCORES FOR SPECIFIED CHALLENGE ///
exports.highscoresPageGet = async function(req, res, next){
    var challengeId = req.query.challengeId;
    var programmingLanguage = req.query.programmingLanguage;

    if(challengeId == null || programmingLanguage == null){
       res.send(500, { error: "Unable to get highscores because no challengeId or programming language was provided." });
    }

    // Get Highscores from Submission History Service
    var url = `${hostname}${submissionPort}/getChallengeHighscores?challengeId=${challengeId}&programmingLanguage=${programmingLanguage}`;
    fetch(url)                          // Send request
    .then(response => response.json())  // Parse response
    .then(data => {                     // Data contains the text/body of response
        console.log(data)
        res.render("highscores", {"data":data});  
    })                            
    .catch(err => res.send(err));       // maybe change this to res.send(500, {error: err})); ? 
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