var express = require("express");
var app = express();
var fallback = require('express-history-api-fallback');
var PROD = "prod";
var root = express.static(PROD);
app.use(root);
app.use(fallback('index.html', { root: PROD }))
app.get('/',function(req, res){
  res.sendFile('index.html');
});

var portServer = Number(process.env.PORT || 3000);
var server = app.listen(portServer, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
});
