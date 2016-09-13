// pragma solidity 0.2.0;

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
        if (msg.sender != owner) throw;
        _
    }

    function kill() onlyOwner {
        selfdestruct(owner);
    }
}

contract BaseRegistry is Owned {
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
        if (owner != sender) throw;
        _
    }

    // This is the function that actually insert a record.
    function register(int key, uint16 lat, uint16 lng) {
        if (records[key].time == 0) {
            records[key].time = now;
            records[key].keysIndex = keys.length;
            records[key].owners.push(msg.sender);
            records[key].lat = lat;
            records[key].lng = lng;

            // not sure why we dont use .push?
            keys.length++;
            keys[keys.length - 1] = key;

            numRecords++;
        } else {
            throw;
        }
    }

    function updateLocation(int key, uint16 lat, uint16 lng) onlyRecordOwner(key, msg.sender) {
        records[key].lat = lat;
        records[key].lng = lng;
    }

    function getUnregisterCost(int key) returns (uint cost) {
        Record record = records[key];
        return record.owners.length * 1000;
    }

    // Unregister a given record
    function unregister(int key) onlyRecordOwner(key, msg.sender) {
        Record record = records[key];

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
    function sendToOwners(int key) {
        Record record = records[key];
        distributeToOwners(key, msg.value);
    }

     function distributeToOwners(int key, uint amount) {
        Record record = records[key];
        uint rest = amount % record.owners.length; // rest is accumulated on the registry address
        uint amountEach = (amount-rest) / record.owners.length;
        address owner;

        for (uint i = 0; i < record.owners.length; i++) {
            owner = record.owners[i];
            if (owner.send(amountEach)) {
                // nothing to do
            }
        }

        record.owners[0].send(rest); // rest to the initial creator
    }


    // Transfer ownership of a given record.
    function transfer(int key, address newOwner) {
        address owner = getOwner(key);
        if (owner == msg.sender) {
            records[key].owners.push(newOwner);
        } else {
            throw;
        }
    }

    // Tells whether a given key is registered.
    function isRegistered(int key) public constant returns(bool) {
        return records[key].time != 0;
    }

    function getRecordAtIndex(uint rindex) public constant returns(address owner, uint time, uint16 lat, uint16 lng, uint numOwners) {
        int key = keys[rindex];
        Record record = records[key];
        owner = getOwner(key);
        time = record.time;
        lat = record.lat;
        lng = record.lng;
        numOwners = record.owners.length;
    }

    function getRecord(int key) public constant returns(address owner, uint time, uint16 lat, uint16 lng) {
        Record record = records[key];
        owner = getOwner(key);
        time = record.time;
        lat = record.lat;
        lng = record.lng;
    }

    // Returns the owner (address) of the given record.
    function getOwner(int key)  public constant returns(address) {
        Record record = records[key];
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
            owner.send(this.balance);
        }
    }
}

contract Registry is BaseRegistry {}