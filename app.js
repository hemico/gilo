var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'web','dist');

app.use(express.static(publicDir))

app.listen(port);
module.exports = app;
