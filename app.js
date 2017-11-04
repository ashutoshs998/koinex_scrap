var express = require('express');
var app = express();
var db = require('./koinex_db.js');
var routes = require('./index.js');

app.use('/', routes);
app.use(errorHandler);

function errorHandler(error, req, res, next) {
    if (error.status) {
        res.status(error.status).json({ error: error });
    } else {
        res.status(400).json({ error })
    }
}
app.listen(6001, function() {
    console.log("Server started at port number: 6001");
});