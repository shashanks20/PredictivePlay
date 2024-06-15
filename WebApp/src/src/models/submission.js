const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
    Username:{
        type : String,
    },
    MatchID:{
        type : Object,
        required:true
    },
    Team:{
        type : String,
        required:true
    },
})

const Prediction = new mongoose.model("Submission",SubmissionSchema);

module.exports = Prediction;