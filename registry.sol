contract Owned {
  function owned() { owner = msg.sender; }

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
        suicide(owner);
    }
}

// This is the base contract that your contract derr extends from.
contract BaseRegistry is Owned {
    uint8 public constant UNREGISTER_COST = 255;

    // This struct keeps all data for a Record.
    struct Record {
        // Keeps the address of this record creator.
        // Keeps the time when this record was created.
        uint time;
        // Keeps the index of the keys array for fast lookup
        uint keysIndex;
        bytes20 btih;
        address[] owners;
    }

    // This mapping keeps the records of this Registry.
    mapping(address => Record) records;

    // Keeps the total numbers of records in this Registry.
    uint public numRecords;

    // Keeps a list of all keys to interate the records.
    address[] public keys;


    modifier onlyRecordOwner(address key, address sender) {
        address owner = getOwner(key);
        if (owner != sender) throw;
        _
    }

    // This is the function that actually insert a record.
    function register(address key, bytes20 btih) {
        if (records[key].time == 0) {
            records[key].time = now;
            records[key].keysIndex = keys.length;
            records[key].owners.push(msg.sender);
            keys.length++;
            keys[keys.length - 1] = key;
            records[key].btih = btih;
            numRecords++;
        } else {
            throw;
        }
    }

    // Updates the values of the given record.
    function update(address key, bytes20 btih) onlyRecordOwner(key, msg.sender) {
        records[key].btih = btih;
    }

    // Unregister a given record
    function unregister(address key) onlyRecordOwner(key, msg.sender) {
        if (msg.value == UNREGISTER_COST) {
            distributeValueToOwners(key, msg.value);

            uint keysIndex = records[key].keysIndex;
            delete records[key];
            numRecords--;
            keys[keysIndex] = keys[keys.length - 1];
            records[keys[keysIndex]].keysIndex = keysIndex;
            keys.length--;
        }
    }

    function distributeValueToOwners(address key, uint value) {
        Record record = records[key];
        uint amountEach = value / (record.owners.length - 1);
        for (uint8 i = 0; i < record.owners.length - 1; i++) {
            address owner = record.owners[i];
            owner.send(amountEach);
        }
    }

    // Transfer ownership of a given record.
    function transfer(address key, address newOwner) {
        address owner = getOwner(key);
        if (owner == msg.sender) {
            records[key].owners.push(newOwner);
        } else {
            throw;
        }
    }

    // Tells whether a given key is registered.
    function isRegistered(address key) returns(bool) {
        return records[key].time != 0;
    }

    function getRecordAtIndex(uint rindex) returns(address key, address owner, uint time, bytes20 btih) {
        Record record = records[keys[rindex]];
        key = keys[rindex];
        owner = getOwner(key);
        time = record.time;
        btih = record.btih;
    }

    function getRecord(address key) returns(address owner, uint time, bytes32 btih) {
        Record record = records[key];
        owner = getOwner(key);
        time = record.time;
        btih = record.btih;
    }

    // Returns the owner of the given record. The owner could also be get
    // by using the function getRecord but in that case all record attributes
    // are returned.
    function getOwner(address key) returns(address) {
        Record record = records[key];
        return record.owners[record.owners.length-1];
    }

    // Returns the registration time of the given record. The time could also
    // be get by using the function getRecord but in that case all record attributes
    // are returned.
    function getTime(address key) returns(uint) {
        return records[key].time;
    }

    // Registry owner can use this function to withdraw any value owned by
    // the registry.
    function withdraw(address to, uint value) onlyOwner {
        to.send(value);
    }
}

contract Registry is BaseRegistry {}