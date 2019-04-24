var express = require("express");
var app = express();
require('dotenv').config();
var bodyParser = require("body-parser");
var session = require('express-session');
var db = require("./models");
var flash = require("connect-flash");
// var M = require('materialize-css');
// var request = require("request");
app.use(bodyParser.urlencoded({extended: true}));

var ejsLayouts = require("express-ejs-layouts");
app.set("view engine", "ejs")
app.use(ejsLayouts);

app.use(express.static(__dirname + '/static/'));
// Put secret in env file
app.use(session({
  secret: process.env.SESSION_SECRET,
	resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(function(req, res, next) {
  // M.updateTextFields();
  if (req.session.userId) {
    db.user.findByPk(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      // console.log("Session id: " + req.session.id);
      next();
    });
  } else {
    console.log("session not recognized for user");
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});

app.get('/', function(req, res) {
  console.log("current user is: " + req.currentUser.username + " " + req.currentUser.id);
  res.render('index');
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

app.get("/login", function (req, res) {
  res.render("login");

});

app.get("/signup", function (req, res) {
  res.render("signup");
  console.log(req.user);
  if (!req.user) {
    req.flash("User already exists");
  }
});

app.get("/profile", function(req, res) {
	db.userfavorites.findAll({
    where: {
      userId: req.session.userId
    }
  }).then(function(favorites){
    if (req.currentUser) {
    res.render("profile", {
          favorites: favorites
    });
  } else {
    console.log('You must be logged in to view your profile');
  }

  });

});

app.use('/result', require('./controller/search'));
app.use('/auth', require('./controller/auth'));

app.listen(process.env.PORT || 3000)