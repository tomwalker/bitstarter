var fs = require('fs');

var buff = new Buffer(8);

fs.readFileSync('/index.html', function(err, data){
	if (err) throw err;
	buff.write(data);
});

var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(buff.toString);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});




