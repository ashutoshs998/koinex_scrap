var express = require('express');
var app = express();
var router = express.Router();
var db = require('./koinex_db');
var phantomjs = require('phantomjs');
router.get('/fetch/koinex', function(req, res, callback) {
    try {
        var Spooky = require('spooky');
    } catch (e) {
        var Spooky = require('../lib/spooky');
    }
    var prices;

    function doScrap(URL, callback) {
        var spooky = new Spooky({
            child: {
                transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                verbose: true,
            }
        }, function(err) {
            if (err) {
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }
            spooky.start('https://koinex.in/api/ticker');
            spooky.then(function() {
                this.emit('output', this.evaluate(function() {
                    return JSON.parse(document.body.textContent);
                }));
            });
            spooky.run();
        });
        spooky.on('error', function(e, stack) {
            console.error(e);
            if (stack) {}
        });
        spooky.on('console', function(line) {});

        spooky.on('output', function(body) {
            prices = {
                "BTC/INR": body.prices.BTC,
                "ETH/INR": body.prices.ETH,
                "XRP/INR": body.prices.XRP,
                "LTC/INR": body.prices.LTC,
                "BCH/INR": body.prices.BCH
            }
            // console.log(prices)
            koinex_data = new db.fetch({
                price: prices,
            })
            koinex_data.save(function(err) {
                if (err) {
                    res.status(400).json({ error: 1, message: "check email or password" });
                }
            })
            callback(prices);
        });
        spooky.on('log', function(log) {
            if (log.space === 'remote') {
                console.log(log.message.replace(/ \- .*/, ''));
            }
        });
    }

    setInterval(function() {
        doScrap('', function(output) {
            res.json(output)
        })
    }, 60000);
});
module.exports = router;