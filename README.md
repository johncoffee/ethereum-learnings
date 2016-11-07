# ethereum-learnings
just me playing around with solidity, Mist and geth 

## installation

`brew install ethereum`

Use Mist to deploy the contract. Use testnet for now. 

`npm install`

## running

`geth --testnet --unlock="0" --rpc --rpcapi "db,eth,net,web3" --rpcaddr "localhost" --rpccorsdomain "*" console`

`node server.js`

Lookup geth for more info on configuration.


## random notes

Run Mist on OSX, pointing it to running geth node:

`/Applications/Mist.app/Contents/MacOS/Mist --rpc "/Users/USERNAME/Library/Ethereum/testnet/geth.ipc"`
