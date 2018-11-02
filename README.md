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




As a Link in the chain i am able to scan a code and see a products history.
- history is a list of addresses that have checked in and out

A Link is:
- a private key (address). 
- a link can have meta data

As a registrar I'm able to make an initial check-in

As a Destination I'm able to terminate the chain, 
- I'll scan the code, and pay to terminate.

1. country far away:
- make initial check-in

2. Link
- check in, check out
- define check-out criteria: Location (GPS)

3. close to the customer - Terminate
- terminate criteria: 



