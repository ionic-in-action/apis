// Require stuff
var express = require('express');
var restaurants = require('./data/restaurants');

// Some app level variables
var per_page = 10;
var app = express();
var port = process.env.PORT || 8080;

// GET restaurants endpoint
app.get('/api/restaurants', function (req, res) {

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

app.listen(port);
