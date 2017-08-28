const express = require('express');

var app = express();

const profiles = [{
    name: "ACME Corp",
    lat: 12.53,
    lng: 55.66,
},
{
    name: "Evil Corp",
    lat: 13.37,
    lng: 54.66,
},];

app.get("/profiles", function (req, res) {
    res.json(profiles);
});

app.get("/profile/:id", function (req, res) {
    res.json(profiles[0]);
});


module.exports = app;