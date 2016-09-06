"use strict";

function Record () {
    this.key = "";
    this.time = "";
    this.unregisterCost = "";
    this.owner = "";
    this.lat = "";
    this.lng = "";
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

    this.unregisterCost = array[4]
    this.key = array[5]

    this._debug_fromWeb3Array = array
}

Record.prototype.toString = function () {
    return JSON.stringify(this)
}


Record.prototype.setLatFromUint16 = function (value) {
    this.lat = Record.angleFromUint16(value, 90).toString()
}
Record.prototype.setLngFromUint16 = function (value) {
    this.lng = Record.angleFromUint16(value, 180).toString()
}

// static

Record.uint16Value = Math.pow(2, 16);

Record.angleFromUint16 = function(uint16String, maxAngle) {
    var value = (typeof uint16String === "string") ? parseFloat(uint16String) : uint16String;
    value = Math.min(value, Record.uint16Value)
    value = Math.max(value, 0)
    return -maxAngle + ( value / Record.uint16Value) * maxAngle*2
}

Record.uint16FromLat = function (value) {
    value = (typeof value === "string") ? parseFloat(value) : value;
    return Record.uint16FromAngle(value, 90)
}

Record.uint16FromLng = function (value) {
    value = (typeof value === "string") ? parseFloat(value) : value;
    return Record.uint16FromAngle(value, 180)
}

Record.uint16FromAngle = function (value, maxAngle) {
    value = (value+maxAngle) / (maxAngle*2)
    return value * Record.uint16Value
}


module.exports = Record