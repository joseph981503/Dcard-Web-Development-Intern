var express = require('express');
var router = express.Router();
var RateLimit = require('express-rate-limit');
var Limiter = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window
  max: 1000, // start blocking after 1000 requests
  message: "Too many accounts created from this IP, please try again after an hour",

});

router.get('/', function(req, res) {
    res.render('api');
});

router.post('/get', Limiter, function(req, res) {
    res.end();
})

module.exports = router;
