"use strict";

function Record () {
    this.key = "";
    this.time = "";
    this.owner = "";
    this.lat = "";
    this.lng = "";

    Object.seal(this)
}

Record.prototype.hydrate = function (values) {
    for (var i in values) if (this.hasOwnProperty(i)) {
        this[i] = values[i];
    }
}

Record.prototype.fromWeb3Array = function (array) {
    this.owner = array[0]
    this.time = array[1]

    this.setLatFromUint16(array[2])
    this.setLngFromUint16(array[3])

    this.key = array[4]
}

Record.prototype.toString = function () {
    return JSON.stringify(this)
}


Record.prototype.setLatFromUint16 = function (value) {
    this.lat = Record.angleFromUint(value, 90).toString()
}
Record.prototype.setLngFromUint16 = function (value) {
    this.lng = Record.angleFromUint(value, 180).toString()
}

// static

Record.uintSize = Math.pow(2, 16);

Record.angleFromUint = function(uint16String, maxAngle) {
    var value = (typeof uint16String === "string") ? parseFloat(uint16String) : uint16String;
    value = Math.min(value, Record.uintSize)
    value = Math.max(value, 0)
    return -maxAngle + ( value / Record.uintSize) * maxAngle*2
}

Record.uintFromLat = function (value) {
    value = (typeof value === "string") ? parseFloat(value) : value;
    return Record.uintFromAngle(value, 90)
}

Record.uintFromLng = function (value) {
    value = (typeof value === "string") ? parseFloat(value) : value;
    return Record.uintFromAngle(value, 180)
}

Record.uintFromAngle = function (value, maxAngle) {
    value = (value+maxAngle) / (maxAngle*2)
    return Math.round(value * Record.uintSize)
}


module.exports = Record