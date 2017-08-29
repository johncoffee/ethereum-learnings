pragma solidity ^0.4.13;

contract Owned {

    function Owned() {
        owner = msg.sender;
    }

    // The owner of this registry.
    address public owner = msg.sender;

    // This contract only defines a modifier but does not use it - it will
    // be used in derived contracts.
    // The function body is inserted where the special symbol "_" in the
    // definition of a modifier appears.
    modifier onlyOwner {
        require(msg.sender != owner);
        _;
    }

    function kill() onlyOwner {
        selfdestruct(owner);
    }
}

contract Registry is Owned {
    // This struct keeps all data for a Record.
    struct Record {
    // Keeps the address of this record creator.
    // Keeps the time when this record was created.
    uint time;
    // Keeps the index of the keys array for fast lookup
    uint keysIndex;

    uint16 lat;
    uint16 lng;
    address[] owners;
    }

    // for paying participants
    mapping(address => int) wallets;

    // This mapping keeps the records of this Registry.
    mapping(int => Record) records;

    // Keeps the total numbers of records in this Registry.
    uint public numRecords;

    // Keeps a list of all keys to interate the records.
    int[] public keys;

    modifier onlyRecordOwner(int key, address sender) {
        address owner = getOwner(key);
        require(owner != sender);
        _;
    }

    // This is the function that actually insert a record.
    function register(int key, uint16 lat, uint16 lng) {
        require (records[key].time == 0);

        records[key].time = now;
        records[key].keysIndex = keys.length;
        records[key].owners.push(msg.sender);
        records[key].lat = lat;
        records[key].lng = lng;

        keys.length++;
        keys[keys.length - 1] = key;

        numRecords++;
    }

    function updateLocation(int key, uint16 lat, uint16 lng) onlyRecordOwner(key, msg.sender) {
        records[key].lat = lat;
        records[key].lng = lng;
    }

    function getUnregisterCost(int key) returns (uint cost) {
        Record storage record = records[key];
        return record.owners.length * 1000;
    }

    // Unregister a given record
    function unregister(int key) onlyRecordOwner(key, msg.sender) payable {
        Record storage record = records[key];

        if (record.owners.length > 1) {
            uint unregisterCost = getUnregisterCost(key);
            if (msg.value == unregisterCost) {
                distributeToOwners(key, msg.value);
            }
        }

        uint keysIndex = record.keysIndex;
        delete records[key];
        numRecords--;
        keys[keysIndex] = keys[keys.length - 1];
        records[keys[keysIndex]].keysIndex = keysIndex;
        keys.length--;
    }

    // for testing
    function sendToOwners(int key) payable {
        distributeToOwners(key, msg.value);
    }

    function distributeToOwners(int key, uint amount) {
        Record storage record = records[key];
        uint rest = amount % record.owners.length; // rest is accumulated on the registry address
        uint amountEach = (amount-rest) / record.owners.length;
        address owner;

        for (uint i = 0; i < record.owners.length; i++) {
            owner = record.owners[i];
            owner.transfer(amountEach);
        }

        record.owners[0].transfer(rest); // rest to the initial creator
    }


    // Transfer ownership of a given record.
    function transfer(int key, address newOwner) {
        address owner = getOwner(key);
        require (owner == msg.sender);

        records[key].owners.push(newOwner);
    }

    // Tells whether a given key is registered.
    function isRegistered(int key) public constant returns(bool) {
        return records[key].time != 0;
    }

    function getRecordAtIndex(uint rindex) public constant returns(address owner, uint time, uint16 lat, uint16 lng, uint numOwners) {
        int key = keys[rindex];
        Record storage record = records[key];
        owner = getOwner(key);
        time = record.time;
        lat = record.lat;
        lng = record.lng;
        numOwners = record.owners.length;
    }

    function getRecord(int key) public constant returns(address owner, uint time, uint16 lat, uint16 lng) {
        Record storage record = records[key];
        owner = getOwner(key);
        time = record.time;
        lat = record.lat;
        lng = record.lng;
    }

    // Returns the owner (address) of the given record.
    function getOwner(int key)  public constant returns(address) {
        Record storage record = records[key];
        return record.owners[record.owners.length-1];
    }

    // Returns the registration time of the given record. The time could also
    // be get by using the function getRecord but in that case all record attributes
    // are returned.
    function getTime(int key)  public constant returns(uint) {
        return records[key].time;
    }

    function empty() onlyOwner {
        if (this.balance > 0) {
            owner.transfer(this.balance);
        }
    }
}
