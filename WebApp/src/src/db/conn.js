const mongoose = require("mongoose");
const conn = mongoose.connection;
mongoose.connect("mongodb://0.0.0.0/PredictivePlay")

conn.once('open',()=>{
    console.log("successfully connected to database ...");
})

conn.on('error',()=>{
    console.log("error connecting to database")
    process.exit();
})