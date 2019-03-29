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


// See http://www.yelp.com/developers/documentation/v2/search_api
router.get('/', function(req, res) {
console.log("---Search page session--- "+ req.session.userId);
	yelp.search({ term: 'pho', location: req.query.search, radius_filter: 16093.4, limit: 12 })
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
   	db.user.findById(userId).then(function(user){
		db.userfavorites.findOrCreate({
			where: {restName: restName},
				defaults: {
					 userId: userId,
					 yelpId: yelpId,
						lat: lat,
						lng: lng
				}
		}).spread(function(userFavorite) {
			res.redirect('/profile');
		});
	});
});





module.exports = router;
