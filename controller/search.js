var express = require('express');
var db = require('../models');
var router = express.Router();
var yelp = require('yelp-fusion');
var session = require('express-session');


const client = yelp.client(process.env.YELP_API_KEY)

// var yelp = new yelp({
//   consumer_key: process.env.YELP_CONSUMER_KEY,
//   // consumer_secret: process.env.YELP_CONSUMER_SECRET,
//   // token: process.env.YELP_ACCESS_TOKEN,
//   // token_secret: process.env.YELP_ACCESS_TOKEN_SECRET
// });


// See https://www.yelp.com/developers/documentation/v3/business_search
router.get('/', function(req, res) {
console.log("---Search page session--- "+ req.session.userId);
const searchRequest = {
	term: 'pho',
	location:
		req.query.search,
	radius_filter: 16093.4,
	limit: 12 
}

client.search(searchRequest).then(data => {
	const result = data.jsonBody.businesses;
	console.log(result);
		// const prettyJson = JSON.stringify(firstResult, null, 4)
		// console.log("businesses " + prettyJson);
	  res.render('result', {data: result});
	}).catch(function (err) {
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
