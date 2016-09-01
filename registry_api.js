var web3
var Web3

Web3 = require('web3');

// set the provider you want from Web3.providers
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.coinbase;


function Api() {

    contractInstance = null

    function constructor() {


        var theAddressWhereMyContractLives = `0xeb3c9df5acdce39bc57cd563d83c522e63a371ce`.trim()

        var abiContractContent = `

[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"keys","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"lat","type":"int256"},{"name":"lng","type":"int256"}],"name":"update","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"}],"name":"registerSimple","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"rindex","type":"uint256"}],"name":"getRecordAtIndex","outputs":[{"name":"owner","type":"address"},{"name":"time","type":"uint256"},{"name":"lat","type":"int256"},{"name":"lng","type":"int256"},{"name":"unregisterCost","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"key","type":"int256"}],"name":"isRegistered","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"numRecords","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"lat","type":"int256"},{"name":"lng","type":"int256"}],"name":"register","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"}],"name":"unregister","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"key","type":"int256"}],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"key","type":"int256"}],"name":"getOwner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"key","type":"int256"}],"name":"getRecord","outputs":[{"name":"owner","type":"address"},{"name":"time","type":"uint256"},{"name":"lat","type":"int256"},{"name":"lng","type":"int256"},{"name":"unregisterCost","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"empty","outputs":[],"type":"function"}]


        `

        var abiJsonContract = JSON.parse(abiContractContent);
        var contract = web3.eth.contract(abiJsonContract);
        contractInstance = contract.at(theAddressWhereMyContractLives);

        console.log("connected: " + web3.isConnected());
    }

    this.getRecords = function () {
        var records = getKeys().map(function(item) {
            var r = contractInstance.getRecord(item)
            r.push(item)
            return r.map(function(item) {
                return item.toString()
            })
        })

        return records
    }

    this.getRecord = function (key) {
        return contractInstance.getRecord(key).map(function(item) {
            return item.toString()
        })
    }

    this.update = function (record, callback) {
        contractInstance.update(record.key, record.lat, record.lng, {gas: 190000}, callback);
    }

    function getKeys() {
        var keys = [];

        var numRecords = contractInstance.numRecords();

        for (var i = 0; i < numRecords; i++) {
            var result = contractInstance.keys(i)
            var k = result.c[0]
            keys.push(result.c[0])
            console.assert( Array.isArray(result.c), "result.c should be array")
            console.assert( k, "result.c[0] should contain something")
        }

        return keys
    }

    this.register =  function( record, callback ) {
        contractInstance.register(record.key, record.lat, record.lng, {gas: 1000000}, callback);
    }

    this.transfer = function( key, newOwner) {
        console.log("transfer", key, newOwner);
        contractInstance.transfer( key, newOwner);
    }

    constructor();
}


//console.log(new Api().getRecords())

//var Record = require('./record')
//var r = new Record();
//r.key = 42
//r.lat = 666
//r.lng = 4242
//new Api().update(r)

//new Api().transfer("42", "0x40096D35bfaa7a2ba5E5cAf6206A307187A6148F")

module.exports = Api