var express = require('express');
var db = require('../models');
var router = express.Router();

router.get('/signup', function(req, res) {
	res.render('signup');
});

router.post('/signup', function(req, res) {
  console.log("I am here");
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  db.user.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      username: username,
      password: password
    }
  }).spread(function(user, created) {  //created is a boolean
    if (created) {
      res.redirect('login');
    } else {
      res.send('User already exists');
    }
   }).catch(function(err) {
    res.send(err);
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
      console.log(req.session);
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



module.exports = router;
