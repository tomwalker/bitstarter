var fs = require('fs');

var data = fs.readFileSync('index.html', 'utf8');

var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(data);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});





