const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));

const db = require('../models');

const saltRounds = 10;

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

function validUser(user) {
  // check if string and not empty/missing string
  const validEmail = typeof user.email == 'string' &&
    user.email.trim() != '' &&
    user.email.trim().length >= 6;

  const validPassword = typeof user.password == 'string' &&
    user.email.trim() != '' &&
    user.password.trim().length >= 6;

  return validEmail && validPassword;

}

router.post('/signup', function(req, res) {
    console.log("Beginning of signup post");
    var password = req.body.password;

  if (validUser(req.body)) {
    if (password === req.body.passwordValid) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        db.user.findOrCreate({
          where: {
            email: req.body.email
          },
          defaults: {
            username: req.body.username,
            password: hash
          }
        }).spread(function (user, created) {  //created is a boolean
          if (created) {
            console.log("users " + user);
            req.session.userId = user.id;
            res.redirect('/search');
          } else {
            res.render("signup", { alert: "An account with that email already exists." });    
          }
        })
      })
    } else {
      res.render("signup", { alert: "Passwords do not match. Try again." });    
    }
  } else {
    res.render("signup", {alert: "Password and/or Email needs to be longer than 6 characters"});
  }
});


router.post('/login', function(req, res) {
  db.user.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(user) {
    if(!user) {
      res.redirect('/signup');
    } else {
      bcrypt.compare(
        req.body.password, 
        user.password, 
        function (err, result) 
        {
          if (result == true) {
            //set user id
            req.session.userId = user.id;
            res.redirect('/'); 
          } else {
            res.render("login", {alert: "Wrong password or email"});
        }
      });
    }
  })

});

router.get('/logout', function(req, res) {
  console.log(req.session.userId + " logged off");
  req.session.userId = false;
  res.redirect('/');
})

router.get("/error", function(req, res) {
  res.render("error");
})

module.exports = router;
