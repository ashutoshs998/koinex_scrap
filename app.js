var express = require('express');
var app = express();
var db = require('./koinex_db.js');
var routes = require('./index.js');

app.use('/', routes);
app.listen(6001, function() {
    console.log("Server started at port number: 6001");
});