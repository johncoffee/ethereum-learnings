var solc = require('solc')
var fs = require('fs');

var cont = `
contract TheAnswer {
    address public owner;

    uint public constant theNumber = 42;

    function TheAnswer () {
        owner = msg.sender;      
    }

    function getTheNumber() returns (uint) {
        return theNumber;
    }
}
`


var input = {
    'TheAnswer.sol': cont, //contract Xxx {
};

var output = solc.compile({sources: input}, 1)

for (var contractName in output.contracts) {
	fs.writeFile(contractName, output.contracts[contractName].bytecode, function(err) {
    		if(err) 
       	 		return console.log(err);
    		
    		console.log("Done!");
	});

}

