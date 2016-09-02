
function Record () {
    this.key = 0;
    this.time = 0;
    this.unregisterCost = 0;
    this.owner = null;
    this.lat = 0;
    this.lng = 0;
}

Record.prototype.hydrate = function (values) {
    for (var i in values) if (this.hasOwnProperty(i)) {
        this[i] = values[i];
    }
}

Record.prototype.fromWeb3Array = function (array) {
    this.owner = array[0]
    this.time = array[1]

    this.lat = Record.splitInt(array[2], 3)
    this.lng = Record.splitInt(array[3], 3)

    this.unregisterCost = array[4]
    this.key = array[5]

    this._debug_fromWeb3Array = array
}

Record.prototype.toString = function () {
    return JSON.stringify(this)
}

// input: "1267", 2 output: 67.12
Record.splitInt = function (int, precision) {
    if (typeof int !== "string")
        int = int.toString();

    if (int.length > precision)
        int = int.substring(int.length-precision, int.length ) + "." + int.substring(0, int.length-precision);

    return int;
}

module.exports = Record