var express = require('express');
var db = require('../models');
var router = express.Router();
var flash = require("flash");
var bcrypt = require('bcrypt');
const saltRounds = 10;
router.use(flash());

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  console.log("I am here");
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

bcrypt.hash(password, saltRounds, function(err, hash) {
    db.user.findOrCreate({
      where: {
        email: email
      },
      defaults: {
        username: username,
        password: hash
      }
    }).spread(function(user, created) {  //created is a boolean
      if (created) {
        console.log('redirected');
        console.log("users pw: " + user.password);
        res.redirect('login');
      } else {
        // Materialize.toast('User already exists', 1000);
        console.log('User already exists');
        console.error();
        
      }
    }).catch(function(err) {
      res.redirect('error');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db.user.authenticate(email, password, function(err, user) {
    if (err) {
      res.send(err);
    } else if (user){
      req.session.userId = user.id;
      console.log("----Session----"+ req.session);
      res.redirect('/search');

    } else {
      res.redirect('login');
    
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.userId = false;
  res.redirect('/');
})

router.get("/error", function(req, res) {
  res.render("error");
})

module.exports = router;
