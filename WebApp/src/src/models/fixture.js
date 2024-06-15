const mongoose = require('mongoose');
const fixtureSchema = new mongoose.Schema({
    Date:{
        type : String,
        required : true
    },
    status:{
        type:Number,
        required : true
    },
    Winner:{
        type:String,
        required : true
    },
    MatchTeams:{
        type : String,
        required:true
    },
    TeamA:{
        type : String,
        required:true
    },
    TeamB:{
        type : String,
        required:true
    }
})

const fixture = new mongoose.model("Fixture",fixtureSchema);

module.exports = fixture;