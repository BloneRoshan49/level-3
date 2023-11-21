require('dotenv').config()    //// npm i dotenv
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption'); /// Changes here npm i mongoose-encryption

console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/level2');

const userSchema = new mongoose.Schema({  //// changes here new added
    username: String,
    password: String,
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); /// Changes here Plugin added and process.env.SECRET (have a look in google)

let User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
    res.render('index')
});

app.get('/login', function(req, res){
    res.render('login')
});

app.post('/login', async function(req, res){
    const username =  req.body.username;
    const password = req.body.password;

    try{
        const foundUser = await User.findOne({
           username : username,
        });
        if(foundUser && foundUser.password == password ){
            res.render('home')
        }else{
            res.redirect('login')
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error.')
    }
})

app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', async function(req, res){
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
    });

    try{
       await newUser.save();
       res.redirect('register')
    }catch(err){
        console.log(err);
        res.status(500).send('Internal server error.')
    };
});

app.listen(port, function(){
    console.log(`Server is running on port ${port}`);
});
