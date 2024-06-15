const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    Username:{
        type : String,
        required : true
    },
    Email:{
        type : String,
        required:true
    },
    Password:{
        type : String,
        required:true
    },
    Score:{
        type:Number,
        required : true
    }
})

const Register = new mongoose.model("User",userSchema);

module.exports = Register;