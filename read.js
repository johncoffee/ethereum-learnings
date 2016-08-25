var web3
var Web3

Web3 = require('web3');

// set the provider you want from Web3.providers
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//let from = web3.eth.coinbase;
//web3.eth.defaultAccount = from;

console.log("connected: " + web3.isConnected());

var theAddressWhereMyContractLives = "0xc92f9D2DFBdeF214A7fc2d2cF00F97d1e9804ee8";
var abiContractContent = `[ { "constant": false, "inputs": [], "name": "getTheAnswer", "outputs": [ { "name": "theAnswer", "type": "uint256" } ], "type": "function" }, { "constant": true, "inputs": [], "name": "theAnswer", "outputs": [ { "name": "", "type": "uint256", "value": "42" } ], "type": "function" }, { "inputs": [], "type": "constructor" } ]`

var abiJsonContract = JSON.parse(abiContractContent);
var daoTokenContract = web3.eth.contract(abiJsonContract);

var contractInstance = daoTokenContract.at(theAddressWhereMyContractLives);

console.log(contractInstance.theAnswer().toString() ) // returns a string
