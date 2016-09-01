
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
    this.lat = array[2]
    this.lng = array[3]
    this.unregisterCost = array[4]
    this.key = array[5]
}

Record.prototype.toString = function () {
    return JSON.stringify(this)
}

module.exports = Record