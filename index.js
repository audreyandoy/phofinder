var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var db = require("./models");
require('dotenv').config();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var ejsLayouts = require("express-ejs-layouts");

// Put secret in env file
app.use(session({
  secret: process.env.SESSION_SECRET,
	resave: true,
  saveUninitialized: true,
}));

app.use(cookieParser());

// setup express
app.use(ejsLayouts);
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/static/'));


//global variables
app.use(function(req, res, next) {
  if (req.session.userId) {
    db.user.findByPk(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    });
  } else {
    console.log("user not logged in");
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index');
  console.log('req current user ' + req.currentUser);
});

app.get("/search", function(req, res) {
	if (req.currentUser) {
		res.render("search");
	} else {
		console.log('You must be logged in to search for Pho!');
	}
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/profile", function(req, res) {
	db.userfavorites.findAll({
    where: {
      userId: req.session.userId
    }
  }).then(function(favorites){
    if (req.currentUser) {
      res.render("profile", { favorites: favorites});
    } 
  });
});

app.use('/result', require('./controller/search'));
app.use('/', require('./controller/auth'));

app.listen(process.env.PORT || 3000)