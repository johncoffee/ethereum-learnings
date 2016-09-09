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
    recordWithKey: "/record/:key",
};

app.get(routes.accounts, function (req, res) {
    res.json(api.accounts());
});

app.get(routes.records, function (req, res) {

    var records = api.getRecords();

    records = records.map(function(item) {
        var recordEntity = new Record();
        recordEntity.fromWeb3Array(item);
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

// list
app.get(routes.recordWithKey, function (req, res) {
    console.log(req.params.key);
    var record = api.getRecord();
    if (record) {
        res.json(record);
    }
    else {
        res.status(500).json({error: "problems..."});
    }
});

// create
app.put(routes.record, jsonParser, function (req, res) {
    if (!req.body) return res.status(500).json({error: "didn't parse JSON body"});
    if (!req.body.key) return res.sendStatus(400);

    var record = new Record();
    record.hydrate(req.body);
    // fix
    record.lat = Record.uintFromLat(req.body.lat)
    record.lng = Record.uintFromLng(req.body.lng)

    api.register(record, function (err) {
        console.log(err)
        if (!err) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(500);
        }
    });
});

// update (PUT because Unity3D)
app.put(routes.recordWithKey, jsonParser, function (req, res) {

    if (!req.body) return res.status(500).json({error: "didn't parse JSON body"});
    if (!req.body.key) return res.sendStatus(400);

    var record = new Record();
    record.hydrate(req.body);
    // fix
    record.lat = Record.uintFromLat(req.body.lat)
    record.lng = Record.uintFromLng(req.body.lng)

    api.update(record, function (err) {
        console.log(err)
        if (!err) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(500);
        }
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});


