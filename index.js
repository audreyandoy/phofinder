var express = require("express");
var bodyParser = require("body-parser");
var ejsLayouts = require("express-ejs-layouts");
var session = require('express-session');
var db = require("./models");
var flash = require("flash");
var request = require("request");
var app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static/'));
app.use(ejsLayouts);
app.use(session({
	secret: 'abcdefghijklmnop',
	resave: false,
	saveUninitialized: true
}));

app.use(flash());

app.use(function(req, res, next) {
  if (req.session.userId) {
    db.user.findById(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    });
  } else {
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});

app.get('/', function(req, res) {
  console.log(req.currentUser);
  res.render('index');
});

app.get("/search", function(req, res) {
	if (req.currentUser) {
		res.render("search");
	} else {
		req.flash('You must be logged in to search for Pho!');
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
    res.render("profile", {
          favorites: favorites
    });
  } else {
    req.flash('You must be logged in to view your profile');
  }

  });

});

app.use('/result', require('./controller/search'));
app.use('/auth', require('./controller/auth'));

app.listen(process.env.PORT || 3000)