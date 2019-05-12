var express = require('express');
var db = require('../models');
var router = express.Router();
var yelp = require('yelp-fusion');
var session = require('express-session');

const client = yelp.client(process.env.YELP_API_KEY)

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
		// window.document.getElementById('result').innerHTML = result;
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
		db.userfavorites.findOrCreate({
			where: {restName: restName,
							userId: userId
			},
				defaults: {
					 yelpId: yelpId,
						lat: lat,
						lng: lng
				}
		}).spread(function(userFavorite) {
			res.redirect('/profile');
			console.log(userFavorite);
		});
	});

// TODO: add more fields in model/db to hold more data about fav restaurants (address, phone number etc)




module.exports = router;
