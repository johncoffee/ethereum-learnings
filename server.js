var moment = require('moment');
var express = require('express');
var app = express();
var Api = require("./registry_api")
var bodyParser = require('body-parser')
var Record = require('./record')

// create application/json parser
var jsonParser = bodyParser.json()

api = new Api();

app.get('/', function (req, res) {
    res.send(`Hello World! <a href="//docs.registry4.apiary.io/">Documentation at apiary...</a>`);
});

const routes = {
    records: "/records",
    record: "/record",
    accounts: "/accounts",
    recordKey: "/record/:key",
    transfer: "/transfer"
};

app.get(routes.accounts, function (req, res) {
    var accounts = api.accounts();
    res.json({
        data: accounts
    });
});

app.get(routes.records, function (req, res) {

    var records = api.getRecords();

    records = records.map(function(item) {
        var recordEntity = new Record();
        recordEntity.fromWeb3Array(item);
        recordEntity.time = moment( new Date( recordEntity.time * 1000) ).format("YYYY-MM-DD HH:mm Z")
        return recordEntity;
    });

    if (records) {
        if (req.query.format == "sjon") {
            res.set('Content-Type', 'text/plain');
            res.send(records.join("\n"));
        }
        else {
            res.json(records); // not json because ... reasons
        }
    }
    else {
        res.status(500).json({error: "problems..."});
    }
});

app.get(routes.recordKey, function (req, res) {
    var key = req.params.key
    var array = api.getRecord(key);
    //console.log(array)
    var r = new Record()
    r.fromWeb3Array(array)
    r.key = key;

    if (r.time == 0) {
        res.sendStatus(404);
    }
    else if (r.time != 0) {
        res.json(r)
    }
    else {
        res.status(500).json({error: "problems..."});
    }
});

// transfer
app.put(routes.transfer, jsonParser, function (req, res) {
    if (!req.body) return res.status(500).json({error: "didn't parse JSON body"});
    if (!req.body.key) return res.sendStatus(400);

    var key = req.body.key;
    var to = req.body.to;
    var from = (req.body.from.length == 42) ? req.body.from : undefined;
    console.log(from.length)

    if (!to) return res.status(400).json({error: "no to"});
    //if (!from) return res.status(400).json({error: "no from"});

    api.transfer(key, from, to, function (err) {
        console.log(err)
        if (!err) {
            console.log("transfer");
            res.sendStatus(200);
        }
        else {
            res.sendStatus(500);
        }
    });
});

// create/update
app.put(routes.record, jsonParser, function (req, res) {
    if (!req.body) return res.status(500).json({error: "didn't parse JSON body"});

    var key = req.body.key
    var array = api.getRecord(key);
    var record = new Record()

    record.fromWeb3Array(array)
    var isNew = (record.time == 0)

    record.hydrate(req.body);
    record.lat = Record.uintFromLat(record.lat).toString()
    record.lng = Record.uintFromLng(record.lng).toString()

    if (isNew) {
        console.log('is new')
        record.key = key;
        api.register(record, callback);
    }
    else {
        console.log('is updated')
        api.updateLocation(record, callback);
    }

    function callback(err) {
        if (!err) {
            console.log("done");
            res.sendStatus(200);
        }
        else {
            res.sendStatus(500);
        }
    }
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});


