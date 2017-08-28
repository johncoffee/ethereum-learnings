const Api = require("./registry_api")
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser')
const Record = require('./record')

const app = express();

// create application/json parser
const jsonParser = bodyParser.json()

const api = new Api();

app.get("/accounts", function (req, res) {
    const accounts = api.accounts();
    res.json({
        data: accounts
    });
});

app.get("/records", function (req, res) {
    const records = api.getRecords();

    const recordsEnt = records.map(function(item) {
        const recordEntity = new Record();
        recordEntity.fromWeb3Array(item);
        recordEntity.time = moment( new Date( recordEntity.time * 1000) ).format("YYYY-MM-DD HH:mm Z")
        return recordEntity;
    });


    if (req.query.format === "sjon") {
        res.set('Content-Type', 'text/plain');
        res.send(recordsEnt.join("\n")); // not json because ... reasons
    }
    else {
        res.json(recordsEnt);
    }

});

app.get("/record/:key", function (req, res) {
    const key = req.params.key
    const array = api.getRecord(key);
    //console.log(array)
    const r = new Record()
    r.fromWeb3Array(array)
    r.key = key;

    if (r.time === 0) {
        res.sendStatus(404);
    }
    else if (r.time !== 0) {
        res.json(r)
    }
    else {
        res.status(500).json({error: "problems..."});
    }
});

// transfer
app.put("/transfer", jsonParser, function (req, res) {
    if (!req.body) return res.status(500).json({error: "didn't parse JSON body"});
    if (!req.body.key) return res.sendStatus(400);

    const key = req.body.key;
    const to = req.body.to;
    const from = (req.body.from.length === 42) ? req.body.from : undefined;
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
app.put("/record", jsonParser, function (req, res) {
    if (!req.body) return res.status(500).json({error: "didn't parse JSON body"});

    const key = req.body.key
    const array = api.getRecord(key);
    const record = new Record()

    record.fromWeb3Array(array)
    const isNew = (record.time === 0)

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


module.exports = app