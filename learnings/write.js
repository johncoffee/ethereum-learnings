var web3
var fs
var Web3


Web3 = require('web3');

// set the provider you want from Web3.providers
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
console.log(`using NEW web3`);

let from = web3.eth.coinbase;
web3.eth.defaultAccount = from;

console.log("connected: " + web3.isConnected());

//contract MyWriteContract {
//    string public theName;
//
//    function MyWriteContract() {
//
//    }
//
//    function setTheName(string newName) {
//        theName = newName;
//    }
//}

var theAddressWhereMyContractLives = `0x5bDeD392181df4BA96B9b092B9382C364d235BaC`;
var abiContractContent = `[ { "constant": false, "inputs": [ { "name": "newName", "type": "string" } ], "name": "setTheName", "outputs": [], "type": "function" }, { "constant": true, "inputs": [], "name": "theName", "outputs": [ { "name": "", "type": "string", "value": "" } ], "type": "function" }, { "inputs": [], "type": "constructor" } ]`
var abiJsonContract = JSON.parse(abiContractContent);
var contract = web3.eth.contract(abiJsonContract);
var contractInstance = contract.at(theAddressWhereMyContractLives);

console.log(`theName was ` + contractInstance.theName().toString() ) // returns a string
var result = contractInstance.setTheName("blarhrhrh? " + Math.random() )
console.log(`setting the name... wait for it in the next block.`)
