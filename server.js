var app = require('./app');
var http = require("http");

var port = 8000;
app.set('port', '8000');

var server = http.createServer(app);


server.listen(port, function() {
  var sysmsg = 'System on and running, listening on port:' + port
  console.info('\x1b[33m%s\x1b[0m', sysmsg); //yellow
});
