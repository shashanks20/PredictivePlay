const express = require('express');
const app = express();
const path = require("path");
const hbs = require("hbs");
const session = require('express-session');

require("./db/conn.js");

const Register = require("./models/register.js")
const Fixture = require("./models/fixture.js")
const Prediction = require("./models/submission.js")
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  }));

const port = process.env.PORT || 3000 ;

const static_path = path.join(__dirname,"../public")
const partials_path = path.join(__dirname,"../templates/partials")
const views_path = path.join(__dirname,"../templates/views")

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",views_path);
hbs.registerPartials(partials_path);

hbs.registerHelper('inc', function (value) {
    return value + 1;
});

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/fixtures", async function (req, res) {
    try {
        const allDetails = await Fixture.find({status:0}).exec();
        res.render("fixtures", { details: allDetails });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/leaderboard",async function (req,res) {
    try {
        var mysort = {Score:-1}
        const allDetails = await Register.find().sort(mysort).exec();
        res.render("leaderboard", { details: allDetails });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/predict",async function (req,res){
    try {
        const username = req.query.username;
        const allDetails = await Fixture.find({status:0}).exec();
        const data = {
            username: username,
            details: allDetails
          };
        res.render("predict",data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/fetch-columns/:id', async (req, res) => {
    try {
      const id = req.params.id;
      
      // Use Mongoose to find data by ID and project the specific column
      const result = await Fixture.findById(id,'TeamA TeamB');
      // Send the result as JSON
      res.json(result);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post("/predict", async (req, res) => {
    try {
        const username = req.session.username;
        const match = req.body.match;
        const team = req.body.predicted;
        const user = await Prediction.findOne({ Username: username, MatchID: match });
         if (user) {
           await Prediction.findOneAndUpdate({ Username: username, MatchID: match }, { Team: team });
         } 
        else {
          const registerSubmission = new Prediction({
              Username :   req.session.username,
              MatchID : req.body.match,
              Team: req.body.predicted
          });
          const registered = await registerSubmission.save();
          res.status(201).redirect(`/predict?username=${encodeURIComponent(username)}`);
         }
  
      } 
      catch (error) {
        console.error(error);
        res.status(500).redirect(`/predict?username=${username}`);
      }
  });
  
app.post("/register",async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password===cpassword){
            const registerUser = new Register({
                Username : req.body.fname,
                Email : req.body.email,
                Password: req.body.password,
                Score: 0
            })
           const registered = await registerUser.save();
           res.status(201).redirect("login");
        }
        else{
            res.send("password are not matching")
        }
    } catch(error){
        res.status(400).send(error);
    }
})

app.post("/login",async(req,res)=>{
    try{
        const name = req.body.fname;
        req.session.username = name;
        const pass = req.body.password;
       const user = await Register.findOne({Username:name});
        if(pass===user.Password)
        {
            res.status(201).redirect(`/predict?username=${name}`);
        }
        else{
            res.status(400).send("Invalid login details");
        }

    }catch(error){
        res.status(400).send("Invalid login details");
    }
})



app.listen(port,()=>{
    console.log(`Server is running in port no ${port} `)
});