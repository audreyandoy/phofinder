var express = require('express');
var db = require('../models');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
// var flash = require("connect-flash");

router.get('/signup', function(req, res) {
  res.render('signup');
});


router.post('/signup', function(req, res) {
  console.log("Beginning of signup function");
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  if (password === req.body.passwordValid) {
    //asynchronous hash
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
            console.log("users " + user);
            req.session.userId = user.id;
            req.flash('You are signed up');
            res.redirect('login');
          } else {
            console.log('user already exists');
            req.flash('A user previously signed up with that email address.');
            res.redirect(req.get('referer'));

            // user
            // var sendError = {'message': 'user already exists'};
            // res.render('signup', sendError)
            // res.status(400).send('User Already sExists');
          }
        }).catch(function(err) {
          console.log(err);
          req.flash('danger', 'Error!!!1');
        })
    })
  } else {
    req.flash('danger', 'Passwords do not match!~');
  }
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  // var email = req.body.email;
  var password = req.body.password;

  db.user.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(user) {
    if(!user) {
      res.redirect('/signup');
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result == true) {
          console.log("this user logged in now going home");
          //set user id
          req.session.userId = user.id;
          // console.log(user.id);
          res.redirect('/'); 
        } else {
          res.send('Incorrect password');
            console.log("WRONG PW");
        }
        // if (err) return callback(err);
        // callback(null, result ? user : false);
      });
    }
  })

});

router.get('/logout', function(req, res) {
  req.session.userId = false;
  res.redirect('/');
})

router.get("/error", function(req, res) {
  res.render("error");
})

module.exports = router;
