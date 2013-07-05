var fs = require('fs');

fs.readFile('/index.html', function(err, data){
	if (err) throw err;
	var buff = new Buffer(data);
});

var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(buff);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});




