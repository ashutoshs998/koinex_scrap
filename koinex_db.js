var mongoose = require('mongoose');
var http = require('http');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
mongoose.Promise = global.Promise;
var conn = mongoose.connect('mongodb://localhost/koinex');
var koinex_data = mongoose.Schema({
    price: { type: Array },
    date: { type: String },
}, {
    collection: 'koinex_data',
    strict: true
});
var get_data = conn.model("get_data", koinex_data);
module.exports = {
    fetch: get_data,
}