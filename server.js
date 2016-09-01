var express = require('express');
var app = express();
var Api = require("./registry_api")

api = new Api();

app.get('/', function (req, res) {
    res.send(`Hello World! <a href="//docs.registry4.apiary.io/">Documentation at apiary...</a>`);
});

app.get('/records', function (req, res) {

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

app.get('/record/:key', function (req, res) {
    console.log(req.params.key);
    var record = api.getRecord();
    if (record) {
        res.json(record);
    }
    else {
        res.status(500).json({error: "problems..."});
    }
});


app.listen(3000, function () {
    console.log('Listening on port 3000!');
});



function Record () {
    this.key = 0;
    this.time = 0;
    this.unregisterCost = 0;
    this.owner = null;
    this.lat = 0;
    this.lng = 0;
}

Record.prototype.fromWeb3Array = function (array) {
    this.owner = array[0]
    this.time = array[1]
    this.lat = array[2]
    this.lng = array[3]
    this.unregisterCost = array[4]
    this.key = array[5]
}

Record.prototype.toString = function () {
    return JSON.stringify(this)
}