const Web3 = require('web3');

// set the provider you want from Web3.providers
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.coinbase;


function Api() {

    let contractInstance = null

    function constructor() {

        var theAddressWhereMyContractLives = `
        0xfb4bdbd5e3991c7df566a3012d58f39ec54d0e6b
        `.trim()

        var abiContractContent = `
[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"keys","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"}],"name":"sendToOwners","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"lat","type":"uint16"},{"name":"lng","type":"uint16"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"amount","type":"uint256"}],"name":"distributeToOwners","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"rindex","type":"uint256"}],"name":"getRecordAtIndex","outputs":[{"name":"owner","type":"address"},{"name":"lat","type":"uint16"},{"name":"lng","type":"uint16"},{"name":"numOwners","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"}],"name":"getUnregisterCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"},{"name":"lat","type":"uint16"},{"name":"lng","type":"uint16"}],"name":"updateLocation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numRecords","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"int256"}],"name":"unregister","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"int256"}],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"int256"}],"name":"getRecord","outputs":[{"name":"owner","type":"address"},{"name":"lat","type":"uint16"},{"name":"lng","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"empty","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        `.trim()

        var abiJsonContract = JSON.parse(abiContractContent);
        var contract = web3.eth.contract(abiJsonContract);
        contractInstance = contract.at(theAddressWhereMyContractLives);

        console.log("connected: " + web3.isConnected());
    }

    this.accounts = function () {
        return web3.eth.accounts.map(function (address) {
            var balance = web3.eth.getBalance(address);
            return {
                address: address,
                balance: balance,
                balanceFinney: web3.fromWei(balance, 'finney'),
                toString: function() {
                    return JSON.stringify(this);
                }
            }
        })
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

    this.updateLocation = function (record, callback) {
        contractInstance.updateLocation(record.key, record.lat, record.lng, {gas: 190000}, callback);
    }

    this.transfer = function( key, from, to, callback) {
        console.log("transfer", key, to);
        contractInstance.transfer( key, to, {
            from: from,
            gas: 190000,
        }, callback);
    }

    constructor();
}


console.log(new Api().getRecords())

//var Record = require('./record')
//var r = new Record();
//r.key = 42
//r.lat = 666
//r.lng = 4242
//new Api().update(r)

//new Api().transfer("42", "0x40096D35bfaa7a2ba5E5cAf6206A307187A6148F")

module.exports = Api