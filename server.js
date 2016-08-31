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

        recordEntity.owner = item[0]
        recordEntity.time = item[1]
        recordEntity.lat = item[2]
        recordEntity.lng = item[3]
        recordEntity.unregisterCost = item[4]
        recordEntity.key = item[5]

        return recordEntity;
    });

    if (records) {
        if (req.query.format == "sjon") {
            res.send(records.join("|\n"));
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
Record.prototype.toString = function () {
    return JSON.stringify(this)
}