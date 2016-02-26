var express = require('express');
var db = require('../models');
var router = express.Router();
var yelp = require('yelp');
var session = require('express-session');


var yelp = new yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_ACCESS_TOKEN,
  token_secret: process.env.YELP_ACCESS_TOKEN_SECRET
});


// router.get("/result", function(req, res) {
//   console.log(req.query);
//   request('https://api.yelp.com/v2/search?term=food&location='+req.query.search, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.send(body); // Show the HTML for the Google homepage.
//     }
//   });

// });

// See http://www.yelp.com/developers/documentation/v2/search_api
router.get('/', function(req, res) {
console.log(req.session.userId);
	yelp.search({ term: 'pho', location: req.query.search })
	.then(function (data) {
	  res.render('result', {data: data});
	})
	.catch(function (err) {
	  console.error(err);
	});

});

router.post('/', function(req, res) {
	var userId = req.session.userId;
	var yelpId = req.body.yelpID;
	var restName = req.body.restName;
	var lat = req.body.lat;
	var lng = req.body.lng;
	db.userfavorites.findOrCreate({
		userId: userId,
		restName: restName,
		yelpId: yelpId,
		lat: lat,
		lng: lng
	}).then(function(userFavorite) {
		res.redirect('profile');
	});
});



// router.post('/result', function(req, res) {
//   console.log("I am here");
//   var restName = req.body.restName;
//   var yelpId = req.body.yelpId;
//   var lat = req.body.lat;
//   var lng = req.body.lng;

//   db.user.findOrCreate({
//     where: {
//       restName: restName
//     },
//     defaults: {
//       yelpId: yelpId,
//       lat: lat,
//       lng: lng
//     }
//   }).spread(function(user, created) {  //created is a boolean
//     if (created) {
//       res.redirect('/');
//     } else {
//       res.send('User already exists');
//     }
//    }).catch(function(err) {
//     res.send(err);
//    });
// });


// See http://www.yelp.com/developers/documentation/v2/business
// yelp.business('yelp-san-francisco')
//   .then(console.log)
//   .catch(console.error);

// yelp.phoneSearch({ phone: '+15555555555' })
//   .then(console.log)
//   .catch(console.error);

// A callback based API is also available:
// yelp.business('yelp-san-francisco', function(err, data) {
//   if (err) return console.log(error);
//   console.log(data);
// });


module.exports = router;
