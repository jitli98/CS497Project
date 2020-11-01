// models/challenge.js
const db = require("../db");

const Challenge = new db.model("Challenge", {
    name: {
        type: String, 
        required: [true, 'Challenge name is required'],
        maxlength: [128, 'Challenge name exceeds max character limit'],
        unique: true,
        trim: true  // trims off any preceding/trailing white spaces
    },
    description:{
        type: String, 
        required: [true, 'Description is required'],
        maxlength: [512, ' Description exceeds max character limit'],
    },
    difficulty:{
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
    },
    testCases: [
        {
            input:[{}], 
            expectedOutput:[{}],
            _id: false,
            id: false,
        }
    ],
    date:{ 
        type: Date, 
        default: Date.now 
    }
});

module.exports = Challenge;

