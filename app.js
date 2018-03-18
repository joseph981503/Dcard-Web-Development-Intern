var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.enable('trust proxy');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var index = require('./routes/index');

app.use('/', index);
app.use(express.static(__dirname + '/public'));

var apis = require('./routes/api');


app.use('/api', apis);

require('jsdom/lib/old-api').env("", function(err, window) {
    if (err) {
       console.error(err);
       return;
   }

   var $ = require("jquery")(window);
})

var RateLimit = require('express-rate-limit');

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)


var Limiter = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window
  delayAfter: 1, // begin slowing down responses after the first request
  delayMs: 3*1000, // slow down subsequent responses by 3 seconds per request
  max: 10, // start blocking after 5 requests
  message: "Too many accounts created from this IP, please try again after an hour",
  headers: 'X-RateLimit-Limit'
});
app.use('/api', Limiter); //...

module.exports = app;
