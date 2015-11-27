var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
var stocks = [];
// Use html
app.use(express.static(path.resolve(__dirname, "client")));
// Listen on port
server.listen(process.env.PORT || 3000);
