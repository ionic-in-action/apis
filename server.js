// Require stuff
var express = require('express');
var request = require('request');
var restaurants = require('./data/restaurants');
var weather = require('./data/weather');

// Some app level variables
var per_page = 10;
var app = express();
var port = process.env.PORT || 8080;

// Support CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Content-Type', 'application/json')
  next();
});

// GET restaurants endpoint
app.get('/restaurants', function (req, res) {

  // Get the page value from query or set to 1.
  var page = parseInt(req.query.page) || 1;
  var pages = Math.ceil(restaurants.length / per_page);

  // If requesting more pages than we have, send 404
  if (page > pages) {
    res.sendStatus(404);
  }

  // Get the index value to begin
  var index = per_page * (page - 1);

  // Construct the data object
  var data = {
    totalPages: pages,
    currentPage: page,
    restaurants: restaurants.slice(index, index + per_page)
  };

  // Return the object
  res.json(data);
});

// GET the weather
app.get('/weather', function (req, res) {
  request({
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=21.873457&lon=-159.453314&units=imperial&APPID=' + process.env.OPENMAP_KEY,
    timeout: 5000
  }, function (error, response, body) {
    if (!error) {
      // Send back data
      res.send(body);
    } else {
      // Just send back mock weather object since we had problems getting real data
      res.json(weather);
    }
  });
});

app.listen(port);
